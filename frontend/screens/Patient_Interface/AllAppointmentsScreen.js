import React, { useState, useEffect } from 'react';
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
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { API_URL } from "../../config";
import { usePatient } from '../context/PatientContext';

const StarRating = ({ rating, onChange, editable = true }) => {
  return (
    <View style={styles.starRatingContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity 
          key={star} 
          onPress={() => editable && onChange(star)}
          disabled={!editable}
          style={styles.starButton}
        >
          <Ionicons
            name={star <= rating ? "star" : "star-outline"}
            size={24}
            color={star <= rating ? '#FFD700' : '#ccc'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function AllAppointmentsScreen({ navigation }) {
  const { patient } = usePatient();
  const patientId = patient?._id;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [ratings, setRatings] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (patientId) loadAppointments();
  }, [patientId]);

  const loadAppointments = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await fetch(`${API_URL}/api/patient/getAppointments/${patientId}`);
      
      if (!response.ok) throw new Error('Erreur de chargement des rendez-vous');
      
      const data = await response.json();
      

      const formattedData = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
      setAppointments(formattedData);
      
      // Initialisation des ratings
      const initialRatings = {};
      formattedData.forEach(app => {
        if (app.rating) initialRatings[app.id] = app.rating;
      });
      setRatings(initialRatings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadAppointments();
  };

  const handleRateAppointment = async (id, rating) => {
    try {
      await fetch(`${API_URL}/api/patient/rateAppointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: id, rating })
      });
      setRatings(prev => ({ ...prev, [id]: rating }));
    } catch (err) {
      setError("Échec de la notation");
    }
  };

 
const filteredAppointments = appointments.filter(app => {
 if (!app.date || !app.time) return false;
  const [day, month, year] = app.date.split('/');
  const isoFormattedDate = `${year}-${month}-${day}`;
  const appDate = new Date(`${isoFormattedDate}T${app.time}:00`);

  const now = new Date();
  if (selectedTab === 'completed') {
    return appDate < now && app.status === 'confirmed';
  } else {
    return appDate >= now;
  }
});

const renderAppointment = ({ item }) => {
  const isCompleted = selectedTab === 'completed';

  return (
    <View style={styles.card}>
      <View style={styles.doctorInfo}>
        <Image 
          source={item.Image 
            ? { uri: item.Image } 
            : require('../../assets/image.png')
}          style={styles.avatar} 
        />
        <View style={styles.doctorDetails}>
          <Text style={styles.doctorName}>{item.name || 'Nom inconnu'}</Text>
          <Text style={styles.specialty}>{item.specialty || 'Spécialité inconnue'}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="document-text-outline" size={14} color="#64748b" />
            <Text style={styles.infoText}>{item.motif || 'Motif non spécifié'}</Text>
          </View>
          
          {item.description && (
            <View style={styles.infoRow}>
              <Ionicons name="information-circle-outline" size={14} color="#64748b" />
              <Text style={styles.infoText}>{item.description}</Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={14} color="#64748b" />
            <Text style={styles.infoText}>{item.lieu || 'Lieu non spécifié'}</Text>
          </View>
          {!isCompleted && (
              <Text style={styles.statusText}>
              Statut: {item.status === 'confirmed' ? 'Confirmé' : 'En attente'}
            </Text>
          )}

          <View style={styles.appointmentDetails}>
            <View style={styles.detailRow}>
              <FontAwesome5 name="calendar-alt" size={16} color="#5771f9" />
              <Text style={styles.detailText}>{item.date || 'Date non spécifiée'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={16} color="#5771f9" />
              <Text style={styles.detailText}>{item.time || 'Heure non spécifiée'}</Text>
            </View>
          </View>
        </View>
      </View>

      {isCompleted && (
        <View style={styles.ratingContainer}>
          <StarRating 
            rating={ratings[item.id] || 0} 
            onChange={(rating) => handleRateAppointment(item.id, rating)}
          />
          <Text style={styles.ratingText}>
            {ratings[item.id] ? `Noté ${ratings[item.id]}/5` : "Non noté"}
          </Text>
        </View>
      )}
    </View>
  );
};

if (loading) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#5771f9" />
      <Text style={styles.loadingText}>Chargement des rendez-vous...</Text>
    </View>
  );
}

if (error) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity 
        style={styles.retryButton} 
        onPress={loadAppointments}
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
      <Text style={styles.headerTitle}>Mes Rendez-vous</Text>
      <View style={{ width: 28 }} />
    </View>

    <View style={styles.tabs}>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'upcoming' && styles.activeTab]}
        onPress={() => setSelectedTab('upcoming')}
      >
        <Text style={[styles.tabText, selectedTab === 'upcoming' && styles.activeTabText]}>
          À venir
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'completed' && styles.activeTab]}
        onPress={() => setSelectedTab('completed')}
      >
        <Text style={[styles.tabText, selectedTab === 'completed' && styles.activeTabText]}>
          Passés
        </Text>
      </TouchableOpacity>
    </View>

    <FlatList
      data={filteredAppointments}
      keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
      renderItem={renderAppointment}
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
          <Text style={styles.emptyText}>
            {selectedTab === 'completed' 
              ? "Aucun rendez-vous passé" 
              : "Aucun rendez-vous à venir"}
          </Text>
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
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#E0E4FF',
    borderRadius: 10,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#5771f9',
  },
  tabText: {
    color: '#5771f9',
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  doctorInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#e0e7ff',
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#64748b',
    flexShrink: 1,
  },
  appointmentDetails: {
    marginTop: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#475569',
  },
   starRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  starButton: {
    marginHorizontal: 2, 
    padding: 2, 
  },
  ratingText: {
    marginTop: 4,
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
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
    paddingVertical: 12,
    paddingHorizontal: 24,
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
    padding: 20,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  statusText: {
     fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  }
});
