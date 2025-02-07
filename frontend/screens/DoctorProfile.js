import React from 'react';
import { View, Text} from 'react-native';
import { Card, Avatar, Divider } from 'react-native-paper';
const doctorImage = require("../assets/doctor.png");
import styles from './styleDoctorProfile.js'
const DoctorProfile = () => {
  return (

      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Avatar.Image
                size={100}
                source={doctorImage}
                style={styles.avatar}
              />
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



export default DoctorProfile;
