import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_URL } from '../config';

const AdminGeneralScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${API_URL}/api/admin/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP ${response.status} - ${errorBody}`);
      }

      const data = await response.json();
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
      const uri = result.assets[0].uri;

      const formData = new FormData();
      formData.append("image", {
        uri,
        type: "image/jpeg",
        name: "admin_profile.jpg",
      });

      try {
        const response = await axios.post(
          `${API_URL}/api/upload/Admins`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        Alert.alert('Succès', response.data.message || "Image mise à jour");
        fetchAdminProfile(); // refresh profile
      } catch (error) {
        console.error('Error uploading picture:', error);
        const errorMsg = error.response?.data?.error || error.message;
        Alert.alert('Erreur', `Échec de l'upload : ${errorMsg}`);
      }
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{t("Général")}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.profile}>
          <View style={styles.avatarWrapper}>
            <TouchableOpacity onPress={uploadProfilePicture}>
              {adminData?.image ? (
                <Image
                  source={{ uri: adminData.image }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Icon name="person-circle-outline" size={80} color="#888" />
                </View>
              )}
              <View style={styles.plusIcon}>
                <Icon name="add-circle" size={24} color="#007bff" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.name}>{`${adminData?.prenom || 'Admin'} ${adminData?.nom || ''}`}</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: { fontSize: 18, fontWeight: 'bold', marginLeft: 16, color: '#333' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  profile: { alignItems: 'center', marginBottom: 32 },
  avatarWrapper: {
    position: 'relative',
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    borderWidth: 2,
    borderColor: '#ddd',
  },
  plusIcon: {
    position: 'absolute',
    bottom: 0,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  infoContainer: { alignItems: 'center' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  info: { fontSize: 14, color: '#888', marginBottom: 2 },
  buttonsContainer: { width: '100%', alignItems: 'center' },
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
    marginBottom: 5,
  },
  menuText: { fontSize: 16, color: '#333', flex: 1 },
});

export default AdminGeneralScreen;
