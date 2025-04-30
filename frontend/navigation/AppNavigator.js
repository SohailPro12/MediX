import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

import Messagerie from "../screens/Patient_Interface/Messagerie";
import Chat from "../screens/Patient_Interface/Chat";
import DashboardPatient from "../screens/Patient_Interface/DashboardPatient"
import PrendreRdv from "../screens/Patient_Interface/PrendreRdv";
import SearchDoctor from "../screens/Patient_Interface/SearchDoctor";

import MyDoctorList from "../screens/Patient_Interface/MyDoctorList";
import DoctorInfo from "../screens/Patient_Interface/DoctorInfo";
import AllAppointmentsScreen from "../screens/Patient_Interface/AllAppointmentsScreen";
import PatientProfile from "../screens/Patient_Interface/PatientProfile";
import MonDossierMedical from "../screens/Patient_Interface/MonDossierMedical";
import ChangePassword from "../screens/Patient_Interface/ChangePassword"; 
/*



 */

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <I18nextProvider i18n={i18n}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DashboardPatient" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Messagerie" component={Messagerie} />
                    <Stack.Screen name="Chat" component={Chat} />
                    <Stack.Screen name="DashboardPatient" component={DashboardPatient} />
                    <Stack.Screen name="PrendreRdv" component={PrendreRdv} />
                    <Stack.Screen name="SearchDoctor" component={SearchDoctor} />
                    <Stack.Screen name="DoctorInfo" component={DoctorInfo} />
                    <Stack.Screen name="MyDoctorList" component={MyDoctorList} />
                    <Stack.Screen name="AllAppointmentsScreen" component={AllAppointmentsScreen} />
                    <Stack.Screen name="PatientProfile" component={PatientProfile} />
                    <Stack.Screen name="MonDossierMedical" component={MonDossierMedical} />
                    <Stack.Screen name="ChangePassword" component={ChangePassword} />
                
      </Stack.Navigator>
    </NavigationContainer>
    </I18nextProvider>
  );
}
