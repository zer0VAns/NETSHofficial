import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext); 
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Contenido del carrito:', cart);
  }, [cart]);

  const calculateSubtotal = item => {
    return item.price * item.quantity;
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const subtotal = calculateSubtotal(item);
      return total + (isNaN(subtotal) ? 0 : subtotal);
    }, 0);
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(itemId, newQuantity);
      setError(null);
    } catch (err) {
      setError('Error al actualizar la cantidad: ' + err.message);
    }
  };

  const handleRemoveItem = async itemId => {
    console.log('Intentando eliminar itemId:', itemId); // Debug log
    try {
      await removeFromCart(itemId); 
      setError(null);
    } catch (err) {
      console.error('Error en handleRemoveItem:', err);
      if (err.message === 'Usuario no autenticado') {
        setError('Por favor, inicia sesión para eliminar ítems.');
        navigate('/login');
      } else if (err.message === 'Item not found') {
        setError('El ítem no se encontró en el carrito.');
      } else {
        setError(`Error al eliminar el ítem: ${err.message}`);
      }
    }
  };

  const handleProceedToCheckout = () => {
    if (!user || !token) {
      alert('Por favor, inicia sesión para proceder al pago.');
      navigate('/login');
      return;
    }

    localStorage.setItem('checkoutData', JSON.stringify({ cart, total: calculateTotal() }));
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Carrito de Compras</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {cart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="text-lg font-semibold">{item.name || `Producto ID ${item.item_id}`}</h3>
                <p>Precio: ${Number(item.price).toFixed(2)}</p>
                <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)} 
                  >
                    -
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)} 
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => handleRemoveItem(item.id)} 
              >
                Eliminar
              </button>
            </div>
          ))}
          <div className="text-right">
            <p className="text-xl font-bold">Total: ${Number(calculateTotal()).toFixed(2)}</p>
            <button
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              onClick={handleProceedToCheckout}
            >
              Proceder al Pago
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;