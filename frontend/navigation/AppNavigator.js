import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from '../screens/LoginFront/LoginScreen';
import ForgotScreen from '../screens/LoginFront/ForgotScreen';
import ResetScreen from "../screens/LoginFront/ResetScreen";
import HomeScreen from '../screens/HomeScreen'; 
import CodeSSOScreen from "../screens/LoginFront/CodeSSOScreen";
import RoleScreen from "../screens/LoginFront/RoleScreen";
import LoginDoctorScreen from "../screens/LoginFront/LoginDoctorScreen";
import LoginAdminScreen from "../screens/LoginFront/LoginAdminScreen";
import LoginPatientScreen from "../screens/LoginFront/LoginPatientScreen";
import { NavigationContainer } from '@react-navigation/native';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import AdminGeneralScreen from "../screens/AdminGeneralScreen";
import ProblemesScreen from "../screens/ProblemScreen";
import ProblemDetailsScreen from "../screens/ProblemDetailScreen";
import AddDoctor from "../screens/AddDoctor";
import DoctorList from "../screens/DoctorList";
import DoctorProfile from "../screens/DoctorProfile";

      {/*Doctor Imports*/}
      
import Chat from "../screens/Doctor_Interface/Chat";
import NextRdv from "../screens/Doctor_Interface/NextRdv";
import AppointmentsList from "../screens/Doctor_Interface/AppointmentsList";
import PatientSuivi from "../screens/Doctor_Interface/PatientSuivi";
import Messagerie from "../screens/Doctor_Interface/Messagerie";
import AppointmentCalendar from "../screens/Doctor_Interface/AppointmentCalendar";
import DashboardDoctor from "../screens/Doctor_Interface/DashboardDoctor";
import AjouterPa from "../screens/Doctor_Interface/AjouterPa";
import SettingsDScreen from "../screens/Doctor_Interface/SettingsDScreen";
import DossiersM from "../screens/Doctor_Interface/DossiersM";
import PatientList from "../screens/Doctor_Interface/PatientList";
import PrescriptionScreen from "../screens/Doctor_Interface/PrescriptionScreen";
import ReportScreen from "../screens/Doctor_Interface/ReportScreen";
import EditDoctorProfile from "../screens/Doctor_Interface/EditDoctorProfile";
import Ordonnance from "../screens/Doctor_Interface/Ordonnance";




const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <I18nextProvider i18n={i18n}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CodeSSOScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CodeSSOScreen" component={CodeSSOScreen} />
        <Stack.Screen name="LoginPatientScreen" component={LoginPatientScreen} />
        <Stack.Screen name="LoginDoctorScreen" component={LoginDoctorScreen} />
        <Stack.Screen name="LoginAdminScreen" component={LoginAdminScreen} />
        <Stack.Screen name="RoleScreen" component={RoleScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ForgotScreen" component={ForgotScreen} />
        <Stack.Screen name="ResetScreen" component={ResetScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="AdminGeneralScreen" component={AdminGeneralScreen} />
        <Stack.Screen name="ProblemesScreen" component={ProblemesScreen} />
        <Stack.Screen name="ProblemDetailsScreen" component={ProblemDetailsScreen} />
        <Stack.Screen name="AddDoctor" component={AddDoctor} />
        <Stack.Screen name="DoctorList" component={DoctorList} />
        <Stack.Screen name="DoctorProfile" component={DoctorProfile} />


                  {/*Doctor Screen*/}
            <Stack.Screen name="DashboardDoctor" component={DashboardDoctor} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="NextRdv" component={NextRdv} />
                    <Stack.Screen name="AppointmentsList" component={AppointmentsList} />
                    <Stack.Screen name="PatientSuivi" component={PatientSuivi} />
                    <Stack.Screen name="Messagerie" component={Messagerie} />
                    <Stack.Screen name="AppointmentCalendar" component={AppointmentCalendar} />
                    <Stack.Screen name="AjouterPa" component={AjouterPa}/>
                    <Stack.Screen name="DossiersM" component={DossiersM}/>
                    <Stack.Screen name="PatientList" component={PatientList}/>
                    <Stack.Screen name="PrescriptionScreen" component={PrescriptionScreen}/>
                    <Stack.Screen name="ReportScreen" component={ReportScreen}/>
                    <Stack.Screen name='EditDoctorProfile' component={EditDoctorProfile}/>
                    <Stack.Screen name='SettingsDScreen' component={SettingsDScreen}/>
                    <Stack.Screen name='Ordonnance' component={Ordonnance}/>
      </Stack.Navigator>
    </NavigationContainer>
    </I18nextProvider>
  );
}
