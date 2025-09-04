import { createContext, useContext, useState } from 'react';

const BuildContext = createContext(); 

export const BuildProvider = ({ children }) => {
  const [build, setBuild] = useState({
    processor: null,
    mother: null,
    cooler: null,
    ram: null,
    gpu: null,
    disk: null,
    powersupply: null,
    cage: null,
    monitor: null
  });

  const resetBuild = () => {
    setBuild({
      processor: null,
      mother: null,
      cooler: null,
      ram: null,
      gpu: null,
      disk: null,
      powersupply: null,
      cage: null,
      monitor: null
    });
  };

  const clearBuild = () => {
    setBuild({});
  };

  const updateComponent = (type, product) => {
    setBuild((prev) => ({ ...prev, [type]: product }));
  };

  return (
    <BuildContext.Provider value={{ build, updateComponent, resetBuild, clearBuild }}>
      {children}
    </BuildContext.Provider>
  );
};

export const useBuild = () => useContext(BuildContext);
