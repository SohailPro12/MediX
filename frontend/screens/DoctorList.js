import React from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DoctorCard from "../components/DoctorCard.js"; 
import SearchBar from "../components/SearchBar.js"; 
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';
// Importer l'image locale
const doctorImage = require("../assets/doctor.jpg");

const doctors = [
  { id: "1", name: "Dr. Ahmed", specialty: "Cardiologist", image: doctorImage },
  { id: "2", name: "Dr. Sarah", specialty: "Dermatologist", image: doctorImage },
  { id: "3", name: "Dr. John", specialty: "Neurologist", image: doctorImage },
];

const DoctorList = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Header avec bouton de retour */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('Liste des médecins')}</Text>
      </View>

      {/* Barre de recherche */}
      <SearchBar />

      {/* Liste des docteurs */}
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DoctorCard name={item.name} specialty={item.specialty} image={item.image} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyMessage}>{t('noDoctorsFound')}</Text>}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddDoctor")}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 16,
    color: "#333",
  },
  list: {
    paddingBottom: 80,
  },
  emptyMessage: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 50,
    right: 20,
    backgroundColor: "#75E1E5",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DoctorList;