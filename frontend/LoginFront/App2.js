import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Test1 from './test1';
import Test3 from './test3';
import Test4 from './test4';
import Test5 from "./test5";

const Stack = createStackNavigator();

export default function App2() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Test1" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Test1" component={Test1} />
        <Stack.Screen name="Test3" component={Test3} />
        <Stack.Screen name="Test4" component={Test4} />
        <Stack.Screen name="Test5" component={Test5} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}