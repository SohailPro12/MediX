// screens/AdminGeneralScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const AdminGeneralScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('https://29ab-105-74-8-44.ngrok-free.app/api/admin/profile', {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const rawResponse = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${rawResponse}`);
      }

      const data = await response.json();
      console.log('Admin profile data:', data);
      setAdminData(data);
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      Alert.alert('Erreur', 'Impossible de charger le profil admin');
    } finally {
      setLoading(false);
    }
  };

  const uploadProfilePicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Erreur', 'Permission d\'accès à la galerie refusée');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      const token = await AsyncStorage.getItem('authToken');
      console.log('Token:', token);
  
      const formData = new FormData();
      let uri = result.assets[0].uri;
      let type = result.assets[0].type || 'image/jpeg';
      let name = 'profile.jpg';
  
      if (uri.startsWith('data:image')) {
        console.log('Detected base64 URI, converting to Blob...');
        const base64Data = uri.split(',')[1];
        const byteCharacters = atob(base64Data); // Decode base64 to binary string
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: type || 'image/png' });
  
        formData.append('image', blob, name);
      } else {
        formData.append('image', {
          uri: uri,
          type: type,
          name: name,
        });
      }
  
      console.log('Uploading image with URI:', uri);
  
      try {
        const response = await axios.post(
          'https://29ab-105-74-8-44.ngrok-free.app/api/admin/profile/picture',
          formData,
          {
            headers: {
              'ngrok-skip-browser-warning': 'true',
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json',
            },
          }
        );
  
        Alert.alert('Succès', response.data.message);
        fetchAdminProfile();
      } catch (error) {
        console.error('Error uploading picture:', error);
        console.log('Error response:', error.response?.data);
        const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message;
        Alert.alert('Erreur', `Échec de la mise à jour de l\'image: ${errorMsg}`);
      }
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{t("General")}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.profile}>
          <TouchableOpacity onPress={uploadProfilePicture}>
            {adminData?.image ? (
              <Image
                source={{ uri: adminData.image.startsWith('http') ? adminData.image : `data:image/jpeg;base64,${adminData.image}` }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="person-circle-outline" size={80} color="#888" />
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{`${adminData?.prenom || 'Admin'} ${adminData?.nom || 'Name'}`}</Text>
            <Text style={styles.info}>Email: {adminData?.mail || 'N/A'}</Text>
            <Text style={styles.info}>Téléphone: {adminData?.telephone || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("DoctorList")}>
            <Text style={styles.menuText}>{t("Liste des médecins")}</Text>
            <Icon name="chevron-forward" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("AddDoctor")}>
            <Text style={styles.menuText}>{t("Ajouter un médecin")}</Text>
            <Icon name="chevron-forward" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("ProblemesScreen")}>
            <Text style={styles.menuText}>{t("Problèmes techniques")}</Text>
            <Icon name="chevron-forward" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#333',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  profile: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  infoContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
});

export default AdminGeneralScreen;