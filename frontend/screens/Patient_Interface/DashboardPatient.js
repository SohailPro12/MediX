import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import StatusCardList from "../../components/PatientComponents/StatusCardList";
import ProfileBar from "../../components/PatientComponents/ProfileBar";
import BottomNav from "../../components/PatientComponents/BottomNav";
import MedicationPlanScreen from "../../components/PatientComponents/MedicationPlanScreen";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const DashboardPatient = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <ProfileBar /> {/* Cartes de statut */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("AllAppointmentsScreen")}
        >
          <StatusCardList
            label={t("patient.dashboard.myAppointments")}
            backgroundColor="#FBCFE8"
            textColor="#9D174D"
            wid={119}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("MyDoctorList")}
        >
          <StatusCardList
            label={t("patient.dashboard.myDoctors")}
            backgroundColor="#FED7AA"
            textColor="#9A3412"
            wid={108}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("SearchDoctor")}
        >
          <StatusCardList
            label={t("patient.dashboard.scheduleAppointment")}
            backgroundColor="#FCA5A5"
            textColor="#991B1B"
            wid={118}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("MonDossierMedical")}
        >
          <StatusCardList
            label={t("patient.dashboard.medicalRecord")}
            backgroundColor="#86EFAC"
            textColor="#14532D"
            wid={108}
          />
        </TouchableOpacity>
      </View>
      {/* les medicaments */}
      <SafeAreaView style={{ flex: 1 }}>
        <MedicationPlanScreen />
      </SafeAreaView>
      {/* Barre de navigation inférieure */}
      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingTop: 40,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 22,
  },
});

export default DashboardPatient;
