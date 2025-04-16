import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';



const RoleScreen = ({ navigation }) => {
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
      <Text style={styles.head}>Welcome to AKTIDAL App</Text>
      <Text style={styles.question}>Select your role</Text>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.selection} onPress={() => navigation.navigate("LoginDoctorScreen")}>
            <Text style={styles.buttonText}>Doctor</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.selection} onPress={() => navigation.navigate("LoginPatientScreen")}>
            <Text style={styles.buttonText}>Patient</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.selection} onPress={() => navigation.navigate("LoginAdminScreen")}>
            <Text style={styles.buttonText} >Admin</Text>
        </TouchableOpacity>
      </View>
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
  question:{
    fontSize:28,
    textAlign:'center',
    fontWeight:'800',
    color:'rgb(91, 204, 221)',
    marginTop:30,
  },
  buttons:{
    marginVertical:20,
  },
  selection:{
    backgroundColor:'rgb(29, 137, 188)',
    marginVertical:20,
    paddingVertical:15,
    alignItems:'center',
    width:250,
    borderRadius:25,
    alignSelf:'center',
  },
  buttonText:{
    color:'white',
  },

});

export default RoleScreen;
