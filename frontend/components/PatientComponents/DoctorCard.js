// DoctorCard.js
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

function DoctorCard(med) {
  const { _id, name, specialty, address, availability, image } = med;
  const navigation = useNavigation();
  const { t } = useTranslation();
  console.log(med);
  
  // Map backend day names to frontend day names
  const mapBackendDayToFrontend = (backendDay) => {
    const dayMapping = {
      'dimanche': t("patient.bookAppointment.days.sunday"),
      'lundi': t("patient.bookAppointment.days.monday"),
      'mardi': t("patient.bookAppointment.days.tuesday"),
      'mercredi': t("patient.bookAppointment.days.wednesday"),
      'jeudi': t("patient.bookAppointment.days.thursday"),
      'vendredi': t("patient.bookAppointment.days.friday"),
      'samedi': t("patient.bookAppointment.days.saturday"),
    };
    return dayMapping[backendDay.toLowerCase()] || backendDay;
  };
  
  const handlePress = () => {
    navigation.navigate("PrendreRdv", {
      ...med, // Pass the entire med object with original field names
    });
  };

  return (
    <View style={styles.doctorCard}>
      <View style={styles.doctorInfo}>
        {image ? (
          <Image source={{ uri: image }} style={styles.doctorImage} />
        ) : (
          <Image
            source={require("../../assets/doctor.jpg")}
            style={styles.doctorImage}
          />
        )}
        <View style={styles.doctorDetails}>
          <Text style={styles.doctorName}>{name}</Text>
          <Text style={styles.doctorSpecialty}>{specialty}</Text>
          <Text style={styles.doctorAddress}>{address}</Text>          <Text style={styles.doctorAvailability}>
            {(availability || med.disponibilite || []).map((item, index) => {
              const jour = mapBackendDayToFrontend(item.jour) ?? t("patient.doctorCard.unknownDay");
              const debut = item.heureDebut ?? "??:??";
              const fin = item.heureFin ?? "??:??";
              return `${jour} : ${debut} - ${fin}${
                index < (availability || med.disponibilite || []).length - 1 ? "\n" : ""
              }`;
            })}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() =>
            navigation.navigate("DoctorInfo", { doctor: med })
          }
        >
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#3498db"
          />
          <Text style={styles.secondaryButtonText}>
            {t("patient.doctorCard.details")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={handlePress}>
          <Text style={styles.primaryButtonText}>
            {t("patient.doctorCard.bookAppointment")}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  doctorCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 12,
  },
  doctorInfo: {
    flexDirection: "row",
    marginBottom: 10,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#3498db",
    marginBottom: 2,
  },
  doctorAddress: {
    fontSize: 12,
    color: "#555",
    marginBottom: 5,
  },
  doctorAvailability: {
    fontSize: 12,
    color: "#27ae60",
    lineHeight: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 10,
  },
  primaryButton: {
    flex: 2,
    backgroundColor: "#3498db",
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  secondaryButtonText: {
    color: "#3498db",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default DoctorCard;
