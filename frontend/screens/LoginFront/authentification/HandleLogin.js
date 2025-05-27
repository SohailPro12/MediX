// authentification/HandleLogin.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { API_URL } from "../../../config";

export const handleLogin = async (navigation, mail, password, role) => {
  try {
    const ssoCode = await AsyncStorage.getItem("ssoCode");
   
    if (!ssoCode) {
      Alert.alert(
        "Erreur",
        "Aucun code SSO trouvé. Veuillez vous connecter via SSO."
      );
      return;
    }

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mail, password, role, sso: ssoCode }),
    });

    const rawResponse = await response.text();
    console.log("Réponse brute:", rawResponse);

    if (response.ok) {
      try {
        const result = JSON.parse(rawResponse);
        console.log("Données envoyées:", { mail, password, role, sso: ssoCode });
        await AsyncStorage.setItem("authToken", result.token); // Changed from 'token' to 'authToken'
        await AsyncStorage.setItem("role", result.role);
        await AsyncStorage.setItem("userId", result.userId); 
        console.log("Token enregistré:", result.token);

        if (result.role === "admin") {
          navigation.navigate("HomeScreen");
        } else if (result.role === "medecin") {
          navigation.navigate("DashboardDoctor");
        } else if (result.role === "patient") {
          navigation.navigate("DashboardPatient");
        } else {
          Alert.alert("Erreur", "Rôle non reconnu.");
        }
      } catch (parseError) {
        console.error("Erreur de parsing:", parseError);
        Alert.alert("Erreur", "Réponse non valide du serveur.");
      }
    } else {
      try {
        const errorResult = JSON.parse(rawResponse);
        console.log("Erreur:", errorResult);
        Alert.alert("Erreur", errorResult.message);
      } catch (parseError) {
        console.error("Erreur de parsing:", parseError);
        Alert.alert("Erreur", "Réponse non valide du serveur.");
      }  
    }
  } catch (error) {
    console.error("Erreur du serveur:", error);
    Alert.alert("Erreur", "Erreur du serveur.");
  }
};