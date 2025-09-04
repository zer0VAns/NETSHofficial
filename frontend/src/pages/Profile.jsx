import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout(); 
    toast.success('Sesión cerrada correctamente');
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Perfil de Usuario</h2>
      <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
        <h3 className="text-xl font-semibold mb-4">Información del Usuario</h3>
        <p className="mb-2">
          <span className="font-semibold">Nombre:</span> {user.nombre}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p className="mb-4">
          <span className="font-semibold">ID:</span> {user.id}
        </p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Profile;
