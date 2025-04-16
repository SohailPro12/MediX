import React, { useState } from 'react';
import { View, Text, TextInput, Button,StyleSheet, TouchableOpacity,KeyboardAvoidingView,ScrollView,Platform,TouchableWithoutFeedback,Keyboard } from 'react-native';
import { Divider, Card, Avatar } from 'react-native-paper';

// Assure-toi que tu importes tes styles
import Header from '../../components/DoctorComponents/Header';
import doctorImage from '../../assets/doctor.png'; 


const EditDoctorProfile= () => {
  // Variables d'état pour les champs modifiables
  const [about, setAbout] = useState('Dr. Jean Dupont est un cardiologue expérimenté avec plus de 15 ans d\'expérience...');
  const [formation, setFormation] = useState('- Doctorat en Médecine, Université de Paris\n- Spécialisation en Cardiologie, Hôpital Européen Georges-Pompidou');
  const [experience, setExperience] = useState('- 5 ans en tant que cardiologue à l\'Hôpital Saint-Louis\n- 10 ans d\'expérience en recherche sur les maladies cardiovasculaires');

  const [isEditing, setIsEditing] = useState(false); // Gérer si l'on est en mode édition ou non

  const handleSave = () => {
    // Ici tu peux envoyer les données au backend si nécessaire
    setIsEditing(false); // Désactiver le mode édition après sauvegarde
  };

  return (
    <View style={styles.container}>
      <Header name="Votre Profi" screen='SettingsDScreen'/>
      <Card style={styles.cardF}>
        <Card.Content>
          <View style={styles.profileHeader}>
              <Avatar.Image size={100} source={doctorImage} style={styles.avatar} />
              <View style={styles.info}>
                  <Text style={styles.name}>Dr. Jean Dupont</Text>
                  <Text style={styles.specialty}>Spécialiste en Cardiologie</Text>
                  <TouchableOpacity
                      style={styles.saveChanges}
                      onPress={isEditing ? handleSave : () => setIsEditing(true)}>
                      <Text style={styles.textChanges}>{isEditing ? "Enregistrer" : "Modifier"} </Text>
                  </TouchableOpacity>
              </View>
          </View>      
          {/* <Divider style={styles.divider} /> */}
        </Card.Content>
      </Card>
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Card style={styles.card}>
              <Card.Content>
                <ScrollView  contentContainerStyle={styles.scrollInnerCard}>
                  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={styles.details}>
                        <Text style={styles.sectionTitle}>À propos</Text>
                        {isEditing ? (
                            <TextInput
                            multiline
                            value={about}
                            onChangeText={setAbout}
                            style={styles.textInput}
                            />
                        ) : (
                            <Text style={styles.aboutText}>{about}</Text>
                        )}

                        <Text style={styles.sectionTitle}>Formation</Text>
                        {isEditing ? (
                            <TextInput
                            multiline
                            value={formation}
                            onChangeText={setFormation}
                            style={styles.textInput}
                            />
                        ) : (
                            <Text style={styles.aboutText}>{formation}</Text>
                        )}

                        <Text style={styles.sectionTitle}>Expérience</Text>
                        {isEditing ? (
                            <TextInput
                            multiline
                            value={experience}
                            onChangeText={setExperience}
                            style={styles.textInput}
                            />
                        ) : (
                            <Text style={styles.aboutText}>{experience}</Text>
                        )}
                    </View>
                  </TouchableWithoutFeedback>
                </ScrollView>
              </Card.Content>
            </Card>
    </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: '6%',
    paddingVertical:'12%',
  },
  cardF:{
    borderBottomRightRadius:0,
    borderBottomLeftRadius:0,
  },
  card: {
    //borderRadius: 8,
    borderTopRightRadius:0,
    borderTopLeftRadius:0,
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
  },
  details: {
    padding: 8,
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
    marginBottom:16
  },
  saveChanges:{
    backgroundColor:'#75E1E5',
    marginTop:5,
    borderRadius:20,
    alignItems:'center',
    justifyContent:'center',
    width:100,
    height:25,
    elevation: 8,
    shadowColor: '#75E1E5',
    shadowOpacity:0.9,
    shadowRadius: 3,
  },
  textChanges:{
    color:'white',
    fontSize:16,
    
  },
  scrollInnerCard: {
    paddingBottom: 0,
  },
  textInput: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
  },
  
});

export default EditDoctorProfile;