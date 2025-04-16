import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Alert, Modal,StyleSheet } from 'react-native';
import { TextInput, Button, Checkbox } from 'react-native-paper';
import AntDesign from '@expo/vector-icons/AntDesign';
import Header from '../../components/DoctorComponents/Header';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const AjouterPa = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [successModal, setSuccessModal]=useState(false);
  const [errorModal,setErrorModal]=useState(false);

  const handleRegister = () => {
    if (!name || !email || !password || password !== confirmPassword || !checked) {
      setErrorModal(true);
      return;
    }
    setSuccessModal(true);
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Header name='Ajouter un Patient' screen='SettingsDScreen'/>
      <Text style={styles.text}>Créer un compte pour un nouveau patient</Text>

      <TextInput label="Nom" 
      value={name} onChangeText={setName} 
      mode="outlined" 
      theme={{ colors: { primary: '#75E1E5', underlineColor: 'transparent' } }} 
      style={styles.input}/>

      <TextInput label="Adresse mail"
       value={email} onChangeText={setEmail} 
       mode="outlined" 
       keyboardType="email-address" 
       theme={{ colors: { primary: '#75E1E5', underlineColor: 'transparent' } }} 
       style={styles.input} />

      <TextInput label="Mot de passe" 
      value={password} onChangeText={setPassword}
       mode="outlined" secureTextEntry  
       theme={{ colors: { primary: '#75E1E5', underlineColor: 'transparent' } }}
        style={styles.input}/>

      <TextInput label="Confirmer mot de passe" 
      value={confirmPassword} onChangeText={setConfirmPassword} 
      mode="outlined" secureTextEntry  
      theme={{ colors: { primary: '#75E1E5', underlineColor: 'transparent' } }} 
      style={styles.input} />

      <View style={styles.checkboxContainer}>
        <Checkbox status={checked ? 'checked' : 'unchecked'} onPress={() => setChecked(!checked)} color='#75E1E5'/>
        <Text>Confirmez-vous que les données saisies sont correctes ?</Text>
      </View>

      <Button mode="contained" onPress={handleRegister} style={styles.buttonCr}>Créer un compte</Button>
      
      <Modal visible={successModal} transparent animationType="slide">
        <View style={styles.modalFcontainer}>
          <View style={styles.modalScontainer}>
            <AntDesign name="checkcircleo" size={90} color="#75E1E5"style={{marginBottom:30,}}/>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>Compte créé avec succès</Text>
            <Button mode="contained" onPress={() => setSuccessModal(false)} style={{ backgroundColor: '#75E1E5' }}>OK</Button>
          </View>
        </View>
      </Modal>

      <Modal visible={errorModal} transparent animationType="slide">
        <View style={styles.modalFcontainer}>
          <View style={styles.modalScontainer}>
            <MaterialIcons name="error-outline" size={90} color="orange"style={{marginBottom:30,}}/>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>Erreur, Veuillez remplir tous les champs correctement.</Text>
            <Button mode="contained" onPress={() => setErrorModal(false)} style={{ backgroundColor: 'orange' }}>OK</Button>
          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
};

const styles=StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingVertical: '12%',
  },
  text:{
     fontSize: 16, fontWeight:'400', marginVertical: 20, color:'rgb(135, 132, 132)'
  },
  input:{
    marginTop: 10,backgroundColor:'rgb(244, 254, 252)' 
  },
  buttonCr:{ 
    marginTop: 10, 
    backgroundColor:'#75E1E5'
  },
  checkboxContainer:{
     flexDirection: 'row', alignItems: 'center', marginVertical: 20 
  },
  modalFcontainer:{
     flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  modalScontainer:{ 
    width: 300, height:300,justifyContent: 'center',
    padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' 
  }
})

export default AjouterPa;