import { View, Text, StyleSheet} from "react-native";
import {MaterialCommunityIcons } from "@expo/vector-icons";



// Composant pour les cartes de navigation
export default function MenuCard({ icon, label, color }) {
    return(
    <View style={styles.menuCard}>
      <MaterialCommunityIcons name={icon} size={33} color={color} />
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    menuCard: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        width: "100%",
        elevation: 3,
      },
      menuLabel: {
        fontSize: 14,
        marginTop: 5,
        fontWeight: "bold",
      },


  });