import React, { createContext, useContext, useState } from 'react';

// Créer un contexte
const MedecinContext = createContext();

// Créer un hook pour accéder au contexte
export const useMedecin = () => {
  const context = useContext(MedecinContext);
  if (!context) {
    throw new Error('useMedecin must be used within a MedecinProvider');
  }
  return context;
};

// Fournisseur du contexte
export const MedecinProvider = ({ children }) => {
  const [medecin, setMedecin] = useState(null);

  return (
    <MedecinContext.Provider value={{ medecin, setMedecin }}>
      {children}
    </MedecinContext.Provider>
  );
};
