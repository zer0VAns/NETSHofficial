import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user, token } = useContext(AuthContext);

  const loadCart = async () => {
    if (!user || !token) {
      setCart([]);
      return;
    }

    try {
      const response = await fetch(`https://netsh.onrender.com/api/cart/${user.id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Carrito cargado:', JSON.stringify(data, null, 2));
        setCart(data);
      } else {
        console.error('Error al cargar el carrito:', data.error);
        setCart([]);
      }
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();
  }, [user, token]);

  const addToCart = async (product, quantity) => {
    if (!user || !token) {
      throw new Error('Debes iniciar sesión para añadir productos al carrito.');
    }

    try {
      const response = await fetch('https://netsh.onrender.com/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          item_id: product.id,
          item_type: 'product',
          quantity,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Ítem añadido:', JSON.stringify(data, null, 2));
        await loadCart();
      } else {
        console.error('Error al añadir al carrito:', data.error);
      }
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
      throw error;
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }

    if (!user || !token) return;

    try {
      const response = await fetch(`https://netsh.onrender.com/api/cart/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Cantidad actualizada:', JSON.stringify(data, null, 2));
        await loadCart();
      } else {
        console.error('Error al actualizar cantidad:', data.error);
      }
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
    }
  };

  const removeFromCart = async (id) => {
    if (!user || !token) {
      throw new Error('Usuario no autenticado');
    }

    try {
      const response = await fetch(`https://netsh.onrender.com/api/cart/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar del carrito');
      }

      console.log('Ítem eliminado:', id);
      await loadCart();
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!user || !token) {
      setCart([]);
      return;
    }

    try {
      const response = await fetch(`https://netsh.onrender.com/api/cart/user/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Carrito limpiado');
        setCart([]);
      } else {
        console.error('Error al limpiar el carrito:', data.error);
      }
    } catch (error) {
      console.error('Error al limpiar el carrito:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
