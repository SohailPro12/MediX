import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

//import { useNavigation } from '@react-navigation/native';


const Doctors = [
  {
    id: '1',
    name: 'Dr. Olivia Turner, M.D.',
    specialty: 'Dermato-Endocrinology',
    //LastVist: '2025-04-12',
    image: require('../../assets/doctor.jpg'),
    about:"Dr. Olivia Turner, M.D est un cardiologue expérimenté avec plus de 15 ans d\'expérience...",
    formation:"- Doctorat en Médecine, Université de Paris\n- Spécialisation en Cardiologie, Hôpital Européen Georges-Pompidou",
    experience:"- 5 ans en tant que cardiologue à l\'Hôpital Saint-Louis\n- 10 ans d\'expérience en recherche sur les maladies cardiovasculaires",
  },
  {
    id: '2',
    name: 'Dr. Alexander Bennett, Ph.D.',
    specialty: 'Dermato-Genetics',
    //LastVist: '2025-06-20',
    image: require('../../assets/doctor.jpg'),
    about:"Dr. Alexander Bennett, Ph.D est un cardiologue expérimenté avec plus de 15 ans d\'expérience...",
    formation:"- Doctorat en Médecine, Université de Paris\n- Spécialisation en Cardiologie, Hôpital Européen Georges-Pompidou",
    experience:"- 5 ans en tant que cardiologue à l\'Hôpital Saint-Louis\n- 10 ans d\'expérience en recherche sur les maladies cardiovasculaires",
  },
  {
    id: '3',
    name: 'Dr. Sophia Martinez, Ph.D.',
    specialty: 'Cosmetic Bioengineering',
    image: require('../../assets/doctor.jpg'),
    about:"Dr. Sophia Martinez, Ph.D est un cardiologue expérimenté avec plus de 15 ans d\'expérience...",
    formation:"- Doctorat en Médecine, Université de Paris\n- Spécialisation en Cardiologie, Hôpital Européen Georges-Pompidou",
    experience:"- 5 ans en tant que cardiologue à l\'Hôpital Saint-Louis\n- 10 ans d\'expérience en recherche sur les maladies cardiovasculaires",
  },
];

export default function MyDoctorsList({navigation}) {
  //const navigation=useNavigation();
  
  const renderDoctors=({item})=>{
    const doctor=item;
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={item.image} style={styles.avatar} />
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={styles.doctorName}>{item.name}</Text>
                <Text style={styles.specialty}>{item.specialty}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.infobutton}>
            <Text style={styles.infoText} onPress={()=>navigation.navigate("DoctorInfo",{doctor})}>Info</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return(
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={()=> navigation.navigate("DashboardPatient")}>
          <Ionicons name="chevron-back" size={28} color="#5771f9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Doctors</Text>
        <View style={{ width: 30 }} />
     </View>
    <FlatList
      data={Doctors}
      keyExtractor={(item) => item.id}
      renderItem={renderDoctors}
      contentContainerStyle={{ paddingBottom: 100 }}
    />
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#E0E4FF',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  doctorName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
    color: '#333',
  },
  specialty: {
    color: '#666',
    marginBottom: 8,
  },
  infobutton:{
    backgroundColor: '#5771f9',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    width:100,
    justifyContent:'center',
    alignSelf:'center'
  },
  infoText:{
    fontWeight: '600',
    textAlign:'center',
    color:'white',
  },

})