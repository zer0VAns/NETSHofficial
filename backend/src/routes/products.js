const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Obtener todos los productos con opción de filtrar por categoria y subcategoria
router.get('/', async (req, res) => {
  const { category, subcategory } = req.query;
  let query = 'SELECT * FROM products';
  let queryParams = [];

  // Filtrar por categoria si se pasa en la query
  if (category) {
    query += ' WHERE category = $1';
    queryParams.push(category);
    
    // Si se pasa una subcategoria, añadir al filtro
    if (subcategory) {
      query += ' AND subcategory = $2';
      queryParams.push(subcategory);
    }
  } else if (subcategory) {
    // filtramos solo por subcategoría
    query += ' WHERE subcategory = $1';
    queryParams.push(subcategory);
  }

  try {
    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;