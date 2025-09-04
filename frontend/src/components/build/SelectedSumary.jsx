import { useBuild } from "../../context/BuildContext";
import { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HelpModal from "../HelpButton";

const SelectedSummary = () => {
  const { build, resetBuild, updateComponent } = useBuild();
  const { addToCart } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const requiredComponents = [
    "processor", "mother", "ram", "disk", "powersupply", "cage"
  ];

  const componentTranslations = {
    processor: "Procesador",
    mother: "Placa Madre",
    ram: "Memoria RAM",
    disk: "Almacenamiento",
    powersupply: "Fuente",
    cage: "Gabinete",
    cooler: "Cooler",
    gpu: "Tarjeta Gráfica",
    monitor: "Monitor",
  };

  const isBuildComplete = requiredComponents.every((key) => build[key] !== null);

  const missingComponents = requiredComponents
    .filter((key) => !build[key])
    .map((key) => componentTranslations[key]);

  const total = Object.values(build).reduce(
    (acc, item) => acc + (parseFloat(item?.price) || 0), 0
  );

  const handleFinalize = async () => {
    if (isLoading) return;

    if (!user || !token) {
      toast.error("Por favor, inicia sesión para continuar.");
      navigate("/login");
      return;
    }

    if (!isBuildComplete) {
      toast.error(`Faltan componentes necesarios: ${missingComponents.join(", ")}`);
      return;
    }

    setIsLoading(true);
    try {
      const selectedItems = Object.values(build).filter((item) => item);
      if (selectedItems.length === 0) {
        toast.error("No has seleccionado ningún componente.");
        return;
      }

      for (const item of selectedItems) {
        await addToCart(item, 1);
      }

      resetBuild();
      toast.success("Componentes añadidos al carrito!");
      navigate("/cart");
    } catch (error) {
      console.error("Error al añadir al carrito:", error);
      toast.error("Error al añadir los componentes al carrito.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveComponent = (type) => {
    updateComponent(type, null);
    toast.info(`${componentTranslations[type] || type} eliminado de la selección.`);
  };
  const helpContent = (
    <div>
      <p>
        Los componentes marcados en rojos son obligatorios para una PC.
      </p>
      <p className="mt-2">
        Deberas seleccionar uno de cada para poder armar tu PC de manera correcta.
      </p>
      <p className="mt-2">
        Si no, puedes comprar productos por separado en la seccion Productos.
      </p>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-xl shadow w-full max-w-md mx-auto lg:mx-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Resumen de tu PC</h2>
        <button
          onClick={() => setHelpOpen(true)}
          aria-label="Informacion Armar Tu PC"
          className="text-blue-600 hover:text-blue-800 font-semibold text-sm px-2 py-1 rounded border border-blue-600 hover:border-blue-800 transition"
        >
          ?
        </button>
      </div>
      <ul className="space-y-2">
        {Object.entries(build).map(([key, item]) => (
          <li
            key={key}
            className={`flex justify-between items-center text-sm ${requiredComponents.includes(key) && !item ? "text-red-500" : ""
              }`}
          >
            <span className="capitalize">{componentTranslations[key] || key}:</span>
            <div className="flex items-center space-x-2">
              <span className="truncate max-w-[10rem] sm:max-w-[12rem] md:max-w-[14rem]">
                {item ? item.name : "-"}
              </span>
              {item && (
                <button
                  onClick={() => handleRemoveComponent(key)}
                  className="text-red-500 hover:text-red-700 text-sm"
                  aria-label={`Eliminar ${componentTranslations[key] || key}`}
                >
                  ✕
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <hr className="my-4" />
      <div className="font-bold text-right">Total: ${total.toFixed(2)}</div>

      <button
        onClick={resetBuild}
        className="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
      >
        Limpiar selección
      </button>

      <button
        onClick={handleFinalize}
        className={`mt-4 w-full bg-green-500 text-white py-2 rounded-md transition ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
          }`}
        aria-label="Finalizar y añadir al carrito"
      >
        {isLoading ? "Añadiendo..." : "Finalizar"}
      </button>
      <HelpModal
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="Información sobre Armar Tu PC"
        content={helpContent}
      />
    </div>
  );
};

export default SelectedSummary;
