import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const handleSSOLogin = async (sso, navigation, setLoading) => {
  try {

    // Vérifiez si un token existe pour les connexions futures
    const token = await AsyncStorage.getItem('authToken');
    const headers = token
      ? { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" };

    const response = await fetch("https://293f-41-250-106-197.ngrok-free.app/api/auth/SSO", {
      method: "POST",
      headers,
      body: JSON.stringify({ sso }),
    });

    const result = await response.json();
    console.log("Réponse serveur:", result);

    if (response.ok) {
      if (result.token) {
        await AsyncStorage.setItem('authToken', result.token);
      }
      await AsyncStorage.setItem('ssoCode', sso); // Sauvegarde du SSO
      Alert.alert("Succès", "Connexion SSO réussie !");
      navigation.navigate("RoleScreen");
    } else {
      // Nettoyer le token en cas d'échec
      await AsyncStorage.removeItem('authToken');
      Alert.alert("Erreur", result.message || "Échec de l'authentification SSO.");
    }
  } catch (error) {
    console.error("Erreur de connexion SSO:", error);
    Alert.alert("Erreur", "Impossible de se connecter via SSO.");
  } 
};
