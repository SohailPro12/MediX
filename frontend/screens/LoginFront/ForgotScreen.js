import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { handleSendEmail } from './authentification/HandleSendMail';  

const ForgotScreen = ({ navigation, route }) => {
  const role = route?.params?.role || ''; // Gestion d'un rôle par défaut si non défini
  const [mail, setMail] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // État pour le message d'erreur
  const [successMessage, setSuccessMessage] = useState(''); // État pour le message de succès

  const handleResetPassword = async () => {
    console.log('Mail:', mail);
    console.log('Role:', role);
    const result = await handleSendEmail(mail,role);
    if (result.success) {
      setSuccessMessage(result.message);
      setErrorMessage('');
      setTimeout(() => {
        navigation.goBack(); // Retour à la page précédente après un délai
      }, 2000); // Attendre 2 secondes pour que l'utilisateur voie le message de succès
    } else {
      setErrorMessage(result.message);
      setSuccessMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('../../assets/serrure.png')} style={styles.headerImage} />
      </View>
      <View style={styles.textcontainer}>
        <Text style={styles.ttext}>Forgot</Text>
        <Text style={styles.t2text}>Password? {"\n"}</Text>
        <Text style={styles.t3text}>{"\n"}No worries, we'll send you</Text>
        <Text style={styles.t3text}>reset instructions</Text>
      </View>
      <View style={styles.box}>
        <LinearGradient
          colors={['#5de0e6', '#004aad']}
          start={{ x: 0, y: 0 }} // Départ en haut
          end={{ x: 1, y: 0 }}   // Fin à droite
          style={styles.lin}
        >
          <View style={styles.inputContainer}>
            <Text style={styles.orText}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Email"
              placeholderTextColor="#888"
              onChangeText={(text) => setMail(text)} // Liaison de l'entrée utilisateur
  value={mail}
            />

          </View>

          {/* Affichage du message d'erreur ou de succès */}
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          {successMessage ? (
            <Text style={styles.successText}>{successMessage}</Text>
          ) : null}

          <View style={styles.cardContainer}>
            <TouchableOpacity style={styles.resetpassButton} onPress={handleResetPassword}>
              <Text style={styles.resetpassText}>Reset Password</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
              <Text style={styles.login}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Prend tout l'espace disponible
    justifyContent: 'flex-end', // Place le contenu au centre verticalement
    backgroundColor: 'white',
  },
  headerContainer: {
    marginVertical: -150,
    alignItems:'center',
  },
  textcontainer:{
    marginVertical:150,
    alignItems:'center',
  },
  ttext:{
    color: '#2b524a',
    fontSize: 34,
    fontWeight: 'bold',
  },
  t2text:{
    color: '#2b524a',
    fontSize: 34,
  },
  t3text:{
    color: '#2b524a',
    fontSize: 19,
  },

  box: {
    paddingVertical: 90, // Réduire les padding pour ajuster l'espace
    paddingHorizontal: 0,
    borderRadius: 40,
    marginVertical:-160,
  },
  lin: {
    paddingVertical: 30, // Ajustez la taille du bouton ou du conteneur
    paddingHorizontal: 10,
    borderRadius: 40,
  },
  inputContainer: {
    marginBottom: 10, // Espace entre le champ et les boutons
    marginVertical:0,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    height: 50,
    width: '100%',
    paddingHorizontal: 15,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardContainer: {
    alignItems: 'center', // Centre horizontalement les boutons
    marginBottom:30,
    marginVertical:10,
  },
  resetpassButton: {
    backgroundColor: '#A4DDED',
    borderRadius: 25,
    width: '100%', // Largeur pleine
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 40, // Espace entre les boutons
  },
  resetpassText: {
    color: '#2b524a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  login: {
    color: '#2b524a',
    textDecorationLine: 'underline',
    marginBottom:90,
  },
  orText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
    marginHorizontal:20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  successText: {
    color: 'green',
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ForgotScreen;
