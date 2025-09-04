import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';


const ServiceCard = ({ service }) => {
  const phoneNumber = '+2644856189';

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const message = encodeURIComponent(
      `Hola, estoy interesado en el servicio ${service.name}. Que dias tiene disponibles?`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Link to={`/services/${service.id}`} className="block h-full">
      <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition h-64 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
          <p className="text-gray-600 line-clamp-3">{service.description}</p>
        </div>

        <div>
          <p className="text-xl font-bold mt-4">${service.price}</p>
          <div className="flex items-center mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
              onClick={handleWhatsAppClick}
            >
              Contactar por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </Link>


  );
};

export default ServiceCard;