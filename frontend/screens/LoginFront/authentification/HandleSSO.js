// authentification/HandleSSO.js
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../../config";

export const handleSSOLogin = async (sso, navigation, setLoading) => {
  try {
    if (setLoading) setLoading(true);

    const response = await fetch(`${API_URL}/api/auth/SSO`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sso }),
    });

    console.log("Statut HTTP:", response.status);
    const textResponse = await response.text();
    console.log("Réponse brute du serveur:", textResponse);

    let result;
    try {
      result = JSON.parse(textResponse);
    } catch (error) {
      console.error("Erreur de parsing JSON:", error);
      Alert.alert("Erreur", "Le serveur a renvoyé une réponse invalide.");
      return;
    }

    if (response.ok) {
      await AsyncStorage.setItem("ssoCode", sso);
      Alert.alert("Succès", "Connexion SSO réussie !");
      navigation.navigate("RoleScreen"); // Assuming RoleScreen leads to LoginAdminScreen
    } else {
      Alert.alert("Erreur", result.message || "Échec de l'authentification SSO.");
    }
  } catch (error) {
    console.error("Erreur de connexion SSO:", error);
    Alert.alert("Erreur", "Impossible de se connecter via SSO.");
  } finally {
    if (setLoading) setLoading(false);
  }
};