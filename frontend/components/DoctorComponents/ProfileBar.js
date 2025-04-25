import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image, Alert } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "../../config"; // Assurez-vous que le chemin est correct
import { useMedecin } from "../../screens/context/MedecinContext"; // Import du hook useMedecin

export default function ProfileBar({ screen }) {
  const navigation = useNavigation();
  const [doctor, setDoctor] = useState(null);
  const { setMedecin } = useMedecin(); // Utilisation du hook pour accéder à setMedecin

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) throw new Error('Token manquant');

        const response = await fetch(`${API_URL}/api/doctor/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur serveur: ${errorText}`);
        }

        const data = await response.json();
        setDoctor(data);
        setMedecin(data); // Mise à jour du contexte avec les données du médecin
      } catch (error) {
        console.error("Erreur récupération médecin:", error);
        Alert.alert("Erreur", "Impossible de charger le profil");
      }
    };

    fetchDoctor();
  }, [setMedecin]);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      navigation.navigate('CodeSSOScreen'); // Redirige vers l'écran de connexion
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  }

  return (
    <View style={styles.profileBar}>
      {doctor && (
        <TouchableOpacity style={styles.profileInfo} onPress={() => navigation.navigate(screen)}>
          <Image 
            source={doctor.Photo ? { uri: doctor.image } : require('../../assets/doctor.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileText}>
            <Text style={styles.doctorName}>Dr.{doctor.nom}</Text>
            <Text style={styles.speciality}>{doctor.specialite}</Text>
          </View>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <FontAwesome5 name="sign-out-alt" size={24} color="#FF5733" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profileBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: -15,
    borderRadius: 10,
    marginBottom: 35,
    marginTop: 10,
    marginLeft: -13,
    backgroundColor: "white",
    padding: 16,
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
