import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AdminCalendar from '../components/AdminCalendar';
import DropdownMenu from '../components/DropdownMenu';
import axios from 'axios';
import { API_URL } from '../config';

const HomeScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [stats, setStats] = useState({ totalDoctors: 0, totalPatients: 0, appointmentsToday: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProblems, setNewProblems] = useState(false); // Track if there are new problems

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/admin/stats`);
        setStats(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    const checkNewProblems = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/problems`, {
          params: { dateSortOrder: 'desc' },
        });

        if (response.headers['content-type']?.includes('application/json')) {
          console.log('Data reçu de /api/problems:', response.data);

          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

          const recentProblems = Array.isArray(response.data) 
            ? response.data.filter((problem) => new Date(problem.createdAt) > sevenDaysAgo) 
            : [];

          setNewProblems(recentProblems.length > 0);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des problèmes:', err);
      }
    };
    
    fetchStats();
    checkNewProblems();
  }, []);

  const handleNotificationPress = () => {
    // Navigate to the ProblemesScreen
    navigation.navigate('ProblemesScreen');
    setNewProblems(false); // Once clicked, mark new problems as seen
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>

        <Text style={styles.navTitle}>MedIX Admin</Text>

        <TouchableOpacity onPress={handleNotificationPress}>
          <View style={styles.notificationContainer}>
            <Ionicons name="notifications-outline" size={26} color="black" />
            {newProblems && <View style={styles.redDot} />}
          </View>
        </TouchableOpacity>
      </View>

      {/* Menu déroulant */}
      <DropdownMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />

      {/* Contenu principal */}
      <View style={styles.container}>
        {loading ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Ionicons name="hourglass-outline" size={32} color="gray" />
            <Text style={{ marginTop: 10, color: 'gray' }}>{t('loading')}...</Text>
          </View>
        ) : error ? (
          <Text>{error}</Text>
        ) : (
          <>
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{stats.totalDoctors}</Text>
                <Text>{t('doctors')}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{stats.totalPatients}</Text>
                <Text>{t('patients')}</Text>
              </View>
            </View>

            <View style={styles.appointments}>
              <Text style={styles.statNumber}>{stats.appointmentsToday}</Text>
              <Text>{t('appointments')}</Text>
            </View>
          </>
        )}

        {/* Calendrier */}
        <AdminCalendar />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationContainer: {
    position: 'relative',
  },
  redDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: '#e0f7fa',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    margin: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  appointments: {
    backgroundColor: '#ffecb3',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;
