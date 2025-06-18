import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Card } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";
import DeleteAlert from "./DeleteAlert";

const PatientItem = ({ patient }) => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <Card style={styles.card}>
      <Card.Title
        title={`${patient.nom} ${patient.prenom}`}
        subtitle={`${t("doctor.patientCard.fileNumber")}: ${
          patient.dossierMedicalId
        }`}
        left={(props) => (
          <Icon {...props} name="account-circle" size={40} color="#4A90E2" />
        )}
      />
      <Card.Content>
        <Text style={styles.info}>
          <Icon name="id-card" size={20} color="#4A90E2" /> {patient.cin}
        </Text>
        <Text style={styles.info}>
          <Icon name="phone" size={20} color="#4A90E2" /> {patient.telephone}
        </Text>
        <Text style={styles.info}>
          <Icon name="email" size={20} color="#4A90E2" /> {patient.mail}
        </Text>
        <Text style={styles.info}>
          <Icon name="map-marker" size={20} color="#4A90E2" /> {patient.adresse}
        </Text>
      </Card.Content>
      <Card.Actions>
        {/* supp button*/}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="delete" size={20} color="white" />
        </TouchableOpacity>
      </Card.Actions>
      {/* Modal de confirmation */}
      <DeleteAlert
        isVisible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={() => {
          setModalVisible(false);
        }}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 12,
    marginVertical: 1,
    marginHorizontal: 1,
    backgroundColor: "#fff",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    fontSize: 16,
    color: "#333",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#02e5de",
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    marginRight: 1,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d9534f",
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    marginLeft: 5,
    fontSize: 16,
  },
});

export default PatientItem;
