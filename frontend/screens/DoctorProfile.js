import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Card, Avatar, Divider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Ensure you import this
import axios from "axios";
import { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { API_URL } from "../config";
import { useTranslation } from "react-i18next";

const DoctorProfile = ({ route }) => {
  const navigation = useNavigation();
  const { id } = route.params; // Récupérer l'ID du médecin passé en paramètre de la route
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/admin/DoctorProfile/${id}`
        );
        setDoctor(response.data);
        console.log(response.data);
      } catch (err) {
        console.log(err);
        setError(t("common.genericError"));
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [id]); // Recharger les données lorsque l'ID change

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#75E1E5" style={styles.loader} />
    );
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const avatarSource = doctor.Photo
    ? { uri: doctor.Photo }
    : require("../assets/doctor.jpg");

  return (
    <View style={styles.container}>
      {/* Header avec le bouton Retour */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{t("doctor.profileTitle")}</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <Avatar.Image
              size={100}
              source={avatarSource}
              style={styles.avatar}
            />
            <View style={styles.info}>
              <Text style={styles.name}>
                Dr. {doctor.nom} {doctor.prenom}
              </Text>
              <Text style={styles.specialty}>
                {t(`specialties.${doctor.specialite}`) || doctor.specialite}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.details}>
            <Text style={styles.sectionTitle}>{t("doctor.about")}</Text>

            {doctor.description ? (
              <Text style={styles.aboutText}>{doctor.description}</Text>
            ) : (
              <Text style={styles.aboutText}>{t("doctor.noDescription")}</Text>
            )}

            <Text style={styles.sectionTitle}>{t("doctor.formation")}</Text>
            {doctor.formation && doctor.formation.length > 0 ? (
              doctor.formation.map((line, index) => (
                <Text key={index} style={styles.aboutText}>
                  - {line}
                </Text>
              ))
            ) : (
              <Text style={styles.aboutText}>{t("doctor.noFormation")}</Text>
            )}

            <Text style={styles.sectionTitle}>{t("doctor.experience")}</Text>
            {doctor.experience && doctor.experience.length > 0 ? (
              doctor.experience.map((line, index) => (
                <Text key={index} style={styles.aboutText}>
                  - {line}
                </Text>
              ))
            ) : (
              <Text style={styles.aboutText}>{t("doctor.noExperience")}</Text>
            )}
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 16,
  },
  card: {
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  specialty: {
    fontSize: 16,
    color: "#777",
  },
  divider: {
    marginVertical: 16,
  },
  details: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
    marginBottom: 8,
  },
});

export default DoctorProfile;
