const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/products');
const serviceRoutes = require('./routes/services');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const app = express();
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https: blob:; connect-src 'self' https: ws: wss:; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; img-src 'self' https: data:; script-src 'self' https: 'unsafe-inline'; style-src 'self' https: 'unsafe-inline'"
  );
  next();
});
app.use(cors());

app.use(express.json());
app.use(cookieParser());
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
