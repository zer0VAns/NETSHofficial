import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ReactPlayer from 'react-player/youtube';
import customContent from '../customContent.jsx';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const phoneNumber = '+2644856189';

  const custom = customContent.services[id] || {};

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    swipe: true,
    swipeToSlide: true,
    prevArrow: (
      <button className="slick-prev bg-neutral-800 text-white p-2 rounded-full">
        ←
      </button>
    ),
    nextArrow: (
      <button className="slick-next bg-neutral-800 text-white p-2 rounded-full">
        →
      </button>
    ),
  };

  useEffect(() => {
    fetch(`https://netsh.onrender.com/api/services/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error('Servicio no encontrado');
        return response.json();
      })
      .then((data) => {
        setService(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const message = `Hola, estoy interesado en el servicio ${service.name}. Que dias tiene disponibles?`
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };


  if (loading)
    return (
      <div className="container mx-auto p-4 text-center text-gray-600">
        Cargando...
      </div>
    );
  if (error)
    return (
      <div className="container mx-auto p-4 text-center text-red-600">
        Error: {error}
      </div>
    );

  return (
    <div className="bg-neutral-50 text-black py-16 px-4">
      <div className="container mx-auto">
        <Link
          to="/services"
          className="inline-block text-blue-600 hover:underline mb-6"
        >
          ← Volver a Servicios
        </Link>
        <div className="flex flex-col lg:flex-row gap-12">
          {/*Imagen */}
          <div className="lg:w-1/2">
            {custom.media && custom.media.length > 0 ? (
              <Slider {...sliderSettings}>
                {custom.media.map((item, index) => (
                  <div key={index} className="px-2">
                    {item.type === 'image' ? (
                      <img
                        src={item.src}
                        alt={`${service.name} ${index + 1}`}
                        className="w-full h-[400px] object-cover rounded-lg shadow-md"
                      />
                    ) : (
                      <div className="relative" style={{ paddingBottom: '56.25%' }}>
                        <ReactPlayer
                          url={item.src}
                          width="100%"
                          height="100%"
                          className="absolute top-0 left-0 rounded-lg"
                          controls
                          config={{
                            youtube: {
                              playerVars: { modestbranding: 1 },
                            },
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </Slider>
            ) : (
              <img
                src={service.image || 'https://via.placeholder.com/400?text=Servicio'}
                alt={service.name}
                className="w-full h-[400px] object-cover rounded-lg shadow-md"
              />
            )}
          </div>

          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.name}</h1>
            <p className="text-gray-600 mb-6 text-lg">{service.description}</p>
            <p className="text-3xl font-bold text-blue-600 mb-6">
              ${service.price}
            </p>
            <div className="flex items-center mb-6">
              <span className="text-gray-600 mr-4">Categoría:</span>
              <span className="text-black">{service.category}</span>
            </div>
            {custom.extraDescription && (
              <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                {custom.extraDescription}
              </div>
            )}
            <div className="flex items-center mb-6">
              <label htmlFor="quantity" className="text-gray-600 mr-4">
                Cantidad:
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20 p-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition"
              onClick={handleWhatsAppClick}
            >
              Contactar por WhatsApp
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Tras contactarnos, coordinaremos los detalles de tu reserva.
            </p>
            {custom.customSection && (
              <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
                {custom.customSection}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;