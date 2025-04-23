import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import SuccessAlert from "../components/SuccessAlert";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

const AddDoctor = () => {
  const navigation = useNavigation();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [cin, setCin] = useState("");
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photoUri, setPhotoUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageSelect = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission refusée", "Vous devez accepter l'accès à la galerie.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleAddDoctor = async () => {
    setIsSubmitting(true);

    // Basic validations
    if (!nom || !prenom || !mail || !specialty || !password || !confirmPassword) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires.");
      setIsSubmitting(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail.trim())) {
      Alert.alert("Erreur", "Veuillez entrer un email valide.");
      setIsSubmitting(false);
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      setIsSubmitting(false);
      return;
    }

    // Retrieve SSO code
    let codeSSO;
    try {
      codeSSO = await AsyncStorage.getItem('ssoCode');
      if (!codeSSO) throw new Error("Code SSO introuvable.");
    } catch (error) {
      Alert.alert("Erreur", error.message);
      setIsSubmitting(false);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const formData = new FormData();

      // Append image if selected
      if (photoUri) {
        formData.append('image', {
          uri: photoUri,
          type: 'image/jpeg',
          name: 'doctor_profile.jpg',
        });
      }

      // Append all fields
      formData.append('nom', nom.trim());
      formData.append('prenom', prenom.trim());
      formData.append('cin', cin.trim());
      formData.append('mail', mail.trim());
      formData.append('phone', phone.trim());
      formData.append('specialty', specialty.trim());
      formData.append('licenseNumber', licenseNumber.trim());
      formData.append('password', password.trim());
      formData.append('codeSSO', codeSSO);

      const response = await fetch(`${API_URL}/api/admin/addDoc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.status === 400) {
        Alert.alert("Erreur", "Un compte avec cet email existe déjà.");
      } else if (response.ok) {
        setModalVisible(true);
      } else {
        const errText = await response.text();
        throw new Error(errText);
      }
    } catch (error) {
      console.error("handleAddDoctor error:", error);
      Alert.alert("Erreur", "Une erreur est survenue. Veuillez réessayer plus tard.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Ajouter un médecin</Text>
      <Text style={styles.subtitle}>Créer un compte pour un médecin</Text>

      <TouchableOpacity onPress={handleImageSelect} style={styles.imageContainer}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.image} />
        ) : (
          <Ionicons name="camera" size={32} color="#aaa" />
        )}
      </TouchableOpacity>

      {/* Form fields... */}
      <Text style={styles.label}>Nom</Text>
      <TextInput style={styles.input} placeholder="Nom du médecin" value={nom} onChangeText={setNom} />
      <Text style={styles.label}>Prenom</Text>
      <TextInput style={styles.input} placeholder="Prenom du médecin" value={prenom} onChangeText={setPrenom} />
      <Text style={styles.label}>CIN</Text>
      <TextInput style={styles.input} placeholder="A12345" value={cin} onChangeText={setCin} />
      <Text style={styles.label}>Adresse mail</Text>
      <TextInput style={styles.input} placeholder="email@example.com" value={mail} onChangeText={setMail} keyboardType="email-address" />
      <Text style={styles.label}>Téléphone</Text>
      <TextInput style={styles.input} placeholder="+33 6 12 34 56 78" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Text style={styles.label}>Spécialité</Text>
      <TextInput style={styles.input} placeholder="Cardiologue..." value={specialty} onChangeText={setSpecialty} />
      <Text style={styles.label}>ID Professionnel</Text>
      <TextInput style={styles.input} placeholder="123456789" value={licenseNumber} onChangeText={setLicenseNumber} keyboardType="numeric" />
      <Text style={styles.label}>Mot de passe</Text>
      <TextInput style={styles.input} placeholder="Mot de passe" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Confirmer le mot de passe" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

      <TouchableOpacity
        style={[styles.addButton, isSubmitting && { opacity: 0.6 }]}
        onPress={handleAddDoctor}
        disabled={isSubmitting}
      >
        <Text style={styles.addButtonText}>{isSubmitting ? "Ajout en cours..." : "Ajouter"}</Text>
      </TouchableOpacity>

      <SuccessAlert
        visible={modalVisible}
        message="Compte créé avec succès"
        onClose={() => {
          setModalVisible(false);
          if (navigation.canGoBack()) navigation.goBack();
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#f7f7f7", padding: 26, alignItems: "center" },
  backButton: { alignSelf: "flex-start", marginBottom: 6 },
  title: { fontSize: 26, fontWeight: "bold", color: "#333" },
  subtitle: { fontSize: 16, color: "#777", marginBottom: 20 },
  imageContainer: { width: 110, height: 110, borderRadius: 55, backgroundColor: "#e0e0e0", justifyContent: "center", alignItems: "center", marginBottom: 20, overflow: "hidden" },
  image: { width: "100%", height: "100%" },
  label: { fontSize: 16, fontWeight: "bold", color: "#444", alignSelf: "flex-start", marginBottom: 5 },
  input: { width: "100%", padding: 15, borderWidth: 1, borderColor: "#d0dbda", borderRadius: 10, backgroundColor: "#fff", marginBottom: 15, fontSize: 16, elevation: 2 },
  addButton: { backgroundColor: "#75E1E5", paddingVertical: 15, paddingHorizontal: 30, borderRadius: 25, alignItems: "center", width: "75%", marginTop: 10, elevation: 3 },
  addButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" }
});

export default AddDoctor;
