import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DoctorCard from "../Component/DoctorCard"; 
import styles from './styleDoctorList.js'
// Importer l'image locale
const doctorImage = require("../assets/doctor.png");

const doctors = [
  { id: "1", name: "Dr. Ahmed", specialty: "Cardiologist", image: doctorImage },
  { id: "2", name: "Dr. Sarah", specialty: "Dermatologist", image: doctorImage },
  { id: "3", name: "Dr. John", specialty: "Neurologist", image: doctorImage },
];

const DoctorList = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des médecins</Text>

      {/* Liste des docteurs */}
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DoctorCard name={item.name} specialty={item.specialty} image={item.image} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyMessage}>Aucun médecin trouvé.</Text>}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
              }}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default DoctorList;
