
import { API_URL } from "../config"; // Assurez-vous que le chemin est correct

export const fetchAppointments = async (medecinId, status = null, upcomingOnly = false) => {
  const res = await fetch(`${API_URL}/api/doctor/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ medecinId, status, upcomingOnly }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erreur API");

  return data;
};
