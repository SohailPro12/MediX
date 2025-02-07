import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import DoctorProfile from './screens/DoctorProfile.js';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <HomeScreen />
        <DoctorProfile />
      </View>
    </SafeAreaView>
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
