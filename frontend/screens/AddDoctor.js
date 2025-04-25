import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import SuccessAlert from "../components/SuccessAlert";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../config';

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
  const [photo, setPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Nouvel état

  

  const handleAddDoctor = async () => {
    setIsSubmitting(true); // Désactiver le bouton pendant l'envoi

    try {
        // Vérification des champs vides
        if (!nom || !prenom || !mail || !specialty || !password || !confirmPassword) {
            alert("Veuillez remplir tous les champs obligatoires.");
            setIsSubmitting(false); // Réactiver le bouton en cas d'erreur
            return;
        }

        // Vérification du format de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(mail.trim())) {
            alert("Veuillez entrer un email valide.");
            setIsSubmitting(false); // Réactiver le bouton en cas d'erreur
            return;
        }

        // Vérification du mot de passe
        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            setIsSubmitting(false); // Réactiver le bouton en cas d'erreur
            return;
        }

        // Récupération sécurisée du code SSO
        let codeSSO = null;
        try {
            codeSSO = await AsyncStorage.getItem('ssoCode');
            if (!codeSSO) {
                throw new Error("Code SSO introuvable. Veuillez réessayer.");
            }
        } catch (error) {
            alert(error.message);
            setIsSubmitting(false); // Réactiver le bouton en cas d'erreur
            return;
        }

        console.log("SSO Code récupéré:", codeSSO);

        // Envoi des données à l'API
        const response = await fetch(`${API_URL}/api/admin/addDoc`, {
            method: 'POST',
            headers: {
          'Content-Type': 'application/json',
            },
            body: JSON.stringify({
          nom: nom.trim(),
          prenom: prenom.trim(),
          cin: cin?.trim(),
          specialty: specialty.trim(),
          licenseNumber: licenseNumber?.trim(),
          mail: mail.trim(),
          phone: phone?.trim(),
          password: password.trim(),
          codeSSO,
          photo,
            }),
        });

        if (response.status === 400) {
          alert("Un compte avec cet email existe déjà.");
          setIsSubmitting(false); // Réactiver le bouton
          return;
      }

      if (response.ok) {
        setModalVisible(true);
    } else {

            const errorText = await response.text();
            throw new Error(`Erreur HTTP ${response.status} : ${errorText}`);
        }


      
    } catch (error) {
        console.error("Erreur dans handleAddDoctor:", error);
        alert("Une erreur est survenue. Veuillez réessayer plus tard.");
    } finally {
        setIsSubmitting(false); // Réactiver le bouton après la soumission
    }
  };

  const handleImageSelect = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission refusée ! Vous devez accepter l'accès à la galerie.");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setPhoto(imageUri);
  
      const formData = new FormData();    
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "doctor_profile.jpg",
      });
  
      try {
        const response = await fetch(`${API_URL}/api/upload/doctors`, {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${await AsyncStorage.getItem("authToken")}`,
          },
        });
  
        const data = await response.json();
        if (data.imageUrl) {
          setPhoto(data.imageUrl);
          console.log("Image uploaded:", data.imageUrl);
        } else {
          alert("Erreur lors de l'upload.");
        }
      } catch (error) {
        console.error("Erreur d'upload:", error);
        alert("Une erreur est survenue lors du téléversement de l'image.");
      }
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Ajouter un médecin</Text>
      <Text style={styles.subtitle}>Créer un compte pour un médecin</Text>

      {/* Sélection d'image */}
      <TouchableOpacity onPress={handleImageSelect} style={styles.imageContainer}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.image} />
        ) : (
          <Ionicons name="camera" size={32} color="#aaa" />
        )}
      </TouchableOpacity>

      {/* Champs du formulaire */}
      <Text style={styles.label}>Nom</Text>
      <TextInput style={styles.input} placeholder="Nom du médecin" value={nom} onChangeText={setNom} />
      <Text style={styles.label}>Prenom</Text>
      <TextInput style={styles.input} placeholder="Prenom du médecin" value={prenom} onChangeText={setPrenom} />
      <Text style={styles.label}>CIN</Text>
      <TextInput style={styles.input} placeholder="A12345" value={cin} onChangeText={setCin} />

      <Text style={styles.label}>Adresse mail</Text>
      <TextInput style={styles.input} placeholder="name@email.com" value={mail} onChangeText={setMail} keyboardType="email-address" />

      <Text style={styles.label}>Numéro de téléphone</Text>
      <TextInput style={styles.input} placeholder="+33 6 12 34 56 78" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <Text style={styles.label}>Spécialité</Text>
      <TextInput style={styles.input} placeholder="Cardiologue, Dermatologue..." value={specialty} onChangeText={setSpecialty} />

      <Text style={styles.label}>Numéro d'identification professionnel</Text>
      <TextInput style={styles.input} placeholder="Ex: 123456789" value={licenseNumber} onChangeText={setLicenseNumber} keyboardType="numeric" />

      <Text style={styles.label}>Mot de Passe</Text>
      <TextInput style={styles.input} placeholder="Créer un mot de passe" secureTextEntry value={password} onChangeText={setPassword} />

      <TextInput style={styles.input} placeholder="Confirmer le mot de passe" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

      <TouchableOpacity
        style={[styles.addButton, isSubmitting && { opacity: 0.6 }]}
        onPress={handleAddDoctor}
        disabled={isSubmitting} // Désactive le bouton pendant l'envoi
      >
        <Text style={styles.addButtonText}>{isSubmitting ? "Ajout en cours..." : "Ajouter"}</Text>
      </TouchableOpacity>

      <SuccessAlert
  visible={modalVisible}
  message="Compte créé avec succès"
  onClose={() => {
    setModalVisible(false);
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }}
/>





    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f7f7f7",
    padding: 26,
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 20,
  },
  imageContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#d0dbda",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
    fontSize: 16,
    shadowColor: "#ebf",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButton: {
    backgroundColor: "#75E1E5",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    width: "75%",
    marginTop: 10,
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddDoctor;
