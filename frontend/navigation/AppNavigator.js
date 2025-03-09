import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from '../screens/LoginFront/LoginScreen';
import ForgotScreen from '../screens/LoginFront/ForgotScreen';
import CodeScreen from '../screens/LoginFront/CodeScreen';
import ResetScreen from "../screens/LoginFront/ResetScreen";
import HomeScreen from '../screens/HomeScreen'; 
import AdminGeneralScreen from '../screens/AdminGeneralScreen';
import ProblemesScreen from "../screens/ProblemScreen";
import ProblemDetailsScreen from "../screens/ProblemDetailScreen";
import AddDoctor from "../screens/AddDoctor";
import DoctorList from "../screens/DoctorList";
import DoctorProfile from "../screens/DoctorProfile";
import i18n from "../i18n";
import { I18nextProvider } from 'react-i18next';


const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <I18nextProvider i18n={i18n}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ForgotScreen" component={ForgotScreen} />
        <Stack.Screen name="CodeScreen" component={CodeScreen} />
        <Stack.Screen name="ResetScreen" component={ResetScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="AdminGeneralScreen" component={AdminGeneralScreen} />
        <Stack.Screen name="ProblemesScreen" component={ProblemesScreen} />
        <Stack.Screen name="ProblemDetailsScreen" component={ProblemDetailsScreen} />
        <Stack.Screen name="AddDoctor" component={AddDoctor} />
        <Stack.Screen name="DoctorList" component={DoctorList} />
        <Stack.Screen name="DoctorProfile" component={DoctorProfile} />
      </Stack.Navigator>
    </NavigationContainer>
    </I18nextProvider>
  );
}