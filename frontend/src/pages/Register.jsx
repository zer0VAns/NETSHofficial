import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.password) {
      alert('Por favor, completa todos los campos');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      alert('Por favor, ingresa un email válido');
      return;
    }
    if (form.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (!acceptTerms || !acceptPrivacy) {
      alert('Debes aceptar los Términos y la Política de Privacidad');
      return;
    }
  
    try {
      const res = await fetch('https://netsh.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
  
      const data = await res.json();
      if (!res.ok) {
        if (data.error) {
          throw new Error(data.error);
        }
        if (data.errors) {
          throw new Error(data.errors.map(e => e.msg).join(', '));
        }
        if (data.error === 'El email ya está registrado') {
          throw new Error('El email ya está registrado. ¿Quieres iniciar sesión?');
        }
        throw new Error('Error desconocido al registrarse');
      }

      toast.success('Te hemos enviado un correo de confirmación. Por favor, revisa tu bandeja de entrada');
      navigate('/login');
    } catch (err) {
      console.error('Error al registrarse:', err);
      toast.error(err.message || 'Error al registrarse');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-xl shadow-md w-80 mb-[10rem]"
      >
        <h2 className="text-xl font-bold mb-4 text-blue-700">Registrarse</h2>
        <input
          name="nombre"
          placeholder="Nombre"
          className="mb-2 p-2 w-full border rounded"
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="mb-2 p-2 w-full border rounded"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          className="mb-4 p-2 w-full border rounded"
          onChange={handleChange}
        />

        {/* Checkbox Términos */}
        <label className="block mb-2 text-sm text-gray-700">
          <input
            type="checkbox"
            className="mr-2"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
          />
          Acepto los{' '}
          <span
            className="text-blue-600 underline cursor-pointer"
            title="Ver términos y condiciones"
            onClick={() => navigate('/tyc')}
          >
            Términos y Condiciones
          </span>
        </label>

        {/* Checkbox Política */}
        <label className="block mb-4 text-sm text-gray-700">
          <input
            type="checkbox"
            className="mr-2"
            checked={acceptPrivacy}
            onChange={(e) => setAcceptPrivacy(e.target.checked)}
          />
          Acepto la{' '}
          <span
            className="text-blue-600 underline cursor-pointer"
            title="Ver política de privacidad"
            onClick={() => navigate('/privacy')}
          >
            Política de Privacidad
          </span>
        </label>

        <motion.button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Registrarse
        </motion.button>
            <p className="mt-4 text-sm text-gray-500">
      ! Usa un email temporal, ya que se te enviará un email de confirmación
    </p>
      </motion.form>
      <ToastContainer />
    </div>
  );
}
