import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from '../screens/LoginFront/LoginScreen';
import ForgotScreen from '../screens/LoginFront/ForgotScreen';
import CodeScreen from '../screens/LoginFront/CodeScreen';
import ResetScreen from "../screens/LoginFront/ResetScreen";
import HomeScreen from '../screens/HomeScreen'; 
import CodeSSOScreen from "../screens/LoginFront/CodeSSOScreen";
import RoleScreen from "../screens/LoginFront/RoleScreen";
import LoginDoctorScreen from "../screens/LoginFront/LoginDoctorScreen";
import LoginAdminScreen from "../screens/LoginFront/LoginAdminScreen";
import LoginPatientScreen from "../screens/LoginFront/LoginPatientScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CodeSSOScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CodeSSOScreen" component={CodeSSOScreen} />
        <Stack.Screen name="LoginPatientScreen" component={LoginPatientScreen} />
        <Stack.Screen name="LoginDoctorScreen" component={LoginDoctorScreen} />
        <Stack.Screen name="LoginAdminScreen" component={LoginAdminScreen} />
        <Stack.Screen name="RoleScreen" component={RoleScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ForgotScreen" component={ForgotScreen} />
        <Stack.Screen name="CodeScreen" component={CodeScreen} />
        <Stack.Screen name="ResetScreen" component={ResetScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}