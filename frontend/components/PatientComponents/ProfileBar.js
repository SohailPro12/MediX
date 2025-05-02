import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
const ProfileBar = ({ username, profileImage, onLogout }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profileSection} onPress={()=>navigation.navigate("PatientProfile",{uname:username})}>
        <Image source={profileImage} style={styles.profileImage} />
        <Text style={styles.username}>{username}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <View style={styles.logoutContent}>
          <Ionicons name="arrow-forward-circle" size={28} color="#FF6347" />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 7,
    marginBottom: 14,
    marginLeft: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 0.7,
    borderBottomColor: '#ddd',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 5,
    borderRadius: 5,
    marginRight: 9,
  },
  logoutContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 12,
    color: '#FF6347',
    fontWeight: '500',
    marginTop: 2,
  },
});

export default ProfileBar;
