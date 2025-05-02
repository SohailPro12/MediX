import { View, FlatList, StyleSheet, Text, ActivityIndicator } from "react-native";
import Header from "../../components/DoctorComponents/Header";
import PatientCard from "../../components/DoctorComponents/PatientCard";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";
import { useMedecin } from '../context/MedecinContext';
const PatientList = () => {
    const { medecin } = useMedecin();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const res = await fetch(`${API_URL}/api/doctor/patients?medecinId=${medecin._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        print('Patients:', data); // Debugging line
        setPatients(data);
      } catch (err) {
        console.error('Erreur chargement patients', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Header name="Liste des Patients" screen="SettingsDScreen" />
      
      {loading ? (
        <ActivityIndicator size="large" color="#75E1E5" />
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <View style={index === 0 ? { marginTop: 10 } : {}}>
              <PatientCard
                patient={{
                  id: item._id,
                  name: `${item.nom} ${item.prenom}`,
                  role: 'Patient',
                  lastVisit: '', // On pourrait calculer à partir du dernier rdv si besoin
                  image: require("../../assets/doctor.png"),
                }}
                isClickable={true}
              />
            </View>
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Aucun patient trouvé.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingVertical: '12%',
  },
});

export default PatientList;
