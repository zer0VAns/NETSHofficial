import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('https://netsh.onrender.com/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      setStatus(data.message);
      if (data.success) {
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (err) {
      console.error(err);
      setStatus('Error al enviar el mensaje.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white flex items-center justify-center px-4 pt-8 pb-4 md:pt-12 md:pb-6">
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl w-full grid md:grid-cols-2 gap-8 bg-white p-10 shadow-2xl rounded-2xl border border-blue-100"
      >
        {/* CONTACT INFO */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-4xl font-bold text-blue-600 mb-2">¡Conectemos!</h2>
            <p className="text-gray-600">
              Si tenés una idea, proyecto o simplemente querés saludar, ¡dejame un mensaje o contactame por redes!
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-blue-600 text-xl" />
              <span className="text-gray-700">nsilvahollger@gmail.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaLinkedin className="text-blue-600 text-xl" />
              <a
                href="https://www.linkedin.com/in/nshollger/"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                https://www.linkedin.com/in/nshollger/
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <FaGithub className="text-blue-600 text-xl" />
              <a
                href="https://github.com/tuusuario"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                github.com/zer0VAns
              </a>
            </div>
          </div>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </motion.div>

          {status && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center font-medium ${
                status.includes('éxito') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {status}
            </motion.p>
          )}
        </form>
      </motion.div>
    </div>
  );
}
