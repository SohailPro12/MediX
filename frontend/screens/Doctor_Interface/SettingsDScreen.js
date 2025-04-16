import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, Button } from 'react-native-paper';
import Header from '../../components/DoctorComponents/Header';


const SettingsDScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Header name='Settings'screen='DashboardDoctor'/>
      <View style={styles.profileContainer}>
        <View style={{position:'relative'}}>
          <Avatar.Image size={120} source={require('../../assets/doctor.png')} />
          <TouchableOpacity style={styles.editIcon} onPress={()=>navigation.navigate("EditDoctorProfile")}>
          <Ionicons name="create" size={20} color="white" />
        </TouchableOpacity>
        </View>
        
        <Text style={styles.name}>Médecin’sName</Text>
        <Text style={styles.email}>médecin’sEmail@</Text>
        
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <Ionicons 
              key={index} 
              name={index < 4 ? "star" : "star-outline"} 
              size={20} 
              color="#75E1E5" 
            />
          ))}
        </View>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={()=>navigation.navigate("PatientList")}>
          <Text>Liste de mes patients</Text>
          <Ionicons name="chevron-forward" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={()=>navigation.navigate("AjouterPa")}>
          <Text>Ajouter un patient</Text>
          <Ionicons name="chevron-forward" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={()=>navigation.navigate("ReportScreen")}>
          <Text>Signaler un problème</Text>
          <Ionicons name="chevron-forward" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding:'6%',
    paddingVertical:'12%',
  },

  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#75E1E5',
    borderRadius: 10,
    padding: 5,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    fontSize: 14,
    color: 'gray',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  menu: {
    width: '97%',
    alignSelf:'center',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default SettingsDScreen;