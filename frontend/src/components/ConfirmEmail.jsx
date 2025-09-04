import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ConfirmEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verificando...');

  useEffect(() => {
    fetch(`https://netsh.onrender.com/api/auth/confirm/${token}`)
      .then((res) => {
        if (res.ok) {
          setStatus('¡Cuenta confirmada! Redirigiendo al login...');
          setTimeout(() => navigate('/login'), 6000);
        } else {
          setStatus('Token inválido o expirado');
        }
      })
      .catch(() => setStatus('Error al confirmar la cuenta'));
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-4">{status}</h1>
        <p className="text-gray-700">{status.includes('Cuenta confirmada') ? 'Tu correo fue verificado correctamente.' : ''}</p>
        <p className="text-sm text-gray-500 mt-2">{status.includes('Cuenta confirmada') ? 'Serás redirigido al login en unos segundos...' : ''}</p>
      </div>
    </div>
  );
}
