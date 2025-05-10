import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from "../../config";
import { usePatient  } from '../context/PatientContext';

export default function MyDoctorsList({ navigation }) {
  const { patient } = usePatient();
  const patientId = patient?._id;
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDoctors = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/patient/getDocteurs?patientId=${patientId}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Formater les données pour avoir une structure cohérente
      const formattedDoctors = data.map(doctor => ({
        id: doctor._id,
        name: `Dr. ${doctor.prenom} ${doctor.nom}`,
        specialty: doctor.specialite,
        cin: doctor.cin,
        image: doctor.photo ? { uri: doctor.photo } : require('../../assets/doctor.jpg'),
        about: `Dr. ${doctor.prenom} ${doctor.nom} est spécialisé en ${doctor.specialite}`,
        formation: "- Diplômé en médecine",
        experience: `- Spécialiste en ${doctor.specialite}`
      }));
      
      setDoctors(formattedDoctors);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message || 'Impossible de charger les médecins');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchDoctors();
    }
  }, [patientId]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDoctors();
  };

  const renderDoctor = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={{ flexDirection: 'row' }}>
          <Image source={item.image} style={styles.avatar} />
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={styles.doctorName}>{item.name}</Text>
            <Text style={styles.specialty}>{item.specialty}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.infobutton}
          onPress={() => navigation.navigate("DoctorInfo", { doctor: item })}
        >
          <Text style={styles.infoText}>Info</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5771f9" />
        <Text>Chargement de vos médecins...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchDoctors}
        >
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#5771f9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Médecins</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={renderDoctor}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#5771f9']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Vous n'avez pas encore de médecins</Text>
            <TouchableOpacity onPress={fetchDoctors}>
              <Text style={styles.refreshText}>Actualiser</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#E0E4FF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  doctorName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infobutton: {
    backgroundColor: '#5771f9',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginLeft: 'auto',
  },
  infoText: {
    color: 'white',
    fontWeight: '600',
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
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#5771f9',
    padding: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  refreshText: {
    color: '#5771f9',
    textDecorationLine: 'underline',
  },
  listContent: {
    paddingBottom: 20,
  },
});