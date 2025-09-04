import React, { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; // Nueva importación
import netshLogo from '../assets/NETSHcomar.svg';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { cart } = useContext(CartContext);
  const { user } = useContext(AuthContext); // Usar AuthContext
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-neutral-100 text-black shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-black">
          <img src={netshLogo} alt="Netsh Logo" className="h-12 w-auto" />
        </Link>

        <nav className="hidden md:flex space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-blue-600 font-semibold' : 'text-black hover:text-blue-600'
            }
          >
            Inicio
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? 'text-blue-600 font-semibold' : 'text-black hover:text-blue-600'
            }
          >
            Productos
          </NavLink>
          <NavLink
            to="/armarpc"
            className={({ isActive }) =>
              isActive ? 'text-blue-600 font-semibold' : 'text-black hover:text-blue-600'
            }
          >
            ARMA TU PC
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) =>
              isActive ? 'text-blue-600 font-semibold' : 'text-black hover:text-blue-600'
            }
          >
            Servicios
          </NavLink>

        </nav>

        <div className="flex items-center space-x-2 md:space-x-4">
          <Link to="/cart" className="relative">
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs md:text-sm rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <Link to="/profile" className="text-sm md:text-base text-black hover:text-blue-600">
              Hola, {user.nombre}
            </Link>
          ) : (
            <>
              <Link to="/register" className="text-sm md:text-base text-black hover:text-blue-600">
                Registrarse
              </Link>
              <Link to="/login" className="text-sm md:text-base text-black hover:text-blue-600">
                Logearse
              </Link>
            </>
          )}

          <button
            className="md:hidden ml-2 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            className="md:hidden bg-neutral-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-2 flex flex-col space-y-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 font-semibold' : 'text-black hover:text-blue-600'
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 font-semibold' : 'text-black hover:text-blue-600'
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </NavLink>
              <NavLink
                to="/armarpc"
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 font-semibold' : 'text-black hover:text-blue-600'
                }
                onClick={() => setIsMenuOpen(false)}
              >
                ARMA TU PC
              </NavLink>
              <NavLink
                to="/services"
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 font-semibold' : 'text-black hover:text-blue-600'
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Servicios
              </NavLink>

              {user ? (
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive ? 'text-blue-600 font-semibold' : 'text-black hover:text-blue-600'
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hola, {user.nombre}
                </NavLink>
              ) : (
                <>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      isActive ? 'text-blue-600 font-semibold' : 'text-black hover:text-blue-600'
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrarse
                  </NavLink>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive ? 'text-blue-600 font-semibold' : 'text-black hover:text-blue-600'
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Logearse
                  </NavLink>
                </>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;