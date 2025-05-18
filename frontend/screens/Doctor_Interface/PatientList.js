import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/DoctorComponents/Header";
import PatientCard from "../../components/DoctorComponents/PatientCard";
import { useMedecin } from "../context/MedecinContext";
import * as patientAPI from "../../utils_Docror/ListePatients"; // Assurez-vous que le chemin est correct

const PatientList = ({ route }) => {
  const navigation = useNavigation();
  const { medecin } = useMedecin();
  const [allPatients, setAllPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllPatientData = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      if (!medecin?._id) return;

      const [appointmentPatients, doctorPatients] = await Promise.all([
        patientAPI.fetchPatients(medecin._id),
        patientAPI.fetchPatientMedecin(medecin._id)
      ]);

      const uniquePatientsMap = new Map();
      
      [...appointmentPatients, ...doctorPatients].forEach(patient => {
        if (patient?._id) {
          uniquePatientsMap.set(patient._id.toString(), patient);
        }
      });

      setAllPatients(Array.from(uniquePatientsMap.values()));
    } catch (err) {
      console.error("Erreur de chargement:", err);
      setError(err.message || "Erreur lors du chargement des patients");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [medecin?._id]);

  useEffect(() => {
    fetchAllPatientData();
  }, [fetchAllPatientData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchAllPatientData);
    return unsubscribe;
  }, [navigation, fetchAllPatientData]);

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#75E1E5" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          mode="contained" 
          onPress={fetchAllPatientData}
          style={styles.retryButton}
          labelStyle={styles.buttonLabel}
        >
          Réessayer
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header name="Mes Patients" screen="SettingsDScreen" />
      
      <FlatList
        data={allPatients}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <PatientCard 
            patient={item} 
            isClickable={true}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>Aucun patient trouvé</Text>
          </View>
        }
        refreshing={refreshing}
        onRefresh={fetchAllPatientData}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#75E1E5',
    width: '60%',
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});

export default PatientList;
