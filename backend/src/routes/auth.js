const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Funcipon para enviar el correo de confirmacion
const sendConfirmationEmail = async (user, res) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1d', 
  });

  const confirmationUrl = `https://netsh.onrender.com/api/auth/confirm/${token}`;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    cc: process.env.EMAIL_USER,
    subject: 'Confirma tu cuenta',
    html: `<p>Haz clic en el siguiente enlace para confirmar tu cuenta: <a href="${confirmationUrl}">Confirmar cuenta</a></p>`,
  };


  await transporter.sendMail(mailOptions);
};

// REGISTRO
router.post('/register', [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email',
      [nombre, email, hashedPassword]
    );

    const user = result.rows[0];

    // Enviar el email de confirmacion
    await sendConfirmationEmail(user, res);

    res.status(201).json({
      message: 'Te hemos enviado un correo para confirmar tu cuenta',
    });
  } catch (error) {
    console.error('Error en registro:', error.message, error.stack);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    res.status(400).json({ error: 'No se pudo registrar el usuario', details: error.message });
  }
});

// CONFIRMAR EL CORREO
router.get('/confirm/:token', async (req, res) => {
  try {
    const { id } = jwt.verify(req.params.token, process.env.JWT_SECRET);

    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).send('Usuario no encontrado');
    }

    // Verificar si ya esta confirmado
    if (user.confirmed) {
      return res.status(400).send('El correo ya ha sido confirmado');
    }
    
    await pool.query('UPDATE users SET confirmed = TRUE WHERE id = $1', [id]);

    res.redirect(`https://netsh-fe.onrender.com/confirm/${req.params.token}`);

  } catch (error) {
    res.status(400).send('Token inválido o expirado');
  }
});

// LOGIN
router.post('/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });

    // Verificar si el usuario ha confirmado su correo
    if (!user.confirmed) {
      return res.status(400).json({ error: 'Debes confirmar tu correo electrónico primero' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        confirmed: user.confirmed,
      },
    });
  } catch (error) {
    console.error('Error en login:', error.message, error.stack);
    res.status(500).json({ error: 'Error en el login', details: error.message });
  }
});

module.exports = router;
