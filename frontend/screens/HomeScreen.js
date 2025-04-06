import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Modal, StyleSheet, Button, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AdminCalendar from '../components/AdminCalendar';
import DropdownMenu from '../components/DropdownMenu';
import axios from 'axios';

const HomeScreen = () => {
  const { t } = useTranslation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [stats, setStats] = useState({ totalDoctors: 0, totalPatients: 0, appointmentsToday: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('https://cf0f-160-179-44-156.ngrok-free.app/admin/stats'); 
        setStats(response.data);
        console.log(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>

        <Text style={styles.navTitle}>MedIX Admin</Text>

        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={26} color="black" />
        </TouchableOpacity>
      </View>

      {/* Menu déroulant */}
      <DropdownMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />

      {/* Contenu principal */}
      <View style={styles.container}>
        {/* Barre de recherche */}
        <TextInput style={styles.searchBar} placeholder={t('search')} />

        {/* Statistiques */}
        {loading ? (
          <Text>Chargement...</Text>
        ) : error ? (
          <Text>{error}</Text>
        ) : (
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.totalDoctors}</Text>
              <Text>{t('doctors')}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.totalPatients}</Text>
              <Text>{t('patients')}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.appointmentsToday}</Text>
              <Text>{t('appointments')}</Text>
            </View>
          </View>
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
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  searchBar: {
    height: 40,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
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
});

export default HomeScreen;
