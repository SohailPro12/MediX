import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";

export default PatientNavBar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const getIconName = (page, iconName) => {
    return route.name === page ? iconName : `${iconName}-outline`;
  };

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => navigation.navigate('DashboardPatient')}>
        <Ionicons
          name={getIconName('DashboardPatient', 'home')}
          size={28}
          color="#5771f9"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Messagerie')}>
        <Ionicons
          name={getIconName('Messagerie', 'chatbubble')}
          size={28}
          color="#5771f9"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SearchDoctor')}>
        <Ionicons
          name={getIconName('SearchDoctor', 'search')}
          size={28}
          color="#5771f9"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('PatientProfile')}>
        <Ionicons
          name={getIconName('PatientProfile', 'person')}
          size={28}
          color="#5771f9"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'relative',
    height: 60,
    backgroundColor: '#E0E4FF',
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
});