import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Avatar, Divider } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';



export default function DoctorInfo({navigation}) {
  const route = useRoute();
  const passedDoctor = route.params?.doctor;
  //console.log(passedDoctor);doctor
  return(
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.navigate("MyDoctorList")}>
          <Ionicons name="chevron-back" size={28} color="#5771f9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Doctor Info</Text>
        <View style={{ width: 30 }} />
     </View>
     <View style={{flex:1}}>
      <Card style={styles.card} >
        <Card.Content>
          <View style={styles.profileHeader}>
            <Avatar.Image size={100} source={passedDoctor.image} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.name}>{passedDoctor.name}</Text>
              <Text style={styles.specialty}>{passedDoctor.specialty}</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.details}>
            <Text style={styles.sectionTitle}>À propos</Text>
            <Text style={styles.aboutText}>{passedDoctor.about}</Text>

            <Text style={styles.sectionTitle}>Formation</Text>
            <Text style={styles.aboutText}>{passedDoctor.formation}</Text>


            <Text style={styles.sectionTitle}>Expérience</Text>
            <Text style={styles.aboutText}>{passedDoctor.experience}</Text>
          </View>
        </Card.Content>
      </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5FF',
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
    backgroundColor:'#E0E4FF',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  specialty: {
    fontSize: 16,
    color: '#777',
  },
  divider: {
    marginVertical: 16,
    color:'red',
  },
  details: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },

})