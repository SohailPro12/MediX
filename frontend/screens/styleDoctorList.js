import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      padding: 16,
    },
    title: {
      padding:10,
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 16,
      color: "#333",
    },
    list: {
      paddingBottom: 80,
    },
    emptyMessage: {
      fontSize: 16,
      color: "#999",
      textAlign: "center",
      marginTop: 20,
    },
    addButton: {
      position: "absolute",
      bottom: 20,
      right: 20,
      backgroundColor: "#007bff",
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      
    },
  });
  
  export default styles ;
  