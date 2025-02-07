import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from './screens/LoginFront/LoginScreen';
import ForgotScreen from './screens/LoginFront/ForgotScreen';
import CodeScreen from './screens/LoginFront/CodeScreen';
import ResetScreen from "./screens/LoginFront/ResetScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ForgotScreen" component={ForgotScreen} />
        <Stack.Screen name="CodeScreen" component={CodeScreen} />
        <Stack.Screen name="Resetscreen" component={ResetScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}