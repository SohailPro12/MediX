import React, { useState, useContext } from 'react';
import { View, Text, KeyboardAvoidingView, Modal, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Checkbox } from 'react-native-paper';
import AntDesign from '@expo/vector-icons/AntDesign';
import Header from '../../components/DoctorComponents/Header';
import { API_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMedecin } from '../context/MedecinContext';
import { useNavigation } from '@react-navigation/native';

const AjouterPa = () => {
  const navigation = useNavigation();
  const { medecin } = useMedecin();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    cin: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: ''
  });
  const [checked, setChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { nom, prenom, cin, email, telephone, password, confirmPassword } = formData;
    
    if (!nom || !prenom || !email || !telephone || !password || !confirmPassword) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Erreur", "Veuillez entrer un email valide.");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return false;
    }

    if (!checked) {
      Alert.alert("Erreur", "Veuillez confirmer que les données sont correctes.");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    if (!medecin?._id) {
      Alert.alert("Erreur", "Médecin non identifié");
      return;
    }

    setIsSubmitting(true);

    try {
      const codeSSO = await AsyncStorage.getItem('ssoCode');
      if (!codeSSO) throw new Error("Code SSO introuvable");

      const response = await fetch(`${API_URL}/api/doctor/AddPatient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_medecin: medecin._id,
          nom: formData.nom.trim(),
          prenom: formData.prenom.trim(),
          cin: formData.cin?.trim(),
          mail: formData.email.trim(),
          telephone: formData.telephone.trim(),
          password: formData.password.trim(),
          codeSSO,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la création du patient");
      }

      setSuccessModal(true);
    } catch (error) {
      console.error("Erreur:", error);
      Alert.alert("Erreur", error.message || "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessModal(false);
    navigation.goBack(); 
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Header name="Ajouter un Patient" screen="SettingsDScreen" />
      <Text style={styles.text}>Créer un compte pour un nouveau patient</Text>

      {Object.entries({
        nom: 'Nom',
        prenom: 'Prénom',
        cin: 'CIN',
        email: 'Adresse mail',
        telephone: 'Téléphone',
        password: 'Mot de passe',
        confirmPassword: 'Confirmer mot de passe'
      }).map(([key, label]) => (
        <TextInput
          key={key}
          label={label}
          value={formData[key]}
          onChangeText={text => handleChange(key, text)}
          mode="outlined"
          secureTextEntry={key.includes('password')}
          keyboardType={
            key === 'email' ? 'email-address' : 
            key === 'telephone' ? 'phone-pad' : 'default'
          }
          theme={{ colors: { primary: '#75E1E5', underlineColor: 'transparent' } }}
          style={styles.input}
        />
      ))}

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => setChecked(!checked)}
          color="#75E1E5"
        />
        <Text>Confirmez-vous que les données saisies sont correctes ?</Text>
      </View>

      <Button
        mode="contained"
        onPress={handleRegister}
        style={styles.buttonCr}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        Créer un compte
      </Button>

      <Modal visible={successModal} transparent animationType="fade">
        <View style={styles.modalFcontainer}>
          <View style={styles.modalScontainer}>
            <AntDesign name="checkcircleo" size={90} color="#75E1E5" />
            <Text style={styles.modalText}>Compte patient créé avec succès</Text>
            <Button
              mode="contained"
              onPress={handleSuccessClose}
              style={styles.modalButton}
            >
              OK
            </Button>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingVertical: '12%',
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    marginVertical: 20,
    color: 'rgb(135, 132, 132)',
  },
  input: {
    marginTop: 10,
    backgroundColor: 'rgb(244, 254, 252)',
  },
  buttonCr: {
    marginTop: 10,
    backgroundColor: '#75E1E5',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  modalFcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalScontainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    marginVertical: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#75E1E5',
    width: '100%',
  },
});

export default AjouterPa;