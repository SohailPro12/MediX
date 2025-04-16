
import React from "react";
import { View,Text,StyleSheet } from "react-native";
import { FontAwesome5} from "@expo/vector-icons";

// Composant pour les cartes de statistiques

export default function StatCard ({ icon, label, value, color })  {
    return(
    <View style={styles.statCard}>
      <FontAwesome5 name={icon} size={27} color={color} />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  statCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%", // ← change ici : laisse le parent gérer la largeur
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    color: "#555",
    marginTop: 5,
    textAlign: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 3,
  },
});
