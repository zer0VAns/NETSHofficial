import React, { useEffect, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import HelpButton from '../components/HelpButton';

const MemoizedProductCard = memo(ProductCard);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('PCs Prearmadas');
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const categories = ['PCs Prearmadas', 'Componentes', 'Perifericos'];

  const componentSubcategories = ['Todos', 'processor', 'ram', 'disk', 'mother', 'gpu', 'powersupply','cage','cooler'];
  const accessorySubcategories = ['Todos', 'mouse', 'keyboard', 'monitor', 'headphones'];
  const prebuiltSubcategories = ['Todos', 'deskPC', 'gamerPC'];

  const subcategoryTranslations = {
    disk: 'Discos',
    cage:'Gabinetes',
    cooler:'Coolers',
    ram: 'RAMs',
    processor: 'Procesadores',
    mother: 'Mothers',
    gpu: 'Tarjetas Gráficas',
    graphicCard: 'Tarjetas Gráficas',
    mouse: 'Mouses',
    keyboard: 'Teclados',
    monitor: 'Monitores',
    headphones: 'Auriculares',
    deskPC: 'PCs de Escritorio',
    gamerPC: 'PCs Gamer',
    powersupply: 'Fuentes'
  };

  const helpContentByCategory = {
    'PCs Prearmadas': {
      title: '¿En qué se diferencian?',
      content: (
        <>
          <p><strong>PC de Escritorio:</strong> Diseñada para tareas generales como oficina, navegación web y multimedia. No traen tarjeta gráfica, la integrada en el procesador es suficiente para este tipo de tareas.</p>
          <p><strong>PC Gamer:</strong> Optimizada para videojuegos exigentes, alto rendimiento gráfico y multitarea intensiva. Buena gráfica, buen procesador y mucha memoria RAM caracterizan estas PCs.</p>
        </>
      ),
    },
    Componentes: {
      title: 'Caracteristicas de los componentes',
      content: (
        <>
          <p><strong>Procesador (CPU):</strong> Unidad central de procesamiento que ejecuta instrucciones y gestiona las operaciones del sistema.</p>
          <p><strong>RAM (Memoria de acceso aleatorio):</strong> Memoria volátil que almacena temporalmente datos y programas en uso, permitiendo acceso rápido.</p>
          <p><strong>Disco Duro (HDD/SSD):</strong> Dispositivo de almacenamiento permanente para el sistema operativo, aplicaciones y archivos del usuario.</p>
          <p><strong>Tarjeta Gráfica (GPU):</strong> Procesador especializado en renderizar imágenes, video y gráficos en 3D para tareas visuales intensivas.</p>
          <p><strong>Motherboard (Placa base):</strong> La base donde se conectan todos los componentes.</p>

        </>
      ),
    },
    Perifericos: {
      title: 'Caracteristicas de los perifericos',
      content: (
        <>
          <p><strong>Mouse y teclado:</strong> Esenciales para interactuar con tu PC.</p>
          <p><strong>Monitor:</strong> Visualiza toda la actividad.</p>
          <p><strong>Auriculares:</strong> Para una experiencia inmersiva de audio.</p>
        </>
      ),
    },
  };


  useEffect(() => {
    const url = new URL('https://netsh.onrender.com/api/products');
    if (activeCategory && activeCategory !== 'Todos') {
      url.searchParams.append('category', activeCategory);
    }

    const hasSubcategories =
      activeCategory === 'Componentes' ||
      activeCategory === 'Perifericos' ||
      activeCategory === 'PCs Prearmadas';

    if (
      hasSubcategories &&
      activeSubcategory &&
      activeSubcategory !== 'Todos'
    ) {
      url.searchParams.append('subcategory', activeSubcategory);
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener productos');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [activeCategory, activeSubcategory]);

  const filteredProducts =
    activeCategory === 'Todos' ? products : products.filter((p) => p.category === activeCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
  });

  return (
    <div className="min-h-screen bg-neutral-50 text-black">
      {/* Mobile header */}
      <div className="md:hidden p-4 flex justify-between items-center border-b border-gray-200 bg-white">
        <h2 className="text-xl font-bold">{activeCategory}</h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-blue-600 font-semibold"
        >
          {sidebarOpen ? 'Cerrar menú' : 'Menú'}
        </button>
      </div>

      <div className="md:flex">
        {/* Sidebar */}
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            className="w-full md:w-48 md:h-screen md:sticky top-[90px] left-0 bg-white p-6 border-r border-gray-200 z-20 rounded-xl"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 25 }}
          >
            <motion.nav className="flex flex-col gap-4 text-lg">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setActiveSubcategory(null);
                    setSidebarOpen(false);
                  }}
                  className={`text-left transition-all duration-200 px-2 py-1 rounded ${activeCategory === category
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'hover:text-blue-600'
                    }`}
                >
                  {category}
                </button>
              ))}
            </motion.nav>
          </motion.aside>
        )}

        <div className="flex-1 w-full ">
          {/* Subcategoría navbar */}
          <AnimatePresence mode="wait">
            {(activeCategory === 'Componentes' ||
              activeCategory === 'Perifericos' ||
              activeCategory === 'PCs Prearmadas') && (
                <motion.div
                  className="w-full bg-white border-b border-gray-200 overflow-x-auto sticky top-[64px] md:top-[90px] z-30 rounded-xl"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                >
                  <div className="flex gap-2 px-4 py-3 max-w-screen-xl mx-auto bg-white">
                    {(activeCategory === 'Componentes'
                      ? componentSubcategories
                      : activeCategory === 'Perifericos'
                        ? accessorySubcategories
                        : prebuiltSubcategories
                    ).map((subcategory) => (
                      <button
                        key={subcategory}
                        onClick={() => setActiveSubcategory(subcategory)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm border transition-all duration-200 ${activeSubcategory === subcategory ||
                          (subcategory === 'Todos' && activeSubcategory === null)
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'hover:border-blue-600 hover:text-blue-600'
                          }`}
                      >
                        {subcategory === 'Todos'
                          ? 'Todos'
                          : subcategoryTranslations[subcategory] || subcategory}
                      </button>
                    ))}
                    {/* Botón de ayuda */}
                    {(activeCategory === 'Componentes' || activeCategory === 'Accesorios' || activeCategory === 'PCs Prearmadas') && (
                      <button
                        onClick={() => setIsHelpOpen(true)}
                        className="ml-2 m-auto w-6 h-6 rounded-full bg-gray-200 text-gray-700 font-bold text-sm flex items-center justify-center hover:bg-blue-500 hover:text-white transition"
                        title="¿Qué significa esto?"
                      >
                        ?
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
          </AnimatePresence>

          {/* Main content */}
          <main className="p-4 sm:p-8 mx-auto max-w-screen-xl">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 items-start sm:items-center">
              <h2 className="text-2xl sm:text-3xl font-bold">{activeCategory}</h2>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border px-4 py-2 rounded-md"
              >
                <option value="desc">Mayor a menor precio</option>
                <option value="asc">Menor a mayor precio</option>
              </select>
            </div>

            {loading ? (
              <motion.p
                className="text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Cargando productos...
              </motion.p>
            ) : error ? (
              <motion.p
                className="text-red-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Error: {error}
              </motion.p>
            ) : filteredProducts.length === 0 ? (
              <motion.p
                className="text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                No hay productos disponibles.
              </motion.p>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <AnimatePresence>
                  {sortedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MemoizedProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* Botón de ayuda */}
      <HelpButton
        open={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title={helpContentByCategory[activeCategory]?.title || ''}
        content={helpContentByCategory[activeCategory]?.content || ''}
      />
    </div>
  );
};

export default Products;
