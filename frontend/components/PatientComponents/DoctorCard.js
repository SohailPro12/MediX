// DoctorCard.js
import React from "react";
import { View, Text, Image, StyleSheet,TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

function DoctorCard({ name, specialty, address, availability, imageUrl }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("PrendreRdv", {
      name,
      specialty,
      address,
      availability,
      imageUrl,
    });
  };

  return (
    <View style={styles.doctorCard}>
      <View style={styles.doctorInfo}>
        <Image source={imageUrl} style={styles.doctorImage} />
        <View style={styles.doctorDetails}>
          <Text style={styles.doctorName}>{name}</Text>
          <Text style={styles.doctorSpecialty}>{specialty}</Text>
          <Text style={styles.doctorAddress}>{address}</Text>
          <Text style={styles.doctorAvailability}>{availability}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.appointmentButton} onPress={handlePress}>
        <Text style={styles.appointmentButtonText}>Prendre RDV</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    doctorCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginHorizontal:12
      },
      doctorInfo: {
        flexDirection: 'row',
        marginBottom: 10,
      },
      doctorImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
      },
      doctorDetails: {
        flex: 1,
      },
      doctorName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
      },
      doctorSpecialty: {
        fontSize: 14,
        color: '#3498db',
      },
      doctorAddress: {
        fontSize: 12,
        color: '#555',
      },
      doctorAvailability: {
        fontSize: 12,
        color: '#27ae60',
      },
      appointmentButton: {
        backgroundColor: '#3498db',
        paddingVertical: 10,
        borderRadius: 25,
        alignItems: 'center',
      },
      appointmentButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
});

export default DoctorCard;
