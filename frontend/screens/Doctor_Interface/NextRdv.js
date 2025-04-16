import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Header from '../../components/DoctorComponents/Header';
const appointments = [ { id: "1", date: "20 Mars 2025", time: "10:00", patient: "M. Dupont" },
  { id: "2", date: "22 Mars 2025", time: "14:00", patient: "Mme Leroy" },
  { id: "3", date: "25 Mars 2025", time: "09:30", patient: "M. Moreau" },]; // hadi ila kant khawya kaytla3 message Aucun rendez-vous n'existe

export default function NextRdv() {
  return (
    <View style={styles.container}>
      <Header name="Prochains Rendez-vous" screen="DashboardDoctor"/>
      {appointments.length === 0 ? (
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
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.date}</Text>
              <Text style={styles.tableCell}>{item.time}</Text>
              <Text style={styles.tableCell}>{item.patient}</Text>
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
    padding: 4,
    paddingTop:50,
    padding:'3%'
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
