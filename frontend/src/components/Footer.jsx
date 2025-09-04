import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4">
      <div className="container mx-auto text-center">
        {/* Texto de derechos reservados */}
        <p className="text-sm md:text-base font-light mb-6">
          &copy; 2025 <span className="font-semibold">NETSH</span>. Todos los derechos reservados.
        </p>

        {/* Enlaces de navegación */}
        <div className="flex justify-center space-x-8 text-sm md:text-base">
          <Link
            to="/contact"
            className="text-gray-300 hover:text-blue-600 transition duration-300"
          >
            Contacto
          </Link>
          <Link
            to="/terms"
            className="text-gray-300 hover:text-blue-600 transition duration-300"
          >
            Términos y Condiciones
          </Link>
          <Link
            to="/privacy"
            className="text-gray-300 hover:text-blue-600 transition duration-300"
          >
            Privacidad
          </Link>
        </div>

        {/* Redes sociales */}
        <div className="mt-8">
          <a
            href="#"
            className="text-gray-300 hover:text-blue-600 mx-2 transition duration-300"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-blue-600 mx-2 transition duration-300"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-blue-600 mx-2 transition duration-300"
          >
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
