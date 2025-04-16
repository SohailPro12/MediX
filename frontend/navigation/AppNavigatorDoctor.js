import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
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
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DashboardDoctor" screenOptions={{ headerShown: false }}>
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
  );
}
