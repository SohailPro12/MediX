import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, KeyboardAvoidingView, Platform, Touchable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-web';
import { handleLogin }  from './authentification/HandleLogin.js';



const LoginAdminScreen = ({ navigation }) => {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  
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
        <TextInput
        style={styles.input}
        placeholder='Password'
        placeholderTextColor='#888'
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.Button} onPress={() => handleLogin(navigation ,mail, password,"admin")}>
       <Text style={styles.textButton}>Se connecter</Text>
      </TouchableOpacity>
      </>
  );
};

const styles = StyleSheet.create({

  headerContainer: {
    //backgroundColor:'blue',
    marginTop: 80,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  imgContainer:{
    //backgroundColor:'lightblue',
    marginRight:20,
  },
  textContainer:{
    //backgroundColor:'white',
  },
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
    textAlign:'center',
  },
  head:{
    fontSize:23,
    textAlign:'center',
    fontWeight:'600',
    color:'rgb(72, 119, 150)',
    marginTop:30,
  },
  inputContainer:{
    //backgroundColor:'blue',
    marginTop:50,
  },
  input:{
    backgroundColor:'white',
    width:'80%',
    height:50,
    borderRadius:25,
    borderColor:'rgb(91, 204, 221)',
    borderWidth:2,
    paddingHorizontal:20,
    alignSelf:'center',
    marginVertical:20,
    //textAlign:'center',
  },
  Button:{
    backgroundColor:'rgb(91, 204, 221)',
    marginTop:30,
    alignSelf:'center',
    width:"60%",
    height:40,
    justifyContent:'center',
    borderRadius:25,
  },
  textButton:{
    color:'white',
    textAlign:'center',
    fontSize:18,
  }

});

export default LoginAdminScreen;
