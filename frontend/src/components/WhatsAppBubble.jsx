import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

const WhatsAppBubble = () => {
  const phoneNumber = '+2644856189';
  const message = '¡Hola! Quiero más información.'; 
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  return (
    <motion.a
      href={whatsappLink} 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-10 right-5 bg-green-500 p-4 rounded-full shadow-lg"
      initial={{ opacity: 0, scale: 0 }} 
      animate={{ opacity: 1, scale: 1 }}   
      transition={{ duration: 0.8 }}        
      whileHover={{ scale: 1.1 }}           
      whileTap={{ scale: 0.95 }}            
    >
      <FaWhatsapp className="text-white text-3xl" />
    </motion.a>
  );
}

export default WhatsAppBubble;
