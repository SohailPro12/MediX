import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Avatar, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Ensure you import this
const doctorImage = require("../assets/doctor.jpg");


// Your component
const DoctorProfile = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header avec le bouton Retour */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Profil du médecin</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <Avatar.Image size={100} source={doctorImage} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.name}>Dr. Jean Dupont</Text>
              <Text style={styles.specialty}>Spécialiste en Cardiologie</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.details}>
            <Text style={styles.sectionTitle}>À propos</Text>
            <Text style={styles.aboutText}>
              Dr. Jean Dupont est un cardiologue expérimenté avec plus de 15 ans d'expérience.
              Passionné par la santé cardiaque, il s'engage à fournir des soins personnalisés
              et de qualité à ses patients.
            </Text>

            <Text style={styles.sectionTitle}>Formation</Text>
            <Text style={styles.aboutText}>- Doctorat en Médecine, Université de Paris</Text>
            <Text style={styles.aboutText}>- Spécialisation en Cardiologie, Hôpital Européen Georges-Pompidou</Text>

            <Text style={styles.sectionTitle}>Expérience</Text>
            <Text style={styles.aboutText}>- 5 ans en tant que cardiologue à l'Hôpital Saint-Louis</Text>
            <Text style={styles.aboutText}>- 10 ans d'expérience en recherche sur les maladies cardiovasculaires</Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

// Styles (with missing import now included)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 16,
  },
  card: {
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  specialty: {
    fontSize: 16,
    color: '#777',
  },
  divider: {
    marginVertical: 16,
  },
  details: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
});

export default DoctorProfile;
