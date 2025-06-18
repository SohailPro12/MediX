import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import DefaultPatientPhoto from "../../assets/image.png"; // Assurez-vous que le chemin est correct
const PatientCard = ({ patient, isClickable = true }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const handleClick = () => {
    if (isClickable) {
      navigation.navigate("DossiersM", { patient });
    }
  };

  return (
    <View style={styles.card}>
      <Image
        source={patient?.photo ? { uri: patient.photo } : DefaultPatientPhoto}
        style={styles.image}
        defaultSource={DefaultPatientPhoto} // Pour iOS (optionnel)
      />
      <View style={styles.info}>
        <TouchableOpacity onPress={handleClick} disabled={!isClickable}>
          <Text style={styles.name}>
            {patient.nom} {patient.prenom}
          </Text>
        </TouchableOpacity>
        <Text style={styles.role}>{patient.telephone}</Text>
        <Text style={styles.lastVisit}>
          {patient.lastConfirmedAppointment
            ? `${t("doctor.patientCard.lastVisit")}: ${
                patient.lastConfirmedAppointment
              }`
            : t("doctor.patientCard.firstVisit")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 15,
    alignItems: "center",
    marginHorizontal: 1,
  },
  image: {
    width: 70,
    height: 70,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  role: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
  },
  lastVisit: {
    fontSize: 12,
    color: "#999",
  },
});

export default PatientCard;
