import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';

import PatientCard from '../../components/DoctorComponents/CurrentPatientCard';
import Header from '../../components/DoctorComponents/Header';
import SearchBar from '../../components/DoctorComponents/SearchBar';
import { useMedecin } from '../context/MedecinContext';
import { fetchPatients } from "../../utils/ListePatients"; 


const PatientListScreen = () => {
  const { medecin } = useMedecin();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchPatientData = async () => {  
    try {
      if (medecin && medecin._id) {
        const data = await fetchPatients(medecin._id);  
        setPatients(data);  
      }
    } catch (err) {
      setError(err.message);  
    } finally {
      setLoading(false);  
    }
  };

  useEffect(() => {
    if (medecin && medecin._id) {
      fetchPatientData();  
    }
  }, [medecin]);

  if (loading) {
    return <ActivityIndicator size="large" color="#00BFFF" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  console.log(patients);
  return (
    <View style={styles.container}>
      <Header name="Les patients suivis" screen="DashboardDoctor" />
      <SearchBar searchplaceholder="Rechercher un patient..." />
      
      <FlatList
        data={patients}
        keyExtractor={(item) => item._id} 
        renderItem={({ item }) => <PatientCard patient={item} />}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    padding: '3%',
    backgroundColor: '#F1F5F9',
  },
});

export default PatientListScreen;
