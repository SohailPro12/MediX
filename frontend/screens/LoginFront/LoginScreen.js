import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = ({ navigation }) => {
  return (
  <LinearGradient
    colors={['#5de0e6', '#004aad']}
    //colors={['#8c52ff', '#5ce1e6']}
    start={{ x: 0, y: 0 }} // Départ en haut
    end={{ x: 1, y: 0 }}
    style={styles.container}
  >
          {/* Header Illustration */}
        <View style={styles.headerContainer}>
            <Image
                source={require('../../assets/illustration.png')} 
                style={styles.headerImage}
            />
        </View>
        <Text style={styles.title}>MediX</Text>
        <Text style={styles.subtitle}>App</Text>
        <View style={styles.inputContainer}>
            <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            />
            <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            />
      </View>
        <View style={styles.box}>
            {/* Forgot Password */}
            <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("ForgotScreen")}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
            {/* Buttons */}



        </View>
  </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Prend tout l'espace disponible
    justifyContent: 'flex-end', // Place le contenu en bas
    alignItems: 'center', // Centrer horizontalement (facultatif)
  },
  box: {
    paddingHorizontal: 85,
    paddingVertical: 20, 
    backgroundColor: 'white',
    borderRadius: 40,
    marginVertical:-20,
  },
  headerContainer: {
    marginBottom: 0,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFB200',
    paddingTop:1,
    paddingVertical:1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFB200',
    paddingBottom:8,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 45,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 20,
    marginVertical: 1,
    marginHorizontal:25,
    marginBottom:20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  forgotPassword: {
    color: '#1E90FF',
    marginBottom: 30,
    textAlign:'center',
  },
  loginButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 25,
    width: '200%',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 95,
    marginVertical: 30,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
