import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import '../i18n';
import AdminCalendar from '../components/AdminCalendar';
import Supprimercompte from '../components/Supprimercompte';

const HomeScreen = () => {
  const { t, i18n } = useTranslation();
  const [menuVisible, setMenuVisible] = useState(false);

  // Switch language function
  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setMenuVisible(false); // Close menu after selection
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Navbar */}
      <View style={styles.navbar}>
        {/* Menu Button */}
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.navTitle}>MedX Adminhoo</Text>

        {/* Notifications */}
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={26} color="black" />
        </TouchableOpacity>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownMenu}>
              {/* Language Options */}
              <TouchableOpacity onPress={() => switchLanguage('en')} style={styles.menuItem}>
                <Text style={styles.menuText}>🇬🇧 English</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => switchLanguage('fr')} style={styles.menuItem}>
                <Text style={styles.menuText}>🇫🇷 Français</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => switchLanguage('ar')} style={styles.menuItem}>
                <Text style={styles.menuText}>🇸🇦 العربية</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider} />


              
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Main Content */}
      <View style={styles.container}>
        {/* Search Bar */}
        <TextInput style={styles.searchBar} placeholder={t('search')} />

        {/* Stats */}
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

        {/* Appointments */}
        <View style={styles.appointments}>
          <Text style={styles.statNumber}>28</Text>
          <Text>{t('appointments')}</Text>
        </View>

        {/* Calendar */}
        <AdminCalendar />
        <Supprimercompte/>
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
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  calendar: {
    marginTop: 10,
    borderRadius: 10,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
});

export default HomeScreen;