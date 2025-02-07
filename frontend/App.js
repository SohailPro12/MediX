<<<<<<< HEAD
import React from 'react';
import { View, StyleSheet } from 'react-native';
import AdminCalendar from './components/AdminCalendar';
import DeleteAccountButton from './components/Supprimercompte';

const App = () => {
  return (
    <View style={styles.container}>
      <AdminCalendar />
      <DeleteAccountButton />
    </View>
=======

import {SafeAreaView } from 'react-native';
import DoctorProfile from './screens/DoctorProfile.js';
export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <DoctorProfile />
  </SafeAreaView>
>>>>>>> 5cf795f985e8d3429c8d471a3c630314919d53c6
  );
};

<<<<<<< HEAD
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});

export default App;
=======

>>>>>>> 5cf795f985e8d3429c8d471a3c630314919d53c6
