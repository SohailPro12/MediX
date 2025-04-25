import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Modal, StyleSheet } from 'react-native';
import { TextInput, Button, Checkbox } from 'react-native-paper';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Header from '../../components/DoctorComponents/Header';
import { API_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AjouterPa = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [cin, setCin] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Ajout du state pour gérer l'envoi
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  const handleRegister = async () => {
    setIsSubmitting(true); // Désactivation du bouton pendant l'envoi

    try {
      // Vérification des champs vides
      if (!nom || !prenom || !cin || !email || !telephone || !password || !confirmPassword || !checked) {
        alert("Veuillez remplir tous les champs obligatoires.");
        setIsSubmitting(false); // Réactiver le bouton en cas d'erreur
        return;
      }

      // Vérification du format de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
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
      const response = await fetch(`${API_URL}/api/doctor/AddPatient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: nom.trim(),
          prenom: prenom.trim(),
          cin: cin?.trim(),
          mail: email.trim(),
          telephone: telephone.trim(),
          password: password.trim(),
          codeSSO,
        }),
      });

      if (response.status === 400) {
        alert("Un compte avec cet email existe déjà.");
        setIsSubmitting(false); // Réactiver le bouton
        return;
      }

      if (response.ok) {
        setSuccessModal(true);
      } else {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP ${response.status} : ${errorText}`);
      }
    } catch (error) {
      console.error("Erreur dans handleRegister:", error);
      alert("Une erreur est survenue. Veuillez réessayer plus tard.");
    } finally {
      setIsSubmitting(false); // Réactiver le bouton après la soumission
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Header name="Ajouter un Patient" screen="SettingsDScreen" />
      <Text style={styles.text}>Créer un compte pour un nouveau patient</Text>

      <TextInput
        label="Nom"
        value={nom}
        onChangeText={setNom}
        mode="outlined"
        theme={{ colors: { primary: '#75E1E5', underlineColor: 'transparent' } }}
        style={styles.input}
      />
      <TextInput
        label="Prénom"
        value={prenom}
        onChangeText={setPrenom}
        mode="outlined"
        theme={{ colors: { primary: '#75E1E5', underlineColor: 'transparent' } }}
        style={styles.input}
      />
      <TextInput
        label="CIN"
        value={cin}
        onChangeText={setCin}
        mode="outlined"
        theme={{ colors: { primary: '#75E1E5', underlineColor: 'transparent' } }}
        style={styles.input}
      />
      <TextInput
        label="Adresse mail"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        theme={{ colors: { primary: '#75E1E5', underlineColor: 'transparent' } }}
        style={styles.input}
      />
      <TextInput
        label="Téléphone"
        value={telephone}
        onChangeText={setTelephone}
        mode="outlined"
        keyboardType="phone-pad"
        theme={{ colors: { primary: '#75E1E5', underlineColor: 'transparent' } }}
        style={styles.input}
      />
      <TextInput
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        theme={{ colors: { primary: '#75E1E5', underlineColor: 'transparent' } }}
        style={styles.input}
      />
      <TextInput
        label="Confirmer mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        mode="outlined"
        secureTextEntry
        theme={{ colors: { primary: '#75E1E5', underlineColor: 'transparent' } }}
        style={styles.input}
      />

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
        disabled={isSubmitting} // Désactive le bouton pendant l'envoi
      >
        {isSubmitting ? 'Envoi...' : 'Créer un compte'}
      </Button>

      {/* Modal de succès */}
      <Modal visible={successModal} transparent animationType="slide">
        <View style={styles.modalFcontainer}>
          <View style={styles.modalScontainer}>
            <AntDesign name="checkcircleo" size={90} color="#75E1E5" style={{ marginBottom: 30 }} />
            <Text style={{ fontSize: 20, marginBottom: 20 }}>Compte créé avec succès</Text>
            <Button
              mode="contained"
              onPress={() => setSuccessModal(false)}
              style={{ backgroundColor: '#75E1E5' }}
            >
              OK
            </Button>
          </View>
        </View>
      </Modal>

      {/* Modal d'erreur */}
      <Modal visible={errorModal} transparent animationType="slide">
        <View style={styles.modalFcontainer}>
          <View style={styles.modalScontainer}>
            <MaterialIcons
              name="error-outline"
              size={90}
              color="orange"
              style={{ marginBottom: 30 }}
            />
            <Text style={{ fontSize: 20, marginBottom: 20 }}>
              Erreur, Veuillez remplir tous les champs correctement.
            </Text>
            <Button
              mode="contained"
              onPress={() => setErrorModal(false)}
              style={{ backgroundColor: 'orange' }}
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
    width: 300,
    height: 300,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default AjouterPa;
