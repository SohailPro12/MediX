import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Modal, StyleSheet, Button, TextInput, Platform, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AdminCalendar from '../components/AdminCalendar';
import DropdownMenu from '../components/DropdownMenu';

const HomeScreen = () => {
  const { t } = useTranslation();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Navbar */}
      <View style={styles.navbar}>
        {/* Bouton Menu */}
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>

        {/* Titre */}
        <Text style={styles.navTitle}>MedIX Admin</Text>

        {/* Notifications */}
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
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>45</Text>
            <Text>{t('doctors')}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>1,234</Text>
            <Text>{t('patients')}</Text>
          </View>
        </View>

        {/* Rendez-vous */}
        <View style={styles.appointments}>
          <Text style={styles.statNumber}>28</Text>
          <Text>{t('appointments')}</Text>
        </View>

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
  appointments: {
    backgroundColor: '#ffecb3',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;
