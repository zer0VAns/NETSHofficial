const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

// Procesar checkout
router.post('/', authMiddleware, async (req, res) => {
  const { user_id, items, total, customer_email, payment_method } = req.body;

  try {
    // Validar datos
    if (!user_id || !items || !total || !customer_email || !payment_method) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Verificar que el usuario existe
    const user = await pool.query('SELECT id FROM users WHERE id = $1', [user_id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar stock de productos
    for (const item of items) {
      const product = await pool.query('SELECT stock, price FROM products WHERE id = $1', [item.product_id]);
      if (product.rows.length === 0) {
        return res.status(404).json({ error: `Producto con ID ${item.product_id} no encontrado` });
      }
      if (product.rows[0].stock < item.quantity) {
        return res.status(400).json({ error: `Stock insuficiente para el producto con ID ${item.product_id}` });
      }
      if (product.rows[0].price !== item.price) {
        return res.status(400).json({ error: `El precio del producto con ID ${item.product_id} no coincide` });
      }
    }

    // Iniciar transacción
    await pool.query('BEGIN');

    // Crear la orden
    const orderResult = await pool.query(
      'INSERT INTO orders (user_id, customer_email, total, payment_method) VALUES ($1, $2, $3, $4) RETURNING id',
      [user_id, customer_email, total, payment_method]
    );
    const orderId = orderResult.rows[0].id;

    // Insertar ítems de la orden
    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.product_id, item.quantity, item.price]
      );
      // Actualizar stock
      await pool.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.product_id]);
    }

    // Limpiar el carrito del usuario
    await pool.query('DELETE FROM cart WHERE user_id = $1', [user_id]);

    // Confirmar transacción
    await pool.query('COMMIT');

    res.status(201).json({ message: 'Compra realizada con éxito', orderId });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error durante el checkout:', error);
    res.status(500).json({ error: 'Error al procesar la compra', details: error.message });
  }
});

module.exports = router;