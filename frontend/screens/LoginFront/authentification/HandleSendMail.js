import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { API_URL } from "../../../config";

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Fonction pour envoyer l'email
export const handleSendEmail = async (recipient, role) => {
  if (!validateEmail(recipient)) {
    return { success: false, message: "Adresse email invalide" };
  }
  const ssoCode = await AsyncStorage.getItem("ssoCode");
  if (!ssoCode) {
    Alert.alert(
      "Erreur",
      "Aucun code SSO trouvé. Veuillez vous connecter via SSO."
    );
    return { success: false, message: "Aucun code SSO trouvé" };
  }

  try {
    console.log(
      "Envoi de l'email à :",
      recipient,
      "avec rôle:",
      role,
      "et SSO:",
      ssoCode
    );

    const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
      mail: recipient,
      role: role || "default",
      sso: ssoCode,
    });

    console.log("Réponse API:", response.data);

    return {
      success: true,
      message: response.data.message || "Email envoyé avec succès",
    };
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'email:",
      error.response?.data || error.message
    );

    let errorMessage =
      "Erreur lors de l'envoi de l'email. Veuillez réessayer plus tard.";

    if (error.response) {
      // Erreur côté serveur (code 4xx ou 5xx)
      errorMessage =
        error.response.data?.message || `Erreur: ${error.response.status}`;
    } else if (error.request) {
      // Aucune réponse reçue (problème de connexion)
      errorMessage =
        "Impossible de contacter le serveur. Vérifiez votre connexion.";
    }

    return { success: false, message: errorMessage };
  }
};
