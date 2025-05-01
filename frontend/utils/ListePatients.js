import { API_URL } from "../config";

export const fetchPatients = async (medecinId) => {
  try {
    const response = await fetch(`${API_URL}/api/doctor/patients?medecinId=${medecinId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de la récupération des patients");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erreur fetchPatients:", error);
    throw error;
  }
};

export const fetchPatientMedecin = async (medecinId) => {
  try {
    const response = await fetch(`${API_URL}/api/doctor/patients/treating?medecinId=${medecinId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de la récupération des patients traités");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erreur fetchDoctorPatients:", error);
    throw error;
  }
};