import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const MedicationPlanScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.dayTitle}>Lundi</Text>

      {/* Médicaments */}
      <Text style={styles.timeLabel}>8:00</Text>
      <MedicationItem
        icon="💊"
        name="Omega 3"
        description="1 comprimé après les repas"
        duration="7 jours"
        hour={12}
        minute={0}
      />

      <Text style={styles.timeLabel}>14:00</Text>
      <MedicationItem
        icon="💉"
        name="5-HTP"
        description="1 ampoule"
        duration="2 jours"
        hour={14}
        minute={0}
      />
      <MedicationItem
  icon="🩸"
  name="Aspirine"
  description="1 comprimé en cas de douleur"
  duration="7 jours"
  hour={16}
  minute={0}
/>

    </ScrollView>
  );
};

//Composant pour les medicaments
const MedicationItem = ({ icon, name, description, duration, sideEffects, hour, minute }) => {
  const [taken, setTaken] = useState(false);
  const [alarmSet, setAlarmSet] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissions refusées', 'Impossible de programmer des notifications.');
    }
  };

  const handleTakeMedication = () => {
    setTaken(true);
  };

// cette fonction pour planifier alarme
  const scheduleAlarm = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Prends ton médicament 💊`,
        body: `N'oublie pas de prendre : ${name}`,
        sound: true,
      },
      trigger: {
        hour: hour,
        minute: minute,
        repeats: true, // Chaque jour
      },
    });
    setAlarmSet(true);
    Alert.alert('Alarme programmée', `Rappel activé pour ${name} à ${hour}h${minute < 10 ? '0' : ''}${minute}`);
  };

  return (
    <View style={styles.medItem}>
      <Text style={styles.medIcon}>{icon}</Text>

      <View style={{ flex: 1 }}>
        <Text style={styles.medName}>{name}</Text>
        <Text style={styles.medDesc}>{description}</Text>
        <Text style={styles.medDuration}>{duration}</Text>
      </View>

      {/* Boutons */}
  
      <TouchableOpacity
        onPress={handleTakeMedication}
        disabled={taken}
        style={[
          styles.button,
          { backgroundColor: taken ? '#9CA3AF' : '#10B981', marginLeft: 5 },
        ]}
      >
        <Text style={styles.buttonText}>{taken ? 'Pris' : 'Prendre'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={scheduleAlarm}
        disabled={alarmSet}
        style={[
          styles.button,
          { backgroundColor: alarmSet ? '#6B7280' : '#3B82F6', marginLeft: 5 },
        ]}
      >
        <Text style={styles.buttonText}>{alarmSet ? 'Alarme OK' : 'Planifier'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  timeLabel: {
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#6B7280',
  },
  medItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#00000011',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  medIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  medName: {
    fontWeight: '600',
    fontSize: 15,
  },
  medDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
  medDuration: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MedicationPlanScreen;
