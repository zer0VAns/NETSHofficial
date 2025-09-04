import { useEffect, useState } from "react";
import { useBuild } from "../../context/BuildContext";
import placeholder from "../../media/placeholder-image.jpg";
import HelpModal from "../HelpButton";

const ComponentSelector = ({ type, onBack }) => {
  const [products, setProducts] = useState([]);
  const { updateComponent, build } = useBuild();

  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://netsh.onrender.com/api/products`);
        const text = await res.text();

        try {
          const json = JSON.parse(text);

          let filtrados = json.filter((p) => p.subcategory === type);

          if (type === "processor" && build.mother?.socket) {
            filtrados = filtrados.filter(
              (p) => p.socket === build.mother.socket
            );
          } else if (type === "mother" && build.processor?.socket) {
            filtrados = filtrados.filter(
              (p) => p.socket === build.processor.socket
            );
          }

          setProducts(filtrados);
        } catch (parseError) {
          console.error("Error al parsear JSON:", parseError);
        }
      } catch (error) {
        console.error("Error al hacer fetch:", error);
      }
    };

    fetchData();
  }, [type, build]);

  const handleSelect = (product) => {
    updateComponent(type, product);
    onBack();
  };

  const typeTranslations = {
    processor: "Procesador",
    gpu: "Tarjeta Gráfica",
    graphicCard: "Tarjeta Gráfica",
    mother: "Motherboard",
    ram: "RAM",
    disk: "Disco",
    powersupply: "Fuente",
    cage: "Gabinete",
    cooler: "Cooler",
    monitor: "Monitor",
    mouse: "Ratón",
    keyboard: "Teclado",
    headphones: "Auriculares",
  };

  const baseImageUrl = "http://localhost:5000";

  const getImageUrl = (imagenUrl) => {
    if (!imagenUrl) return placeholder;
    if (imagenUrl.startsWith("http")) return imagenUrl;
    return `${baseImageUrl}${imagenUrl.startsWith("/") ? "" : "/"}${imagenUrl}`;
  };

  const socketFilterMessage = () => {
    if (type === "processor" && build.mother?.socket) {
      return `Mostrando solo procesadores con socket compatible: ${build.mother.socket}`;
    }
    if (type === "mother" && build.processor?.socket) {
      return `Mostrando solo motherboards con socket compatible: ${build.processor.socket}`;
    }
    return null;
  };

  const socketHelpContent = (
    <div>
      <p>
        Los sockets son las interfaces físicas en la motherboard y el procesador que deben coincidir para que sean compatibles.
      </p>
      <p className="mt-2">
        Por ejemplo, un procesador con socket <b>AM5</b> solo funcionará con motherboards que tengan socket <b>AM5</b>.
      </p>
      <p className="mt-2">
        Por eso, al seleccionar un procesador o una motherboard, filtramos los productos para que solo veas opciones compatibles con el socket requerido.
      </p>
    </div>
  );

  return (
    <div>
      <button className="mb-4 text-blue-600" onClick={onBack}>
        ← Volver
      </button>

      <div className="mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Elegí tu {typeTranslations[type] || type}
        </h2>

        {socketFilterMessage() && (
          <div className="mt-2 flex items-center gap-2 text-blue-700 bg-blue-100 p-2 rounded-md text-sm justify-between">
            <span className="flex items-center gap-2">
              <span className="text-blue-500 text-lg select-none">ℹ️</span>
              <span>{socketFilterMessage()}</span>
            </span>

            <button
              onClick={() => setHelpOpen(true)}
              aria-label="Información sobre sockets"
              className="text-blue-600 hover:text-blue-800 font-semibold text-sm px-2 py-1 rounded border border-blue-600 hover:border-blue-800 transition"
            >
              ?
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white p-4 shadow rounded-xl hover:bg-green-50 cursor-pointer flex items-center space-x-4"
            onClick={() => handleSelect(p)}
          >
            <img
              src={getImageUrl(p.imagen_url)}
              className="w-16 h-16 object-contain rounded"
              alt={p.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholder;
              }}
            />
            <div className="flex-1">
              <div className="font-semibold text-sm sm:text-base">{p.name}</div>
              <div className="text-sm text-gray-600">${p.price}</div>
            </div>
          </div>
        ))}
      </div>

      <HelpModal
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="Información sobre sockets"
        content={socketHelpContent}
      />
    </div>
  );
};

export default ComponentSelector;