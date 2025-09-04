import { Link } from "react-router-dom";
import ComponentGrid from "../components/build/ComponentGrid";
import SelectedSummary from "../components/build/SelectedSumary";

const BuildPC = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-4 text-center">Armá tu PC</h1>
          <ComponentGrid />
        </div>
        <div className="lg:col-span-1">
          <SelectedSummary />
        </div>
      </div>

      <div className="mt-12 py-6 text-center px-4">
        <p className="text-lg text-gray-700">
          ¿No sabés con qué componentes armar tu PC? Mejor{" "}
          <Link to="/products">
            <span className="font-semibold text-blue-600 underline underline-offset-2">comprá una prearmada</span>
          </Link>, te llega, conectás y usás.
        </p>
      </div>
    </div>

  );
};

export default BuildPC;
