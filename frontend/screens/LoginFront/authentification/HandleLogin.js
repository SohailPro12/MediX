import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const handleLogin = async (navigation, mail, password, role ) => {
  try {

    const ssoCode = await AsyncStorage.getItem('ssoCode');
    if (!ssoCode) {
      Alert.alert('Erreur', 'Aucun code SSO trouvé. Veuillez vous connecter via SSO.');
      return;
    }

    const response = await fetch('https://293f-41-250-106-197.ngrok-free.app/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mail, password, role, sso: ssoCode }),
    });

    const rawResponse = await response.text();
    console.log('Réponse brute:', rawResponse); // Log raw response

    if (response.ok) {
      try {
        const result = JSON.parse(rawResponse); // Attempt to parse JSON
        console.log('Données envoyées:', { mail, password, role, sso: ssoCode });
        await AsyncStorage.setItem('token', result.token);
        await AsyncStorage.setItem('role', result.role);
        console.log('Token enregistré:', result.token);


        if (result.role === 'admin') {
          navigation.navigate('HomeScreen');  
        } else if (result.role === 'medecin') {
          navigation.navigate('HomeScreen');  
        } else if (result.role === 'patient') {
          navigation.navigate('HomeScreen');  
        } else {
          Alert.alert('Erreur', 'Rôle non reconnu.');
        }

      } catch (parseError) {
        console.error('Erreur de parsing:', parseError);
        Alert.alert('Erreur', 'Réponse non valide du serveur.');
      }
    } else {
      try {
        const errorResult = JSON.parse(rawResponse); // Attempt to parse JSON
        console.log('Erreur:', errorResult);
        Alert.alert('Erreur', errorResult.message);
      } catch (parseError) {
        console.error('Erreur de parsing:', parseError);
        Alert.alert('Erreur', 'Réponse non valide du serveur.');
      }
    }
  } catch (error) {
    console.error('Erreur du serveur:', error);
    Alert.alert('Erreur', 'Erreur du serveur.');
  }
};


