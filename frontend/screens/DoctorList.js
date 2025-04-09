import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity,ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DoctorCard from "../components/DoctorCard.js"; 
import SearchBar from "../components/SearchBar.js"; 
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';
import axios from 'axios'; // Assure-toi d'importer axios pour faire les requêtes HTTP
import {API_URL} from '../config'; // Assure-toi d'importer l'URL de l'API depuis le fichier de configuration

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);  // Déclaration de l'état pour stocker la liste des médecins
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleDoctorDeleted = (id) => {
    setDoctors((prevDoctors) => prevDoctors.filter((doc) => doc._id !== id));
  };



  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/admin/Medecins`);
        const doctorsList = response.data.Doctors; 
        setDoctors(doctorsList);  // Met à jour l'état avec la liste des médecins
    
      } catch (err) {
        setError('Erreur lors du chargement des Médecins');
      } finally {
        setLoading(false);
      }
    };
  
    fetchDoctors();  // Appel de la fonction pour récupérer les médecins
  }, []);
  
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

    {loading ? (
        <ActivityIndicator size="large" color="#75E1E5" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{t('errorFetchingDoctors')}</Text>
      ) : (
        // Liste des médecins
        <FlatList
          data={doctors}
          keyExtractor={(item) => item._id} // Assure-toi d'utiliser un identifiant unique comme l'ID
          renderItem={({ item }) => (    

            <DoctorCard id={item._id} name={item.nom} prenom={item.prenom} specialty={item.specialite} photo={item.Photo} onDelete={handleDoctorDeleted} />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyMessage}>{t('noDoctorsFound')}</Text>}
        />
      )}

      {/* Bouton pour ajouter un nouveau médecin */}
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
    marginTop: 27,
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
