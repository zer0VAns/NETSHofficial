import { useState } from "react";
import ComponentSelector from "./ComponentSelector";

const components = [
  { type: "processor", label: "Procesador" },
  { type: "mother", label: "Motherboard" },
  { type: "cooler", label: "Cooler" },
  { type: "ram", label: "RAM" },
  { type: "gpu", label: "Tarjeta Gráfica" },
  { type: "disk", label: "Disco" },
  { type: "powersupply", label: "Fuente" },
  { type: "cage", label: "Gabinete" },
  { type: "monitor", label: "Monitor" },
];

const ComponentGrid = () => {
  const [selectedType, setSelectedType] = useState(null);

  if (selectedType) {
    return (
      <ComponentSelector
        type={selectedType}
        onBack={() => setSelectedType(null)}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
      {components.map((c) => (
        <button
          key={c.type}
          onClick={() => setSelectedType(c.type)}
          className="bg-white shadow rounded-xl p-4 hover:bg-blue-100 transition w-full"
        >
          <div className="text-center font-semibold text-sm sm:text-base">{c.label}</div>
        </button>
      ))}
    </div>
  );
};

export default ComponentGrid;
