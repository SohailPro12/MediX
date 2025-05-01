import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Header from "../../components/DoctorComponents/Header";
import { useMedecin } from "../context/MedecinContext"; 
import { fetchAppointments } from "../../utils/MedecinAppointement"


export default function NextRdv() {
  const { medecin } = useMedecin(); 
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRdv = async () => {
      try {
        const data = await fetchAppointments(medecin?._id , "confirmed", true);
        console.log(data);
        
        setAppointments(data);
      } catch (error) {
        setError("Erreur de récupération");
      } finally {
        setLoading(false);
      }
    };
    if (medecin) getRdv();
  }, [medecin]);


  if (loading) return <ActivityIndicator size="large" color="#00BFFF" />;

  return (
    <View style={styles.container}>
      <Header name="Prochains Rendez-vous" screen="DashboardDoctor" />
      {error ? (
        <Text style={styles.emptyText}>{error}</Text>
      ) : appointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun rendez-vous n'existe</Text>
        </View>
      ) : (
        <View style={styles.table}>
          <View style={styles.tableRowHeader}>
            <Text style={styles.tableHeader}>Date</Text>
            <Text style={styles.tableHeader}>Heure</Text>
            <Text style={styles.tableHeader}>Patient</Text>
          </View>
          {appointments.map((item) => (
            <View key={item._id} style={styles.tableRow}>
              <Text style={styles.tableCell}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
              <Text style={styles.tableCell}>
                {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Text style={styles.tableCell}>
                {item.PatientId?.nom} {item.PatientId?.prenom}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingTop: 50,
    padding: '3%',
  },
  table: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingVertical: 17,
    elevation: 4,
  },
  tableRowHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#75E1E5",
    paddingBottom: 8,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
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
});
