import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import resetPasswordHandler from './authentification/HandleResetPassword';  

const ResetScreen = ({ route, navigation }) => {
  const { token } = route.params;  // On récupère le token dans les paramètres du routeur

  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = () => {
    resetPasswordHandler(token, newPassword, retypePassword, setMessage, navigation);
  };



  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../../assets/serrure.png')}
          style={styles.headerImage}
        />
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
          {/* Zone supérieure : Champ email */}
          <View style={styles.inputContainer}>
            <Text style={styles.orText}>Reset Password</Text>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Retype Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={retypePassword}
              onChangeText={setRetypePassword}
            />
          </View>

          {/* Zone inférieure : Boutons */}
          <View style={styles.cardContainer}>
            <TouchableOpacity onPress={handleResetPassword} style={styles.resetpassButton}>
              <Text style={styles.resetpassText}>Change</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
              <Text style={styles.login}>Back to Login</Text>
            </TouchableOpacity>
          </View>
          {message && <Text style={styles.message}>{message}</Text>}
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'white',
  },
  headerContainer: {
    marginVertical: -110,
    alignItems: 'center',
  },
  textcontainer: {
    marginVertical: 110,
    alignItems: 'center',
  },
  ttext: {
    color: '#2b524a',
    fontSize: 34,
    fontWeight: 'bold',
  },
  t2text: {
    color: '#2b524a',
    fontSize: 34,
  },
  t3text: {
    color: '#2b524a',
    fontSize: 19,
  },

  box: {
    paddingVertical: 90,
    paddingHorizontal: 0,
    borderRadius: 40,
    marginVertical: -160,
  },
  lin: {
    paddingVertical: 30,
    paddingHorizontal: 10,
    borderRadius: 40,
  },
  inputContainer: {
    marginBottom: 10,
    marginVertical: 0,
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
    alignItems: 'center',
    marginBottom: 30,
    marginVertical: 10,
  },
  resetpassButton: {
    backgroundColor: '#A4DDED',
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 40,
  },
  resetpassText: {
    color: '#2b524a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  login: {
    color: '#2b524a',
    textDecorationLine: 'underline',
    marginBottom: 90,
  },
  orText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  message: {
    color: '#ff0000',  // Couleur rouge pour les erreurs
    marginTop: 15,
    textAlign: 'center',
  },
});

export default ResetScreen;
