import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/DoctorComponents/Header";
import { useMedecin } from "../context/MedecinContext";
import { fetchAppointments } from "../../utils_Doctor/MedecinAppointement";

export default function NextRdv() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { medecin } = useMedecin();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadAppointments = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await fetchAppointments(medecin?._id, "confirmed", true);
      setAppointments(data);
      setError(null);
    } catch (error) {
      setError(t("doctor.nextAppointments.error"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [medecin?._id]);

  // Chargement initial
  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // Actualisation lors du focus
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadAppointments);
    return unsubscribe;
  }, [navigation, loadAppointments]);

  // Formatage de la date en français
  const formatFrenchDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BFFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        name={t("doctor.nextAppointments.title")}
        screen="DashboardDoctor"
      />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadAppointments}
            colors={["#00BFFF"]}
            tintColor="#00BFFF"
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : appointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {t("doctor.nextAppointments.empty")}
            </Text>
          </View>
        ) : (
          <View style={styles.table}>
            <View style={styles.tableRowHeader}>
              <Text style={styles.tableHeader}>
                {t("doctor.nextAppointments.table.date")}
              </Text>
              <Text style={styles.tableHeader}>
                {t("doctor.nextAppointments.table.time")}
              </Text>
              <Text style={styles.tableHeader}>
                {t("doctor.nextAppointments.table.patient")}
              </Text>
            </View>
            {appointments.map((item) => (
              <View key={item._id} style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {formatFrenchDate(item.date)}
                </Text>
                <Text style={styles.tableCell}>
                  {new Date(item.date).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <Text style={styles.tableCell}>
                  {item.PatientId?.nom} {item.PatientId?.prenom}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: "3%",
    paddingBottom: 20,
  },
  table: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingVertical: 17,
    elevation: 4,
    marginTop: 10,
  },
  tableRowHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#75E1E5",
    paddingBottom: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
    paddingHorizontal: 10,
  },
  tableHeader: {
    fontWeight: "700",
    fontSize: 16,
    color: "black",
    flex: 1,
    textAlign: "center",
  },
  tableCell: {
    fontSize: 15,
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
