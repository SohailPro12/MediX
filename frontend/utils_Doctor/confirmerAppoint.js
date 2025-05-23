import { API_URL } from "../config";
export const confirmerAppointmentRequest = async (appointmentId) => {
    try {
      const response = await fetch(`${API_URL}/api/doctor/confirm/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accepted: true }),
      });
  
      if (!response.ok) {
        throw new Error('Erreur de confirmation du rendez-vous');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };
  