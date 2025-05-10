import React, { createContext, useContext, useState } from 'react';

// Créer un contexte
const PatientContext = createContext();

// Créer un hook pour accéder au contexte
export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};

// Fournisseur du contexte
export const PatientProvider = ({ children }) => {
  const [patient, setPatient] = useState(null);

  return (
    <PatientContext.Provider value={{ patient, setPatient }}>
      {children}
    </PatientContext.Provider>
  );
};
