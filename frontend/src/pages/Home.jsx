import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import homeBanner from '../assets/homeBanner.svg';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productIds = [4, 5, 6];
    const servicesIds = [1, 2, 3];

    const fetchData = async () => {
      try {
        const productPromises = productIds.map(id =>
          fetch(`https://netsh.onrender.com/api/products/${id}`).then(res => res.json())
        );
        const servicesPromises = servicesIds.map(id =>
          fetch(`https://netsh.onrender.com/api/services/${id}`).then(res => res.json())
        );

        const [productsData, servicesData] = await Promise.all([
          Promise.all(productPromises),
          Promise.all(servicesPromises)
        ]);

        setProducts(productsData);
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-neutral-50 text-black">

      {/* SECCIÓN DE BIENVENIDA */}
      <motion.section
        className="relative h-[80vh] flex items-center justify-center"
        style={{
          background: `url(${homeBanner}) center/cover no-repeat`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0"></div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Bienvenido a NETSH
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl mb-6 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Tienda especializada en Hardware de entrecasa. Próximamente servidores.
          </motion.p>
          <Link
            to="/products"
            className="inline-block bg-blue-700 mt-4 shadow-md text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-blue-800 transition text-center"
          >
            Explorá nuestros Productos &gt;
          </Link>
        </div>
      </motion.section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-600">
            Productos destacados
          </h2>

          {loading ? (
            <p className="text-center">Cargando...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4 }}
                >
                  <Link
                    to={`/products/${product.id}`}
                    className=""
                  >
                    <div className="p-6 border rounded-lg p-4 shadow-md hover:shadow-2xl transition-shadow duration-300">
                      <img
                        loading="lazy"
                        src={product.imagen_url || 'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="w-full h-48 object-contain"
                      />
                      <h3 className="text-xl font-semibold mb-2 mt-4">{product.name}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                      <p className="text-blue-600 font-bold">${product.price}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/products" className="text-blue-600 font-semibold hover:underline">
              Ver todos los productos
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICIOS DESTACADOS */}
      <section className="py-16 px-4 bg-neutral-100">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-600">
            Servicios destacados
          </h2>

          {loading ? (
            <p className="text-center">Cargando...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4 }}
                >
                  <Link
                    to={`/services/${service.id}`}
                    className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition"
                  >
                    <div className="p-6 border rounded-lg p-4 shadow-md hover:shadow-2xl transition-shadow duration-300">
                      <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                      <p className="text-blue-600 font-bold">${service.price}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/services" className="text-blue-600 font-semibold hover:underline">
              Ver todos los servicios
            </Link>
          </div>
        </div>
      </section>

      {/* SOBRE NOSOTROS */}
      <motion.section
        className="py-16 px-4"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
          <motion.div
            className="md:w-1/2"
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <img
              loading="lazy"
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Sobre nosotros"
              className="w-full h-80 object-cover rounded-lg"
            />
          </motion.div>
          <motion.div
            className="md:w-1/2"
            initial={{ x: 0, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-600">Sobre nosotros</h2>
            <p className="text-gray-600 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean congue laoreet dui, non porttitor ex venenatis non. Donec et est egestas ligula commodo suscipit. Sed porta eu augue id maximus. Aenean libero tellus, dictum in blandit ac, convallis eu arcu.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Contáctanos
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
