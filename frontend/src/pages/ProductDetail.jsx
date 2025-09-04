import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ReactPlayer from 'react-player/youtube';
import customContent from '../customContent.jsx';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const custom = customContent.products?.[String(id)] || {};

  // Arrow components for Slider
  const PrevArrow = ({ className, style, onClick }) => (
    <button
      className={`${className} bg-neutral-800 text-white p-2 rounded-full`}
      style={style}
      onClick={onClick}
    >
      ←
    </button>
  );

  const NextArrow = ({ className, style, onClick }) => (
    <button
      className={`${className} bg-neutral-800 text-white p-2 rounded-full`}
      style={style}
      onClick={onClick}
    >
      →
    </button>
  );

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
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  useEffect(() => {
    if (!id) return;
    fetch(`https://netsh.onrender.com/api/products/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error('Producto no encontrado');
        return response.json();
      })
      .then((data) => {
        console.log('Producto cargado:', data);
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => { 
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product && quantity > 0 && quantity <= product.stock) {
      addToCart(product, quantity);
      setQuantity(1);
    }
  };

  if (loading) return <div className="container mx-auto p-4 text-center text-gray-600">Cargando...</div>;
  if (error) return <div className="container mx-auto p-4 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="bg-neutral-50 text-black py-16 px-4 h-[100vh]">
      <div className="container mx-auto">
        <Link
          to="/products"
          className="inline-block text-blue-600 hover:underline mb-6"
        >
          ← Volver a Productos
        </Link>
        <div className="flex flex-col lg:flex-row gap-12">
          {/*Slider */}
          <div className="lg:w-1/2">
            {custom.media && custom.media.length > 0 ? (
              <Slider {...sliderSettings}>
                {/* Main product image */}
                <div className="px-2">
                  <img
                    src={product.imagen_url || 'https://via.placeholder.com/400?text=Producto'}
                    alt={product.name}
                    className="w-full h-[400px] object-contain rounded-lg shadow-md"
                  />
                </div>
                {/* Custom media (images or videos) */}
                {custom.media.map((item, index) => (
                  <div key={index} className="px-2">
                    {item.type === 'image' ? (
                      <img
                        src={item.src}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-[400px] object-contain rounded-lg shadow-md"
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
                              playerVars: {
                                modestbranding: 1,
                                rel: 0,
                                showinfo: 0,
                                iv_load_policy: 3,
                              },
                            },
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="px-2">
                <img
                  src={product.imagen_url || 'https://via.placeholder.com/400?text=Producto'}
                  alt={product.name}
                  className="w-full h-[400px] object-contain rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
          {/* Product Details */}
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-6 text-lg">{product.description}</p>
            <p className="text-3xl font-bold text-blue-600 mb-6">${product.price}</p>
            <div className="flex items-center mb-6">
              <span className="text-gray-600 mr-4">Categoría:</span>
              <span className="text-black">{product.category}</span>
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
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20 p-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Añadir al carrito
            </button>
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

export default ProductDetail;