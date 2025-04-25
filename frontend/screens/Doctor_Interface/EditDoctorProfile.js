import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator
} from 'react-native';
import { Divider, Card, Avatar } from 'react-native-paper';
import { useMedecin } from '../context/MedecinContext';
import Header from '../../components/DoctorComponents/Header';
import { API_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditDoctorProfile = () => {
  const { medecin, setMedecin } = useMedecin();

  const [about, setAbout] = useState('');
  const [formation, setFormation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (medecin) {
      setAbout(medecin.description || '');
      setFormation(medecin.formation || []);
      setExperience(medecin.experience || []);
    }
  }, [medecin]);

  const reloadDoctorProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Aucun token trouvé');

      const response = await fetch(`${API_URL}/api/doctor/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      const data = await response.json();
      if (response.ok) {
        setMedecin(data);
        setAbout(data.description || '');
        setFormation(data.formation || []);
        setExperience(data.experience || []);
      } else {
        throw new Error(data.message || 'Erreur inconnue');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    const updatedDoctorData = {
      description: about,
      formation,
      experience
    };

    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/doctor/EditProfile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedDoctorData)
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      await reloadDoctorProfile();
      setIsEditing(false);
      alert('Profil mis à jour avec succès');
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      alert('Échec de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  if (!medecin || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#75E1E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header name="Votre Profil" screen='SettingsDScreen' />
      <Card style={styles.cardF}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <Avatar.Image
              size={100}
              source={medecin.Photo ? { uri: medecin.Photo } : require('../../assets/doctor.png')}
            />
            <View style={styles.info}>
              <Text style={styles.name}>Dr. {medecin.nom} {medecin.prenom}</Text>
              <Text style={styles.specialty}>Spécialiste en {medecin.specialite}</Text>
              <TouchableOpacity
                style={styles.saveChanges}
                onPress={isEditing ? handleSave : () => setIsEditing(true)}>
                <Text style={styles.textChanges}>{isEditing ? "Enregistrer" : "Modifier"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card.Content>
      </Card>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Card style={styles.card}>
          <Card.Content>
            <ScrollView contentContainerStyle={styles.scrollInnerCard}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                    <Text style={styles.aboutText}>{medecin.description}</Text>
                  )}

                  <Text style={styles.sectionTitle}>Formation</Text>
                  {isEditing ? (
                    <>
                      {formation.map((form, index) => (
                        <TextInput
                          key={index}
                          multiline
                          value={form}
                          onChangeText={(text) => {
                            const newForm = [...formation];
                            newForm[index] = text;
                            setFormation(newForm);
                          }}
                          style={styles.textInput}
                        />
                      ))}
                      <TouchableOpacity
                        onPress={() => setFormation([...formation, ''])}
                        style={[styles.saveChanges, { marginTop: 10, width: 150 }]}>
                        <Text style={styles.textChanges}>+ Ajouter une ligne</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    Array.isArray(medecin.formation) ? (
                      medecin.formation.map((form, index) => (
                        <Text key={index} style={styles.aboutText}>• {form}</Text>
                      ))
                    ) : (
                      <Text style={styles.aboutText}>{medecin.formation}</Text>
                    )
                  )}

                  <Text style={styles.sectionTitle}>Expérience</Text>
                  {isEditing ? (
                    <>
                      {experience.map((exp, index) => (
                        <TextInput
                          key={index}
                          multiline
                          value={exp}
                          onChangeText={(text) => {
                            const newExp = [...experience];
                            newExp[index] = text;
                            setExperience(newExp);
                          }}
                          style={styles.textInput}
                        />
                      ))}
                      <TouchableOpacity
                        onPress={() => setExperience([...experience, ''])}
                        style={[styles.saveChanges, { marginTop: 10, width: 150 }]}>
                        <Text style={styles.textChanges}>+ Ajouter une ligne</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    Array.isArray(medecin.experience) ? (
                      medecin.experience.map((exp, index) => (
                        <Text key={index} style={styles.aboutText}>• {exp}</Text>
                      ))
                    ) : (
                      <Text style={styles.aboutText}>{medecin.experience}</Text>
                    )
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
    paddingVertical: '12%',
  },
  cardF: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  card: {
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
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
    marginBottom: 16,
  },
  saveChanges: {
    backgroundColor: '#75E1E5',
    marginTop: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 25,
    elevation: 8,
    shadowColor: '#75E1E5',
    shadowOpacity: 0.9,
    shadowRadius: 3,
  },
  textChanges: {
    color: 'white',
    fontSize: 16,
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
