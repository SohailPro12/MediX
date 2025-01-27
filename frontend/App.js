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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});

export default App;
