import React, { useState } from 'react';
import { 
  View, 
  Text, 
  KeyboardAvoidingView, 
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback, 
  SafeAreaView,
  Platform,
  Keyboard
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../../components/PatientComponents/BottomNav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "../../config";

const ChangePassword = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    // Validation des champs
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage('Tous les champs sont obligatoires');
      setErrorModal(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Les nouveaux mots de passe ne correspondent pas');
      setErrorModal(true);
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Le mot de passe doit contenir au moins 6 caractères');
      setErrorModal(true);
      return;
    }

    setIsLoading(true);
    
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      const response = await fetch(`${API_URL}/api/patient/EditProfile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: currentPassword,
          newPassword: newPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Échec du changement de mot de passe');
      }

      // Réinitialisation des champs
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessModal(true);
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage(error.message || 'Une erreur est survenue lors du changement de mot de passe');
      setErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={styles.container} 
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={28} color="#5771f9" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Changer le mot de passe</Text>
              <View style={{ width: 30 }} />
            </View>

            <Text style={styles.subTitle}>Veuillez entrer vos informations</Text>

            <TextInput 
              label="Mot de passe actuel" 
              value={currentPassword} 
              onChangeText={setCurrentPassword} 
              mode="outlined" 
              secureTextEntry
              theme={{ colors: { primary: "#5771f9" } }} 
              style={styles.input}
              left={<TextInput.Icon name="lock" />}
            />

            <TextInput 
              label="Nouveau mot de passe" 
              value={newPassword} 
              onChangeText={setNewPassword}
              mode="outlined" 
              secureTextEntry  
              theme={{ colors: { primary: "#5771f9" } }}
              style={styles.input}
              left={<TextInput.Icon name="lock-reset" />}
            />

            <TextInput 
              label="Confirmer le nouveau mot de passe" 
              value={confirmPassword} 
              onChangeText={setConfirmPassword} 
              mode="outlined" 
              secureTextEntry  
              theme={{ colors: { primary: "#5771f9" } }} 
              style={styles.input}
              left={<TextInput.Icon name="lock-check" />}
            />

            <Button 
              mode="contained" 
              onPress={handleChangePassword} 
              style={styles.button}
              loading={isLoading}
              disabled={isLoading}
              labelStyle={styles.buttonLabel}
            >
              {isLoading ? 'Traitement...' : 'Mettre à jour le mot de passe'}
            </Button>
      
            {/* Modal de succès */}
            <Modal visible={successModal} transparent animationType="fade">
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <AntDesign name="checkcircle" size={90} color="#4BB543" style={styles.modalIcon}/>
                  <Text style={styles.modalTitle}>Succès</Text>
                  <Text style={styles.modalText}>Votre mot de passe a été changé avec succès</Text>
                  <Button 
                    mode="contained" 
                    onPress={() => {
                      setSuccessModal(false);
                      navigation.goBack();
                    }} 
                    style={styles.modalButton}
                    labelStyle={{ color: 'white' }}
                  >
                    OK
                  </Button>
                </View>
              </View>
            </Modal>

            {/* Modal d'erreur */}
            <Modal visible={errorModal} transparent animationType="fade">
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <MaterialIcons name="error-outline" size={90} color="#FF0033" style={styles.modalIcon}/>
                  <Text style={styles.modalTitle}>Erreur</Text>
                  <Text style={styles.modalText}>{errorMessage}</Text>
                  <Button 
                    mode="contained" 
                    onPress={() => setErrorModal(false)} 
                    style={[styles.modalButton, { backgroundColor: '#FF0033' }]}
                    labelStyle={{ color: 'white' }}
                  >
                    OK
                  </Button>
                </View>
              </View>
            </Modal>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      
      <BottomNav/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F5FF',
  },
  keyboardView: {
    flex: 1,
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
  subTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#5771f9',
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  modalButton: {
    width: '100%',
    backgroundColor: '#5771f9',
    borderRadius: 8,
  },
});

export default ChangePassword;