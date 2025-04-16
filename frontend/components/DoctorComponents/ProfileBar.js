import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
// 👇 Ajoute navigation en paramètre
export default function ProfileBar({screen}) {
  const navigation = useNavigation();
  return (
    <View style={styles.profileBar}>
      {/* 👇 Toute la zone cliquable (image + nom) */}
      <TouchableOpacity style={styles.profileInfo} onPress={() => navigation.navigate(screen)}>
        <Image 
          source={require('../../assets/doctor.png')}
          style={styles.profileImage}
        />
        <View style={styles.profileText}>
          <Text style={styles.doctorName}>Dr. Martin Dupont</Text>
          <Text style={styles.speciality}>Cardiologie</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={() => console.log("Déconnexion")}>
        <FontAwesome5 name="sign-out-alt" size={24} color="#FF5733" />
      </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create({
    profileBar: {
        flexDirection: "row",
        justifyContent: "space-between",
       marginRight:-15,
        borderRadius: 10,
        marginBottom: 35,
        marginTop:10,
        marginLeft:-13,
        backgroundColor:"white",  
       padding:16,
      },

      profileInfo: {
        flexDirection: "row",
        alignItems: "center",
      },

      profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
      },

      profileText: {
        justifyContent: "center",
      },
      doctorName: {
        fontSize: 18,
        fontWeight: "bold",
      },

      speciality: {
        fontSize: 14,
        color: "#777",
      },
     logoutButton: {
        padding: 10,
      }, 
});