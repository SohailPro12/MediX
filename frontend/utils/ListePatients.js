
import { API_URL } from "../config";

export const fetchPatients = async (medecinId) => {
  const response = await fetch(`${API_URL}/api/doctor/patients?medecinId=${medecinId}`);
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des patients");
  }
  return await response.json();
};
