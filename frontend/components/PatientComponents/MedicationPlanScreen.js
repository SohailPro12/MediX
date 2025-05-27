import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, ActivityIndicator, Platform
} from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const WEEKDAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export default function MedicationPlanScreen() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const res = await fetch(`${API_URL}/api/medications/plan`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
       setMedications(data);

      } catch (e) {
        console.error(e);
        Alert.alert("Erreur", "Impossible de charger les traitements");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#75E1E5" />;
  if (!medications.length) return <Text style={styles.center}>Aucun traitement trouvé.</Text>;

  return (
    <ScrollView style={styles.container}>
      {WEEKDAYS.map((day, idx) => {
        const meds = medications.filter(m => m.weekDays.includes(idx));
        if (!meds.length) return null;
        return (
          <View key={idx}>
            <Text style={styles.dayTitle}>{day}</Text>
            {meds.map(med => <MedicationItem key={med.id + idx} item={med} />)}
          </View>
        );
      })}
    </ScrollView>
  );
}

function MedicationItem({ item }) {
  const { id, icon, name, dosage, duration, hour, minute, period } = item;
  const [taken, setTaken] = useState(false);
  const [alarm, setAlarm] = useState(false);

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem(`taken_${id}`);
      const a = await AsyncStorage.getItem(`alarm_${id}`);
      setTaken(t === '1');
      setAlarm(a === '1');
    })();
  }, []);

  const markTaken = async () => {
    setTaken(true);
    await AsyncStorage.setItem(`taken_${id}`, '1');
  };

  const schedule = async () => {
    if (alarm) return;
    const permit = await Notifications.requestPermissionsAsync();
    if (permit.status !== 'granted') {
      return Alert.alert('Permissions refusées', 'Impossible de planifier.');
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `💊 ${name}`,
        body: `Dosage : ${dosage} (${period})`,
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });
    setAlarm(true);
    await AsyncStorage.setItem(`alarm_${id}`, '1');
    Alert.alert('Rappel activé', `Chaque jour à ${hour}h${minute < 10 ? '0' : ''}${minute}`);
  };

  return (
    <View style={styles.medItem}>
      <Text style={styles.medIcon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.medName}>{name} - {period}</Text>
        <Text style={styles.medDesc}>{dosage}</Text>
        <Text style={styles.medDuration}>{duration}</Text>
      </View>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: taken ? '#9CA3AF' : '#10B981' }]}
        onPress={markTaken}
        disabled={taken}
      >
        <Text style={styles.btnText}>{taken ? 'Pris' : 'Prendre'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: alarm ? '#6B7280' : '#3B82F6' }]}
        onPress={schedule}
        disabled={alarm}
      >
        <Text style={styles.btnText}>{alarm ? 'Rappel OK' : 'Rappeler'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    padding: 20
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 10
  },
  medItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 3 }
    })
  },
  medIcon: {
    fontSize: 24,
    marginRight: 10
  },
  medName: {
    fontSize: 15,
    fontWeight: '600'
  },
  medDesc: {
    fontSize: 12,
    color: '#6B7280'
  },
  medDuration: {
    fontSize: 12,
    color: '#9CA3AF'
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8
  },
  btnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  center: {
    flex: 1,
    textAlign: 'center',
    marginTop: 50,
    color: '#666'
  }
});
