import { View,  FlatList, StyleSheet} from "react-native";
import Header from "../../components/DoctorComponents/Header";
import PatientCard from "../../components/DoctorComponents/PatientCard";

const patients = [
  {
    id: "1",
    name: "Ayoub Alaoui",
    role: "Patient",
    lastVisit: "02/02/2025",
    image: require("../../assets/doctor.png"),
    maladies: [
      {
        id: "1",
        nature: "Grippe",
        date: "Wednesday, Jun 15, 2025",
        medicaments: [
          {
            id: "1",
            name: "méd1",
            endDate: "2025-03-27",
            periods: ["Matin", "Soir"],
          },
          {
            id: "2",
            name: "méd2",
            endDate: "2025-04-27",
            periods: ["Matin"],
          },
        ],
        analyses: [
          {
            id: "1",
            name: "anal1",
            resultats: "https://www.africau.edu/images/default/sample.pdf",
          },
        ],
        traitement: "Faire du sport...",
      },
    ],
  },
  {
    id: "2",
    name: "Ahmed",
    role: "Patient",
    lastVisit: "",
    image: require("../../assets/doctor.png"), // Remplace par l'URL réelle
  },
  {
    id: "3",
    name: "karim",
    role: "Patient",
    lastVisit: "",
    image: require("../../assets/doctor.png"), // Remplace par l'URL réelle
  },
];

const PatientList = () => {
  return (
    <View style={styles.container}>
      <Header name='Liste des Patients' screen='SettingsDScreen'/>
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={index === 0 ? { marginTop: 10 } : {}}>
            <PatientCard patient={item} isClickable={true}/>
          </View>
        )}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingVertical:'12%',
  },
});

export default PatientList;