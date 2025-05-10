// screens/Doctor/EditDoctorProfile.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import { Divider, Card, Avatar } from 'react-native-paper';
import { useMedecin } from '../context/MedecinContext';
import Header from '../../components/DoctorComponents/Header';
import { API_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function EditDoctorProfile() {
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
    const token = await AsyncStorage.getItem('authToken');
    const res = await fetch(`${API_URL}/api/doctor/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    if (res.ok) {
      setMedecin(data);
      return data;
    } else {
      throw new Error(data.message || 'Erreur lors du rechargement');
    }
  };

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission requise', 'Accès à la galerie refusé');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1,1],
      quality: 0.7
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
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
        name: 'profile.jpg'
      });
      const res = await fetch(
        `${API_URL}/api/doctor/uploadimage/doctor`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          body: formData
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message);
      await reloadDoctorProfile();
      setPhotoUri(null);
    } catch (err) {
      console.error('Upload error:', err);
      Alert.alert('Erreur', err.message);
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
      const updated = {
        description: about,
        formation: formation.filter(f => f.trim() !== ''),
        experience: experience.filter(e => e.trim() !== '')
      };
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/api/doctor/EditProfile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Échec mise à jour');
      }
      await reloadDoctorProfile();
      setIsEditing(false);
      Alert.alert('Succès', 'Profil mis à jour');
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert('Erreur', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!medecin || isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#75E1E5"/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header name="Votre Profil" screen="SettingsDScreen"/>
      <Card style={styles.profileCard}>
        <Card.Content>
          <View style={styles.headerRow}>
            <View style={styles.avatarWrapper}>
              <Avatar.Image
                size={100}
                source={
                  photoUri
                    ? { uri: photoUri }
                    : medecin.Photo
                      ? { uri: medecin.Photo }
                      : require('../../assets/doctor.png')
                }
              />
              {isUploading && (
                <View style={styles.uploadOverlay}>
                  <ActivityIndicator size="large" color="#fff"/>
                </View>
              )}
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>Dr. {medecin.nom} {medecin.prenom}</Text>
              <Text style={styles.specialty}>Spécialiste en {medecin.specialite}</Text>
              {isEditing && (
                <TouchableOpacity
                  style={styles.changeBtn}
                  onPress={pickImage}
                  disabled={isUploading}
                >
                  <Text style={styles.changeTxt}>
                    {isUploading ? 'Chargement...' : 'Changer photo'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex:1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Card style={styles.detailCard}>
            <Card.Content>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                  <Text style={styles.section}>À propos</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.inputMultiline}
                      multiline
                      value={about}
                      onChangeText={setAbout}
                      placeholder="Décrivez votre pratique"
                    />
                  ) : (
                    <Text style={styles.text}>
                      {medecin.description || 'Aucune description'}
                    </Text>
                  )}

                  <Divider style={styles.divider}/>

                  <Text style={styles.section}>Formation</Text>
                  {isEditing ? (
                    <>
                      {formation.map((f, i) => (
                        <TextInput
                          key={i}
                          style={styles.input}
                          value={f}
                          onChangeText={txt => {
                            const arr = [...formation];
                            arr[i] = txt;
                            setFormation(arr);
                          }}
                          placeholder="Diplôme, année..."
                        />
                      ))}
                      <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => setFormation([...formation,''])}
                      >
                        <Text style={styles.addTxt}>+ Ajouter formation</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    formation.length > 0
                      ? formation.map((f,i)=> <Text key={i} style={styles.text}>• {f}</Text>)
                      : <Text style={styles.text}>Aucune formation</Text>
                  )}

                  <Divider style={styles.divider}/>

                  <Text style={styles.section}>Expérience</Text>
                  {isEditing ? (
                    <>
                      {experience.map((e,i)=> (
                        <TextInput
                          key={i}
                          style={styles.input}
                          value={e}
                          onChangeText={txt => {
                            const arr = [...experience];
                            arr[i] = txt;
                            setExperience(arr);
                          }}
                          placeholder="Poste, établissement..."
                        />
                      ))}
                      <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => setExperience([...experience,''])}
                      >
                        <Text style={styles.addTxt}>+ Ajouter expérience</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    experience.length > 0
                      ? experience.map((e,i)=> <Text key={i} style={styles.text}>• {e}</Text>)
                      : <Text style={styles.text}>Aucune expérience</Text>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </Card.Content>
          </Card>

          <TouchableOpacity
            style={[styles.saveBtn, isEditing && styles.saveActive]}
            onPress={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={isUploading}
          >
            {isEditing
              ? <ActivityIndicator color="#fff"/>
              : <Text style={styles.saveTxt}>Modifier le profil</Text>
            }
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#f5f5f5', marginTop:50 },
  loading: { flex:1, justifyContent:'center', alignItems:'center' },
  profileCard: { margin:16, borderRadius:10, elevation:4 },
  headerRow: { flexDirection:'row', alignItems:'center', padding:8 },
  avatarWrapper: { position:'relative', marginRight:16 },
  uploadOverlay: {
    position:'absolute', top:0,left:0,right:0,bottom:0,
    backgroundColor:'rgba(0,0,0,0.3)', borderRadius:50,
    justifyContent:'center', alignItems:'center'
  },
  info: { flex:1 },
  name: { fontSize:20, fontWeight:'bold', color:'#333' },
  specialty: { fontSize:16, color:'#666', marginBottom:8 },
  changeBtn: { backgroundColor:'#e3f2fd', padding:6, borderRadius:4 },
  changeTxt: { color:'#1976d2' },

  scroll: { paddingBottom:20 },
  detailCard: { marginHorizontal:16, marginBottom:16, borderRadius:10, elevation:4 },
  section: { fontSize:18, fontWeight:'bold', color:'#333', marginBottom:8 },
  input: {
    borderWidth:1, borderColor:'#ddd', borderRadius:6,
    padding:10, marginBottom:12, backgroundColor:'#fff'
  },
  inputMultiline: {
    borderWidth:1, borderColor:'#ddd', borderRadius:6,
    padding:10, marginBottom:12, minHeight:60, backgroundColor:'#fff'
  },
  text: { fontSize:16, color:'#555', marginBottom:12 },
  divider: { backgroundColor:'#eee', marginVertical:12 },
  addBtn: {
    padding:10, backgroundColor:'#e3f2fd',
    borderRadius:6, alignItems:'center', marginBottom:12
  },
  addTxt: { color:'#1976d2', fontSize:14 },

  saveBtn: {
    marginHorizontal:16, padding:14,
    backgroundColor:'#90caf9', borderRadius:10,
    alignItems:'center', elevation:2
  },
  saveActive: { backgroundColor:'#1976d2' },
  saveTxt: { color:'#fff', fontSize:16, fontWeight:'bold' }
});
