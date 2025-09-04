const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

// Obtener items del carrito
router.get('/:userId', authMiddleware, async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT c.id, c.item_id, c.item_type, c.quantity, 
              CASE 
                WHEN c.item_type = 'product' THEN p.name 
                WHEN c.item_type = 'service' THEN s.name 
              END AS name,
              CASE 
                WHEN c.item_type = 'product' THEN p.price 
                WHEN c.item_type = 'service' THEN s.price 
              END AS price
       FROM cart c
       LEFT JOIN products p ON c.item_id = p.id AND c.item_type = 'product'
       LEFT JOIN services s ON c.item_id = s.id AND c.item_type = 'service'
       WHERE c.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Añadir item al carrito
router.post('/', authMiddleware, async (req, res) => {
  const { user_id, item_id, item_type, quantity } = req.body;
  try {
    // Validar datos
    if (!user_id || !item_id || !item_type || !quantity) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Verificar que el producto existe
    if (item_type === 'product') {
      const product = await pool.query('SELECT id, stock, price, name FROM products WHERE id = $1', [item_id]);
      if (product.rows.length === 0) {
        return res.status(404).json({ error: `Producto con ID ${item_id} no encontrado` });
      }
      if (product.rows[0].stock < quantity) {
        return res.status(400).json({ error: 'Stock insuficiente' });
      }
    }

    // Verificar si el item ya existe en el carrito
    const existingItem = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1 AND item_id = $2 AND item_type = $3',
      [user_id, item_id, item_type]
    );

    if (existingItem.rows.length > 0) {
      const updatedItem = await pool.query(
        `UPDATE cart SET quantity = quantity + $1 
         WHERE user_id = $2 AND item_id = $3 AND item_type = $4 
         RETURNING id, user_id, item_id, item_type, quantity, 
                   (SELECT name FROM products WHERE id = $3) AS name, 
                   (SELECT price FROM products WHERE id = $3) AS price`,
        [quantity, user_id, item_id, item_type]
      );
      res.json(updatedItem.rows[0]);
    } else {
      const newItem = await pool.query(
        `INSERT INTO cart (user_id, item_id, item_type, quantity) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, user_id, item_id, item_type, quantity, 
                   (SELECT name FROM products WHERE id = $2) AS name, 
                   (SELECT price FROM products WHERE id = $2) AS price`,
        [user_id, item_id, item_type, quantity]
      );
      res.json(newItem.rows[0]);
    }
  } catch (error) {
    console.error('Error al añadir al carrito:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Actualizar cantidad de un item
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    const result = await pool.query(
      `UPDATE cart SET quantity = $1 
       WHERE id = $2 
       RETURNING id, user_id, item_id, item_type, quantity, 
                 (SELECT name FROM products WHERE id = cart.item_id) AS name, 
                 (SELECT price FROM products WHERE id = cart.item_id) AS price`,
      [quantity, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar el carrito:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Eliminar item del carrito
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM cart WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item removed' });
  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Limpiar todo el carrito de un usuario
router.delete('/user/:userId', authMiddleware, async (req, res) => {
  const { userId } = req.params;
  try {
    await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);
    res.json({ message: 'Carrito limpiado' });
  } catch (error) {
    console.error('Error al limpiar el carrito:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;