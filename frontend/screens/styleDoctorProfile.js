import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  
    container: {
      alignItems: 'center',
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 15,
      padding: 40,
      
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    avatar: {
      marginRight: 20,
    },
    info: {
      flex: 1,
    },
    name: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#1086e2',
    },
    specialty: {
      fontSize: 20,
      color: '#424242',
      marginVertical: 5,
    },
    divider: {
      marginVertical: 20,
      backgroundColor: '#E0E0E0',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#1086e2',
    },
    aboutText: {
      fontSize: 17,
      color: '#424242',
      marginBottom: 15,
      lineHeight: 22,
    },
    
  });
  export default styles;