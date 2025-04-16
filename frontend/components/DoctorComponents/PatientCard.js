import React from "react";
import { View, Text, Image,  StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
const PatientCard = ({ patient,isClickable=true }) => {
    const navigation=useNavigation();
    const handleClick=()=>{
      if(isClickable){
        navigation.navigate("DossiersM", { patient });
      }
    }

    return (
      <View style={styles.card}>
        <Image source={patient.image} style={styles.image} />
        
        <View style={styles.info}>
            <TouchableOpacity onPress={handleClick} disabled={!isClickable}>
            <Text style={styles.name}>{patient.name}</Text>
            </TouchableOpacity>
          <Text style={styles.role}>{patient.role}</Text>
          <Text style={styles.lastVisit}>
            {patient.lastVisit ? `Dernière visite: ${patient.lastVisit}` : "Première visite"}
          </Text>
        </View>
      </View>
    );
  };
  

  const styles = StyleSheet.create({

    card: {
      flexDirection: "row",
      backgroundColor: "#fff",
      padding: 15,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
      marginBottom: 15,
      alignItems: "center",
      marginHorizontal:1,
    },
    image: {
      width: 70,
      height: 70,
      borderBottomLeftRadius:20,
      borderTopLeftRadius:20,
      marginRight: 15,
    },
    info: {
      flex: 1,
    },
    name: {
      fontSize: 16,
      fontWeight: "bold",
    },
    role: {
      fontSize: 14,
      color: "#666",
    },
    lastVisit: {
      fontSize: 12,
      color: "#999",
    },
  });
  
  export default PatientCard;