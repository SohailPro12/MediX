import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { handleSSOLogin }  from './authentification/HandleSSO';


const CodeSSOScreen = ({ navigation }) => {
  const [sso, setSso] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <LinearGradient
      colors={['#5de0e6', '#004aad']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.language}>
        {/* Dropdown of languages */}
      </View>
      <View style={styles.headerContainer}>
        <Image source={require('../../assets/illustration.png')} style={styles.headerImage} />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>MediX</Text>
        <Text style={styles.subtitle}>App</Text>
      </View>
      <View style={styles.box}>
        <Text style={styles.order}>Enter the SSO code of your clinique</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="SSO"
            placeholderTextColor="#888"
            value={sso}
            onChangeText={setSso}
          />
        </View>
        <TouchableOpacity
          style={styles.validerButton}
          onPress={() => handleSSOLogin(sso, navigation, setLoading)}
          disabled={loading}
        >
          <Text style={styles.validerButtonText}>{loading ? 'Loading...' : 'Valid'}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1, // pour prendre tour l'espace disponible
    justifyContent: 'flex-end', // il place le contenu en bas
    alignItems: 'center', // pour centrer horizontalement (facultatif)
  },
  language:{
    //backgroundColor:'white',
    padding:10,
    alignSelf:'flex-end',
    marginBottom:8,
  },
  languageButton:{
    borderRadius:25,
    backgroundColor:'rgba(201, 235, 246, 1)',
    paddingHorizontal:15,
    paddingVertical:8,
  },
  languageButtonText:{

  },
  box: {
    //paddingHorizontal: 20,
    //paddingVertical: 10,
    height:260,
    width:320,
    backgroundColor: 'white',
    borderRadius: 40,
    marginVertical: 20,
    backgroundColor:'rgba(201, 235, 246, 1)',
  },
  headerContainer: {
    marginBottom: 0,
  },
  headerImage: {
    width: 280,
    height: 280,
  },
  text:{
    //backgroundColor: 'white',
    marginBottom: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFB200',
    paddingTop: 1,
    paddingVertical: 1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFB200',
    paddingBottom: 8,
    textAlign:'center',
  },
  order:{
    fontSize:16,
    marginBottom:40,
    color:"black",
    marginTop:28,
    textAlign:'center',
  },
  inputContainer: {
    marginBottom: 20,
    width:"90%",
    alignSelf:'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgb(58, 196, 234)',
  },
  validerButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 25,
    width: '65%',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 65,
    alignSelf:'center',
  },
  validerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CodeSSOScreen;
