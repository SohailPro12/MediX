import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#f8f9fa",
      padding: 20,
      marginVertical: 9,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 9,
      elevation: 2,
    },
    image: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    name: {
      fontSize: 18,
      fontWeight: "bold",
    },
    specialty: {
      fontSize: 14,
      color: "#666",
    },
  });
  export default styles