import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import StatCard from "../../components/DoctorComponents/StatCard";
import MenuCard from "../../components/DoctorComponents/MenuCard";
import ProfileBar from "../../components/DoctorComponents/ProfileBar";
import NavigationBar from "../../components/DoctorComponents/NavigationBar";
import { useNavigation } from "@react-navigation/native";

const Dashboard = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      
      {/* Barre de profil */}
      <ProfileBar screen='SettingsDScreen'/>

      {/* Statistiques principales avec clics */}
      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={styles.statButton}
          onPress={()=>navigation.navigate("NextRdv")}
          activeOpacity={0.8}
        >
          <StatCard icon="calendar-alt" label="Prochains RDV" value="8" color="#FF5733" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statButton}
          onPress={()=>navigation.navigate("PatientSuivi")}
          activeOpacity={0.8}
        >
          <StatCard icon="user-friends" label="Patients Suivis" value="124" color="#33A1FF" />
        </TouchableOpacity>

        <View
          style={styles.statButton}
          activeOpacity={0.8}
        >
          <StatCard icon="prescription-bottle" label="Traitements" value="45" color="#28A745" />
        </View>
      </View>

      {/* Menu de navigation */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={()=>navigation.navigate("AppointmentsList")}
          activeOpacity={0.8}
        >
          <MenuCard icon="calendar-check" label="Mes Rendez-vous" color="#FF5733" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={()=>navigation.navigate("Ordonnance")}
          activeOpacity={0.8}
        >
          <MenuCard icon="file-document-edit" label="Ordonnasnces" color="#28A745" />
        </TouchableOpacity>
      </View>

      {/* Barre de navigation inférieure */}
      <NavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  statButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  menuContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  menuButton: {
    width: "45%",
    marginBottom: 30,
  },
});

export default Dashboard;
