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
import { Ionicons, FontAwesome5, Entypo } from '@expo/vector-icons';
import { API_URL } from "../../config";
import { usePatient }  from '../context/PatientContext'; // Import du contexte

const StarRating = ({ rating, onChange, editable = true }) => {
  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity 
          key={star} 
          onPress={() => editable && onChange(star)}
          disabled={!editable}
        >
          <Entypo
            name={star <= rating ? "star" : "star-outlined"}
            size={24}
            color={star <= rating ? '#FFD700' : '#ccc'}
            style={styles.star}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function AllAppointmentsScreen({ navigation }) {
  // Récupération de l'ID patient depuis le contexte
  const { patient } = usePatient();
  console.log(patient._id)
  const patientId = patient?._id;

  // États
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [ratings, setRatings] = useState({});
  const [error, setError] = useState(null);

  // Chargement des données
  useEffect(() => {
    if (patientId) {
      loadAppointments();
    }
  }, [patientId]);

  const loadAppointments = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await fetch(`${API_URL}/api/patient/getAppointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId })
      });
      
      if (!response.ok) throw new Error('Erreur de chargement');
      
      const data = await response.json();
      setAppointments(data.data || data);
      
      // Initialiser les ratings
      const initialRatings = {};
      data.forEach(app => app.rating && (initialRatings[app._id] = app.rating));
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
    const now = new Date();
    const appDate = new Date(`${app.date}T${app.time}`);
    return selectedTab === 'completed' ? appDate < now : appDate >= now;
  });

  const renderAppointment = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.doctorInfo}>
        <Image 
          source={{ uri: item.doctor?.image || 'https://i.imgur.com/0LKZQYM.png' }} 
          style={styles.avatar} 
        />
        <View style={styles.doctorDetails}>
          <Text style={styles.doctorName}>Dr {item.doctor?.name || 'Nom inconnu'}</Text>
          <Text style={styles.specialty}>{item.doctor?.specialty || 'Spécialité inconnue'}</Text>
        </View>
      </View>

      {selectedTab === 'completed' ? (
        <>
          <StarRating 
            rating={ratings[item._id] || 0} 
            onChange={(rating) => handleRateAppointment(item._id, rating)}
          />
          <Text style={styles.ratingText}>
            {ratings[item._id] ? `Noté ${ratings[item._id]}/5` : "Non noté"}
          </Text>
        </>
      ) : (
        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <FontAwesome5 name="calendar-alt" size={16} color="#5771f9" />
            <Text style={styles.detailText}>
              {new Date(item.date).toLocaleDateString('fr-FR')}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color="#5771f9" />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5771f9" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
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
        keyExtractor={(item) => item._id}
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
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 10,
    backgroundColor: '#E0E4FF',
  },
  activeTab: {
    backgroundColor: '#5771f9',
  },
  tabText: {
    color: '#5771f9',
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#E0E4FF',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  doctorName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
    color: '#333',
  },
  specialty: {
    color: '#666',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginHorizontal: 3,
  },
  infoText: {
    marginLeft: 6,
    color: '#666',
    fontSize: 14,
  },
  ratingRow: {
    flexDirection: 'row',
    marginBottom: 0,
    marginHorizontal:'35%'
  },
  ratingText: {
    marginLeft: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent:'flex-end'
  },
  reviewButton: {
    backgroundColor: '#5771f9',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    width:100,
  },
  reviewText: {
    color: 'white',
    fontWeight: '600',
    textAlign:'center'
  },
});