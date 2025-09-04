import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      await addToCart(product, quantity);
      toast.success('Producto añadido al carrito');
      setQuantity(1);
    } catch (error) {
      toast.error(error.message || 'Error al añadir al carrito');
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="border rounded-lg p-4 shadow-md hover:shadow-2xl transition-shadow duration-300">
        <img
          src={product.imagen_url || 'https://via.placeholder.com/150'}
          alt={product.name}
          className="w-full h-48 object-contain rounded-md mb-4"
        />
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600 line-clamp-2">{product.description}</p>
        <p className="text-xl font-bold mt-2">${product.price}</p>
        <div className="flex items-center mt-4">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-16 p-2 border rounded mr-2"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleAddToCart}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
