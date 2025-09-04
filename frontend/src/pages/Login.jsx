import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, confirmed } = useContext(AuthContext);  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert('Por favor, completa todos los campos');
      return;
    }

    try {
      const res = await fetch('https://netsh.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || 'Error desconocido');
      }

      if (!data.user.confirmed) {
        alert('Por favor, confirma tu correo antes de iniciar sesión.');
        return;
      }

      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      console.error('Error en el frontend:', err.message);
      alert('Error al iniciar sesión: ' + err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="mb-[10rem] bg-white p-6 rounded-xl shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Iniciar Sesión</h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="mb-2 p-2 w-full border rounded"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          className="mb-4 p-2 w-full border rounded"
          value={form.password}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}
