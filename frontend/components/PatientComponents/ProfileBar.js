import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "../../config";
import { usePatient } from "../../screens/context/PatientContext";

const ProfileBar = ({ onLogout }) => {
  const navigation = useNavigation();
  const { patient, setPatient } = usePatient(); // Correct usage of context

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) throw new Error('Token manquant');

        const response = await fetch(`${API_URL}/api/patient/profile`, {
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
        setPatient(data);
      } catch (error) {
        console.error("Erreur récupération patient:", error);
        Alert.alert("Erreur", "Impossible de charger le profil");
      }
    };

    fetchPatient();
  }, [setPatient]);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      navigation.navigate('CodeSSOScreen');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.profileSection}
        onPress={() => navigation.navigate("PatientProfile")}
        >
        <Image
          source={
            patient?.photo
              ? { uri: `${API_URL}/uploads/${patient.photo}` }
              : require("../../assets/image.png")
          }
          style={styles.profileImage}
        />
      <Text style={styles.username}>
        {(patient?.nom && patient?.prenom) ? `${patient.nom} ${patient.prenom}` : 'Patient'}
      </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout || logout}>
        <View style={styles.logoutContent}>
          <Ionicons name="arrow-forward-circle" size={28} color="#FF6347" />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 7,
    marginBottom: 14,
    marginLeft: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 0.7,
    borderBottomColor: '#ddd',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 5,
    borderRadius: 5,
    marginRight: 9,
  },
  logoutContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 12,
    color: '#FF6347',
    fontWeight: '500',
    marginTop: 2,
  },
});

export default ProfileBar;
