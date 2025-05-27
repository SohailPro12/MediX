import { API_URL } from "../config";

export const rescheduleAppointmentRequest = async (appointmentId, newDateTime) => {
  try {
    const response = await fetch(`${API_URL}/api/doctor/reschedule`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ appointmentId, newDateTime }),
    });

    if (!response.ok) {
      throw new Error('Erreur réseau');
    }

    const data = await response.json();
    return data;  // ✅ Juste retourner les données
  } catch (error) {
    console.error(error);
    throw error;
  }
};
