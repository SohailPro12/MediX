import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import BottomNav from '../../components/PatientComponents/BottomNav';
import { usePatient } from '../context/PatientContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "../../config";

const PatientProfile = ({ navigation }) => {
  const { patient, setPatient } = usePatient();
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    mail: '',
    image: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPatientData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/patient/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Échec de la récupération des données patient');
      }

      const patientData = await response.json();
      setPatient(patientData);
      setFormData({
        _id: null,
        cin: null,
        telephone: null,
        prenom: patientData.prenom || '',
        nom: patientData.nom || '',
        mail: patientData.mail || '',
        image: patientData.image || null,
      });
    } catch (error) {
      console.error('Erreur:', error);
      Alert.alert('Erreur', 'Impossible de charger les données du patient');
    }
  }, [setPatient]);

  useEffect(() => {
    fetchPatientData();
  }, [fetchPatientData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPatientData();
    setRefreshing(false);
  }, [fetchPatientData]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Nous avons besoin de la permission pour accéder à vos photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  const uploadImage = async () => {
    // Implémentez la logique d'upload de l'image ici
    // Retourne l'URL de l'image uploadée
    return formData.image;
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (!formData.prenom.trim()) {
        throw new Error('Le prénom est requis');
      }
      if (!formData.nom.trim()) {
        throw new Error('Le nom est requis');
      }
      if (formData.mail && !/^\S+@\S+\.\S+$/.test(formData.mail)) {
        throw new Error('Veuillez entrer un email valide');
      }

      let imageUrl = formData.image;
      if (formData.image && formData.image.startsWith('file:')) {
        imageUrl = await uploadImage();
      }

      const updatedData = {
        prenom: formData.prenom.trim(),
        nom: formData.nom.trim(),
        mail: formData.mail.trim(),
        telephone: patient.telephone,
        cin: patient.cin, 
        image: imageUrl,
      };

      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/patient/EditProfile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la mise à jour du profil');
      }

      const updatedPatient = await response.json();
    setPatient({
      ...patient, // conserve les champs existants
      prenom: updatedPatient.prenom,
      nom: updatedPatient.nom,
      mail: updatedPatient.mail,
      image: updatedPatient.image
    });
      
      Alert.alert('Succès', 'Profil mis à jour avec succès');
      setIsEdit(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      Alert.alert('Erreur', error.message || 'Une erreur est survenue lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('authToken');
              navigation.navigate('CodeSSOScreen');
            } catch (error) {
              console.error("Erreur lors de la déconnexion:", error);
            }
          },
        },
      ]
    );
  };

  if (!patient) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement des données patient...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={styles.container}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#5771f9']}
                tintColor="#5771f9"
              />
            }
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={28} color="#5771f9" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Profil</Text>
              <View style={{ width: 30 }} />
            </View>

            <View style={styles.profileContainer}>
              <View style={styles.avatarContainer}>
                <Avatar.Image
                  size={120}
                  source={
                    formData.image
                      ? { uri: formData.image }
                      : require('../../assets/Patient.jpeg')
                  }
                />
                {isEdit && (
                  <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
                    <Ionicons name="camera" size={20} color="white" />
                  </TouchableOpacity>
                )}
              </View>

              {isEdit ? (
                <>
                  <TextInput
                    value={formData.prenom}
                    onChangeText={(text) => setFormData({ ...formData, prenom: text })}
                    style={styles.textInput}
                    placeholder="Prénom"
                  />
                  <TextInput
                    value={formData.nom}
                    onChangeText={(text) => setFormData({ ...formData, nom: text })}
                    style={styles.textInput}
                    placeholder="Nom"
                  />
                </>
              ) : (
                <Text style={styles.name}>{`${formData.prenom} ${formData.nom}`}</Text>
              )}

              {isEdit ? (
                <TextInput
                  keyboardType="email-address"
                  value={formData.mail}
                  onChangeText={(text) => setFormData({ ...formData, mail: text })}
                  style={styles.textInput}
                  placeholder="Email"
                />
              ) : (
                <Text style={styles.email}>{formData.mail || 'Aucun email renseigné'}</Text>
              )}
            </View>

            <View style={styles.menu}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={isEdit ? handleSave : () => setIsEdit(true)}
                disabled={isLoading}
              >
                {isEdit ? (
                  <>
                    <Text style={styles.menuText}>
                      {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                    </Text>
                    <Feather name="check-square" size={24} color="green" />
                  </>
                ) : (
                  <>
                    <Text style={styles.menuText}>Modifier le profil</Text>
                    <AntDesign name="edit" size={24} color="green" />
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('ChangePassword')}
              >
                <Text style={styles.menuText}>Changer le mot de passe</Text>
                <FontAwesome name="lock" size={24} color="blue" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <Text style={styles.menuText}>Déconnexion</Text>
                <MaterialIcons name="logout" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#5771f9',
    borderRadius: 20,
    padding: 6,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 5,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  menu: {
    width: '100%',
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  textInput: {
    width: '80%',
    fontSize: 16,
    color: '#555',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    backgroundColor: 'white',
  },
});

export default PatientProfile;