import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import SuccessAlert from "../components/SuccessAlert";
const AddDoctor = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [experience, setExperience] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [doctorImage, setDoctorImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddDoctor = () => {
    if (!name || !email || !password || password !== confirmPassword) {
     alert("remplir toutes les champs svp")
      return;
    }
  setModalVisible(true)
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
      setDoctorImage(result.assets[0].uri);
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
        {doctorImage ? (
          <Image source={{ uri: doctorImage }} style={styles.image} />
        ) : (
          <Ionicons name="camera" size={32} color="#aaa" />
        )}
      </TouchableOpacity>

      {/* Champs du formulaire */}
      <Text style={styles.label}>Nom complet</Text>
      <TextInput style={styles.input} placeholder="Nom du médecin" value={name} onChangeText={setName} />

      <Text style={styles.label}>Adresse mail</Text>
      <TextInput style={styles.input} placeholder="name@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" />

      <Text style={styles.label}>Numéro de téléphone</Text>
      <TextInput style={styles.input} placeholder="+33 6 12 34 56 78" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <Text style={styles.label}>Spécialité</Text>
      <TextInput style={styles.input} placeholder="Cardiologue, Dermatologue..." value={specialty} onChangeText={setSpecialty} />


      <Text style={styles.label}>Années d'expérience</Text>
      <TextInput style={styles.input} placeholder="Ex: 10" value={experience} onChangeText={setExperience} keyboardType="numeric" />

      <Text style={styles.label}>Numéro d'identification professionnel</Text>
      <TextInput style={styles.input} placeholder="Ex: 123456789" value={licenseNumber} onChangeText={setLicenseNumber} keyboardType="numeric" />

      <Text style={styles.label}>Mot de Passe</Text>
      <TextInput style={styles.input} placeholder="Créer un mot de passe" secureTextEntry value={password} onChangeText={setPassword} />

      <TextInput style={styles.input} placeholder="Confirmer le mot de passe" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

      <TouchableOpacity style={styles.addButton} onPress={handleAddDoctor}>
        <Text style={styles.addButtonText}>Ajouter</Text>
      </TouchableOpacity>
      <SuccessAlert
        visible={modalVisible}
        message="Compte créé avec succès"
        onClose={() => {
          setModalVisible(false);
          navigation.goBack();
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
    borderWidth:1,
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