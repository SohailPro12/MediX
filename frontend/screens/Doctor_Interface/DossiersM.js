import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import Header from "../../components/DoctorComponents/Header";
import PatientCard from "../../components/DoctorComponents/PatientCard";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";
import openPdf from "./openPdf";
import { AntDesign } from "@expo/vector-icons";

export default function DossiersM() {
  const { t } = useTranslation();
  const route = useRoute();
  const nav = useNavigation();
  const patient = route.params.patient;

  const [loading, setLoading] = useState(true);
  const [ordonnances, setOrdonnances] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const res = await fetch(
          `${API_URL}/api/doctor/dossiers/${patient._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
          if (res.status === 404) {
            setOrdonnances([]); // aucun dossier          } else {
            throw new Error(t("doctor.medicalRecords.loadError"));
          }
        }

        const data = await res.json();
        setOrdonnances(data.ordonnances || data); // si ton endpoint renvoie un objet avec .ordonnances
      } catch (e) {
        console.error(e);
        Alert.alert(t("common.error"), e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [patient._id]);

  const handleDelete = (id) => {
    Alert.alert(
      t("doctor.medicalRecords.deleteConfirmation.title"),
      t("doctor.medicalRecords.deleteConfirmation.message"),
      [
        {
          text: t("doctor.medicalRecords.deleteConfirmation.cancel"),
          style: "cancel",
        },
        {
          text: t("doctor.medicalRecords.deleteConfirmation.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("authToken");
              await fetch(`${API_URL}/api/doctor/ordonnances/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });
              setOrdonnances((o) => o.filter((x) => x._id !== id));
            } catch (e) {
              console.error(e);
              Alert.alert(
                t("common.error"),
                t("doctor.medicalRecords.errors.deleteError")
              );
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <ActivityIndicator style={styles.loader} size="large" color="#75E1E5" />
    );
  }

  return (
    <View style={styles.container}>
      <Header name={t("doctor.medicalRecords.title")} screen="PatientList" />
      <PatientCard patient={patient} isClickable={false} />

      <FlatList
        data={ordonnances}
        keyExtractor={(o) => o._id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text>{t("doctor.medicalRecords.noPrescriptions")}</Text>
        }
        renderItem={({ item }) => {
          const rdvDate =
            typeof item.RendezVousId === "object"
              ? new Date(item.RendezVousId.date).toLocaleDateString()
              : t("doctor.medicalRecords.unavailableDate");
          console.log(item.RendezVousId.lieu);
          return (
            <View style={styles.card}>
              <Text style={styles.date}>
                {t("doctor.medicalRecords.rdvDate")} {rdvDate}
              </Text>
              <Text style={styles.nature}>{item.natureMaladie}</Text>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() =>
                    nav.navigate("AddOrdonnanceScreen", {
                      ordonnanceId: item._id,
                    })
                  }
                >
                  <AntDesign name="edit" size={16} color="white" />
                  <Text style={styles.btnText}>
                    {t("doctor.medicalRecords.edit")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "crimson" }]}
                  onPress={() => handleDelete(item._id)}
                >
                  <AntDesign name="delete" size={16} color="white" />
                  <Text style={styles.btnText}>
                    {t("doctor.medicalRecords.delete")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center" },
  container: { flex: 1, backgroundColor: "#fff" },
  card: {
    backgroundColor: "#f8f9fa",
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
  },
  date: { fontSize: 14, color: "#555" },
  nature: { fontSize: 16, fontWeight: "bold", marginVertical: 6 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4287f5",
    padding: 8,
    borderRadius: 6,
  },
  btnText: { color: "#fff", marginLeft: 4 },
});
