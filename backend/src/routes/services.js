const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Obtener todos los servicios con filtro y orden
router.get('/', async (req, res) => {
  const { category, sort } = req.query;

  let baseQuery = 'SELECT * FROM services';
  const params = [];
  const conditions = [];

  if (category) {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }

  if (conditions.length > 0) {
    baseQuery += ' WHERE ' + conditions.join(' AND ');
  }

  if (sort === 'price_desc') {
    baseQuery += ' ORDER BY price DESC';
  } else if (sort === 'price_asc') {
    baseQuery += ' ORDER BY price ASC';
  }

  try {
    const result = await pool.query(baseQuery, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Obtener un servicio por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM services WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
