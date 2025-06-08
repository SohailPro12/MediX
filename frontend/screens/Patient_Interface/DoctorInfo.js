import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Avatar, Divider } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function DoctorInfo({ navigation }) {
  const { t } = useTranslation();
  const route = useRoute();
  const passedDoctor = route.params?.doctor;
  console.log("hadchi", passedDoctor);
  const {
    name = t("patient.doctorInfo.unknownName"),
    specialty = t("patient.doctorInfo.unknownSpecialty"),
    email = t("patient.doctorInfo.notSpecified"),
    telephone = t("patient.doctorInfo.notSpecified"),
    address = "",
    about = t("patient.doctorInfo.noInfoProvided"),
    image = "",
    formation,
    experience,
  } = passedDoctor || {};
  const safeFormation =
    typeof formation === "string"
      ? formation.split(",")
      : Array.isArray(formation)
      ? formation
      : [];
  const safeExperience =
    typeof experience === "string"
      ? experience.split(",")
      : Array.isArray(experience)
      ? experience
      : [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#5771f9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("patient.doctorInfo.title")}</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.profileHeader}>
              <Avatar.Image size={120} source={image} style={styles.avatar} />
              <View style={styles.info}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.specialty}>{specialty}</Text>

                <View style={styles.contactContainer}>
                  <Ionicons name="mail-outline" size={16} color="#64748b" />
                  <Text style={styles.contact}>{email}</Text>
                </View>

                <View style={styles.contactContainer}>
                  <Ionicons name="call-outline" size={16} color="#64748b" />
                  <Text style={styles.contact}>{telephone}</Text>
                </View>
                <View style={styles.contactContainer}>
                  <Ionicons name="location-outline" size={16} color="#64748b" />
                  <Text style={styles.contact}>{address}</Text>
                </View>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.details}>
              <Text style={styles.sectionTitle}>
                {t("patient.doctorInfo.about")}
              </Text>
              <Text style={styles.aboutText}>{about}</Text>

              <Text style={styles.sectionTitle}>
                {t("patient.doctorInfo.formation")}
              </Text>
              {(safeFormation ?? []).map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}

              <Text style={styles.sectionTitle}>
                {t("patient.doctorInfo.experience")}
              </Text>
              {(safeExperience ?? []).map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9ff",
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(87, 113, 249, 0.1)",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    letterSpacing: 0.5,
  },
  headerRightPlaceholder: {
    width: 28,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 16,
    shadowColor: "#5771f9",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(87, 113, 249, 0.1)",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingTop: 16,
  },
  avatar: {
    marginRight: 20,
    borderColor: "#e0e7ff",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  specialty: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3b82f6",
    marginBottom: 12,
  },
  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  contact: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 8,
  },
  divider: {
    marginVertical: 16,
    backgroundColor: "#e2e8f0",
    height: 1,
  },
  details: {
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
    marginTop: 8,
  },
  aboutText: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
    marginBottom: 16,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3b82f6",
    marginTop: 8,
    marginRight: 10,
  },
  listText: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
    flex: 1,
  },
});
