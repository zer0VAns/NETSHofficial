import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const checkoutData = JSON.parse(localStorage.getItem('checkoutData')) || {};
  const { cart, total } = checkoutData;

  const { user, token } = useContext(AuthContext);

  const handleConfirmPurchase = async () => {
    if (!user || !token) {
      alert('Por favor, inicia sesión para continuar.');
      navigate('/login');
      return;
    }

    if (!paymentMethod) {
      alert('Por favor, selecciona un método de pago.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Enviando solicitud a /api/checkout:', {
        user_id: user.id,
        customer_email: user.email,
        total,
        items: cart,
        payment_method: paymentMethod,
      });

      const response = await fetch('https://netsh.onrender.com/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          customer_email: user.email,
          total,
          items: cart.map((item) => ({
            product_id: item.item_id,
            quantity: item.quantity,
            price: item.price,
          })),
          payment_method: paymentMethod,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar la compra');
      }

      alert('Compra realizada con éxito');
      localStorage.removeItem('checkoutData');
      console.log('Redirigiendo a /products');

      setTimeout(() => {
        navigate('/products?' + new Date().getTime());
      }, 1000);

    } catch (err) {
      console.error('Error en handleConfirmPurchase:', err);
      setError('Error al procesar la compra: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!cart || !user || !token) {
      navigate('/cart');
    }
  }, [cart, user, token, navigate]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Finalizar Compra</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Resumen del Pedido</h3>
        {cart && cart.length > 0 ? (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.item_id} className="flex justify-between">
                <span>{item.name || `Producto ID ${item.item_id}`}</span>
                <span>
                  ${Number(item.price).toFixed(2)} x {item.quantity} = $
                  {(Number(item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="text-right font-bold">
              Total: ${Number(total).toFixed(2)}
            </div>
          </div>
        ) : (
          <p>No hay ítems en el carrito.</p>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold">Método de Pago</h3>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Selecciona un método</option>
          <option value="credit_card">Tarjeta de Crédito</option>
          <option value="paypal">PayPal</option>
          <option value="bank_transfer">Transferencia Bancaria</option>
        </select>
      </div>

      <button
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        onClick={handleConfirmPurchase}
        disabled={loading || !paymentMethod}
      >
        {loading ? 'Procesando...' : 'Confirmar Compra'}
      </button>
    </div>
  );
};

export default Checkout;
