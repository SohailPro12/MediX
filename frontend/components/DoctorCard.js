import React, { useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert} from "react-native";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import DeleteAlert from "./DeleteAlert";
import { useTranslation } from 'react-i18next'
import {API_URL} from '../config'; // Assure-toi d'importer l'URL de l'API depuis le fichier de configuration


const DoctorCard = ({ id, name, prenom, specialty, photo, onDelete
} ) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const HandleDelete = async () => {
    console.log("user",id);
    try {
          const response = await fetch(`${API_URL}/api/admin/deleteMedecin/${id}`, {
            method: "DELETE",
          });
      
          const result = await response.json();
          console.log("Réponse brute:", result);
          if (response.ok) {
            Alert.alert("Succès", result.message);
            onDelete(id);
          } else {
            Alert.alert("Erreur", result.message);
          }
        } catch (error) {
          console.error("Erreur suppression compte:", error);
          Alert.alert("Erreur", "Impossible de supprimer le compte.");
        }
  
  }
  
  const image = photo ? { uri: photo } : require('../assets/doctor.jpg');


  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('DoctorProfile', { id })}>
        <View style={styles.card}>
        <Image source={image} style={styles.image} />
        <View style={styles.textContainer}>
            <Text style={styles.name}>Dr {name} {prenom}</Text>
            <Text style={styles.specialty}>{t(specialty)}</Text>
          </View>

          {/* Icône de suppression qui ouvre le modal */}
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Icon name="delete" size={20} color="#6a6e6b" style={styles.deleteIcon} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Modal de confirmation */}
      <DeleteAlert
        isVisible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={() => {
          setModalVisible(false);
          HandleDelete();
        }}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
    marginVertical: 9,
    marginHorizontal: 9,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 9,
    elevation: 2,
    justifyContent: 'space-between', // Ajouter cet alignement pour positionner l'icône à droite
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  specialty: {
    fontSize: 14,
    color: "#666",
  },
  deleteIcon: {
    marginLeft: 10,  // Ajout d'un peu d'espace autour de l'icône
  },
});

export default DoctorCard;