import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PatientCard from '../../components/DoctorComponents/CurrentPatientCard';
import Header from '../../components/DoctorComponents/Header';
import SearchBar from '../../components/DoctorComponents/SearchBar';
import { useMedecin } from '../context/MedecinContext';
import { fetchPatients } from "../../utils_Docror/ListePatients"; 

const PatientListScreen = () => {
  const navigation = useNavigation();
  const { medecin } = useMedecin();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fonction de chargement des patients
  const fetchPatientData = useCallback(async () => {  
    try {
      setRefreshing(true);
      if (medecin?._id) {
        const data = await fetchPatients(medecin._id);  
        setPatients(data);
        setError(null);
      }
    } catch (err) {
      setError(err.message);  
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [medecin?._id]);

  // Chargement initial
  useEffect(() => {
    fetchPatientData();
  }, [fetchPatientData]);

  // Actualisation lors du focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchPatientData);
    return unsubscribe;
  }, [navigation, fetchPatientData]);

  // Filtrage des patients selon la recherche
  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.nom} ${patient.prenom}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  // Fonction de rafraîchissement manuel
  const onRefresh = useCallback(() => {
    fetchPatientData();
  }, [fetchPatientData]);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BFFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryText} onPress={fetchPatientData}>
          Réessayer
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header name="Les patients suivis" screen="DashboardDoctor" />
      <SearchBar 
        searchplaceholder="Rechercher un patient..." 
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      
      <FlatList
        data={filteredPatients}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <PatientCard patient={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchQuery ? 'Aucun patient trouvé' : 'Aucun patient à afficher'}
          </Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#00BFFF"]}
            tintColor="#00BFFF"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    paddingHorizontal: '3%',
    backgroundColor: '#F1F5F9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  retryText: {
    color: '#00BFFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16,
  },
});

export default PatientListScreen;