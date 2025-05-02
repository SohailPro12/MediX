import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import StatCard from "../../components/DoctorComponents/StatCard";
import MenuCard from "../../components/DoctorComponents/MenuCard";
import ProfileBar from "../../components/DoctorComponents/ProfileBar";
import NavigationBar from "../../components/DoctorComponents/NavigationBar";
import { useNavigation } from "@react-navigation/native";
import { useMedecin } from "../context/MedecinContext"; // Import du hook useMedecin
import { fetchAppointments } from "../../utils/MedecinAppointement"; // Assurez-vous que le chemin est correct
import { fetchPatients } from "../../utils/ListePatients";



const Dashboard = () => {
  const navigation = useNavigation();
  const { medecin } = useMedecin();
  const [rdvCount, setRdvCount] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getRdvCount = async () => {
      try {
        const data = await fetchAppointments(medecin?._id, "confirmed", true);
        setRdvCount(data.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (medecin) getRdvCount();
  }, [medecin]);

  const [patientCount, setPatientCount] = useState(0);

useEffect(() => {
  const getPatientCount = async () => {
    try {
      const data = await fetchPatients(medecin?._id);
      setPatientCount(data.length);
    } catch (err) {
      console.error("❌ Erreur patients:", err);
    }
  };
  if (medecin) getPatientCount();
}, [medecin]);



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
         <StatCard
          icon="calendar-alt"
          label="Prochains RDV"
          value={loading ? "..." : rdvCount}
          color="#FF5733"
        />

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statButton}
          onPress={()=>navigation.navigate("PatientSuivi")}
          activeOpacity={0.8}
        >
        <StatCard
          icon="user-friends"
          label="Patients Suivis"
          value={loading ? "..." : patientCount}
          color="#33A1FF"
        />
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
          <MenuCard icon="file-document-edit" label="Ordonnances" color="#28A745" />
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
