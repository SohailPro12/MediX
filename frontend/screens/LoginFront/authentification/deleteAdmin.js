import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const handleDeleteAccount = async (navigation) => {
    try {
      const token = await AsyncStorage.getItem("token");
  
      const response = await fetch("https://a52a-41-250-106-197.ngrok-free.app/api/auth/delete-account", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
      });
  
      const result = await response.json();
      console.log("Réponse brute:", result);
      if (response.ok) {
        Alert.alert("Succès", result.message);
        await AsyncStorage.removeItem("token"); // Supprime le token localement
        navigation.replace("LoginScreen"); // Redirige vers la connexion
      } else {
        Alert.alert("Erreur", result.message);
      }
    } catch (error) {
      console.error("Erreur suppression compte:", error);
      Alert.alert("Erreur", "Impossible de supprimer le compte.");
    }
  };