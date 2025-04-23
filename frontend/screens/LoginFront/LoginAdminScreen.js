import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { handleLogin } from './authentification/HandleLogin.js';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have this library installed

const LoginAdminScreen = ({ navigation }) => {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginPress = () => {
    const trimmedMail = mail.trim(); // Remove whitespace from email
    handleLogin(navigation, trimmedMail, password, "admin");
  };

  return (
    <>
      {/* Header Illustration */}
      <View style={styles.headerContainer}>
        <View style={styles.imgContainer}>
          <Image
            source={require('../../assets/akdital.png')}
            style={styles.headerImage}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>AKDITAL</Text>
          <Text style={styles.subtitle}>Des soins et des liens</Text>
        </View>
      </View>
      <Text style={styles.head}>Welcome Admin</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='Email'
          placeholderTextColor='#888'
          value={mail}
          onChangeText={setMail}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder='Password'
            placeholderTextColor='#888'
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color='#888'
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.Button} onPress={handleLoginPress}>
        <Text style={styles.textButton}>Se connecter</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgContainer: {
    marginRight: 20,
  },
  textContainer: {},
  headerImage: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'rgb(29, 137, 188)',
    paddingTop: 1,
    paddingVertical: 1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgb(91, 204, 221)',
    paddingBottom: 8,
    textAlign: 'center',
  },
  head: {
    fontSize: 23,
    textAlign: 'center',
    fontWeight: '600',
    color: 'rgb(72, 119, 150)',
    marginTop: 30,
  },
  inputContainer: {
    marginTop: 50,
  },
  input: {
    backgroundColor: 'white',
    width: '80%',
    height: 50,
    borderRadius: 25,
    borderColor: 'rgb(91, 204, 221)',
    borderWidth: 2,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginVertical: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '80%',
    height: 50,
    borderRadius: 25,
    borderColor: 'rgb(91, 204, 221)',
    borderWidth: 2,
    alignSelf: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  Button: {
    backgroundColor: 'rgb(91, 204, 221)',
    marginTop: 30,
    alignSelf: 'center',
    width: "60%",
    height: 40,
    justifyContent: 'center',
    borderRadius: 25,
  },
  textButton: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default LoginAdminScreen;
