
import React from 'react';
import DashboardPatient from "./screens/Patient_Interface/DashboardPatient";
import { NavigationContainer } from '@react-navigation/native';
import SearchDoctor from './screens/Patient_Interface/SearchDoctor';
import PrendreRdv from './screens/Patient_Interface/PrendreRdv';
import Messagerie from './screens/Patient_Interface/Messagerie';
import Chat from './screens/Patient_Interface/Messagerie'
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return(
    <AppNavigator/>
  );
};

export default App;

