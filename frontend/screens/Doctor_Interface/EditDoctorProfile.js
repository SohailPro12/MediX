import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, 
  Keyboard, ActivityIndicator, Alert, Image
} from 'react-native';
import { Divider, Card, Avatar } from 'react-native-paper';
import { useMedecin } from '../context/MedecinContext';
import Header from '../../components/DoctorComponents/Header';
import { API_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const EditDoctorProfile = () => {
  const { medecin, setMedecin } = useMedecin();
  const [about, setAbout] = useState('');
  const [formation, setFormation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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
          'Accept': 'application/json',
        }
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      
      if (response.ok) {
        setMedecin(data);
        return data;
      } else {
        throw new Error(data.message || 'Erreur inconnue');
      }
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission requise", "L'accès à la galerie est nécessaire");
        return;
      }
  
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
  
      if (!pickerResult.canceled && pickerResult.assets?.length > 0) {
        const selectedImage = pickerResult.assets[0];
        setPhotoUri(selectedImage.uri);
      }
    } catch (error) {
      console.error("Erreur:", error);
      Alert.alert("Erreur", "Impossible de sélectionner l'image");
    }
  };
  

  const uploadImage = async () => {
    if (!photoUri) return;

    setIsUploading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('image', {
        uri: photoUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });

      const response = await fetch(`${API_URL}/api/doctor/uploadImage`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Échec de l'upload");

      await reloadDoctorProfile();
      setPhotoUri(null);
      return true;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (photoUri) {
        await uploadImage();
      }

      const updatedDoctorData = {
        description: about,
        formation: formation.filter(item => item.trim() !== ''),
        experience: experience.filter(item => item.trim() !== ''),
      };

      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/doctor/EditProfile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedDoctorData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour');
      }

      await reloadDoctorProfile();
      setIsEditing(false);
      Alert.alert('Succès', 'Profil mis à jour avec succès');
    } catch (error) {
      console.error("Erreur:", error);
      Alert.alert('Erreur', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!medecin || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#75E1E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header name="Votre Profil" screen='SettingsDScreen' />
      
      <Card style={styles.profileCard}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Avatar.Image
                size={100}
                source={
                  photoUri 
                    ? { uri: photoUri }
                    : medecin?.Photo 
                      ? { uri: medecin.Photo } 
                      : require('../../assets/doctor.png')
                }
              />
              {isUploading && (
                <View style={styles.uploadOverlay}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              )}
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.name}>Dr. {medecin.nom} {medecin.prenom}</Text>
              <Text style={styles.specialty}>Spécialiste en {medecin.specialite}</Text>
              
              {isEditing && (
                <TouchableOpacity 
                  style={styles.changePhotoButton}
                  onPress={pickImage}
                  disabled={isUploading}
                >
                  <Text style={styles.changePhotoText}>
                    {isUploading ? 'Chargement...' : 'Changer la photo'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Card style={styles.detailsCard}>
            <Card.Content>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.detailsContent}>
                  <Text style={styles.sectionTitle}>À propos</Text>
                  {isEditing ? (
                    <TextInput
                      multiline
                      value={about}
                      onChangeText={setAbout}
                      style={styles.textInput}
                      placeholder="Décrivez votre pratique médicale"
                    />
                  ) : (
                    <Text style={styles.aboutText}>
                      {medecin.description || "Aucune description fournie"}
                    </Text>
                  )}

                  <Divider style={styles.divider} />

                  <Text style={styles.sectionTitle}>Formation</Text>
                  {isEditing ? (
                    <>
                      {formation.map((form, index) => (
                        <TextInput
                          key={`formation-${index}`}
                          multiline
                          value={form}
                          onChangeText={(text) => {
                            const newForm = [...formation];
                            newForm[index] = text;
                            setFormation(newForm);
                          }}
                          style={styles.textInput}
                          placeholder="Diplôme, année, université"
                        />
                      ))}
                      <TouchableOpacity
                        onPress={() => setFormation([...formation, ''])}
                        style={styles.addButton}
                      >
                        <Text style={styles.addButtonText}>+ Ajouter une formation</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    formation.length > 0 ? (
                      formation.map((form, index) => (
                        <Text key={`formation-${index}`} style={styles.aboutText}>• {form}</Text>
                      ))
                    ) : (
                      <Text style={styles.aboutText}>Aucune formation renseignée</Text>
                    )
                  )}

                  <Divider style={styles.divider} />

                  <Text style={styles.sectionTitle}>Expérience</Text>
                  {isEditing ? (
                    <>
                      {experience.map((exp, index) => (
                        <TextInput
                          key={`experience-${index}`}
                          multiline
                          value={exp}
                          onChangeText={(text) => {
                            const newExp = [...experience];
                            newExp[index] = text;
                            setExperience(newExp);
                          }}
                          style={styles.textInput}
                          placeholder="Poste, établissement, années"
                        />
                      ))}
                      <TouchableOpacity
                        onPress={() => setExperience([...experience, ''])}
                        style={styles.addButton}
                      >
                        <Text style={styles.addButtonText}>+ Ajouter une expérience</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    experience.length > 0 ? (
                      experience.map((exp, index) => (
                        <Text key={`experience-${index}`} style={styles.aboutText}>• {exp}</Text>
                      ))
                    ) : (
                      <Text style={styles.aboutText}>Aucune expérience renseignée</Text>
                    )
                  )}
                </View>
              </TouchableWithoutFeedback>
            </Card.Content>
          </Card>

          <TouchableOpacity
            style={[styles.saveButton, isEditing ? styles.saveButtonActive : null]}
            onPress={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={isLoading || isUploading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>
                {isEditing ? 'Enregistrer les modifications' : 'Modifier le profil'}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    margin: 16,
    borderRadius: 10,
    elevation: 4,
  },
  detailsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  changePhotoButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 4,
  },
  changePhotoText: {
    color: '#1976d2',
    fontSize: 14,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  detailsContent: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 12,
  },
  aboutText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginBottom: 12,
  },
  textInput: {
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    minHeight: 50,
  },
  divider: {
    marginVertical: 12,
    backgroundColor: '#eee',
  },
  addButton: {
    padding: 10,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButtonText: {
    color: '#1976d2',
    fontSize: 14,
  },
  saveButton: {
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: '#90caf9',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  saveButtonActive: {
    backgroundColor: '#1976d2',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditDoctorProfile;