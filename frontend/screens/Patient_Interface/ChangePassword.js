import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Alert, Modal,StyleSheet,TouchableOpacity,ScrollView,TouchableWithoutFeedback, SafeAreaView ,Platform,Keyboard} from 'react-native';
import { TextInput, Button, Checkbox } from 'react-native-paper';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../../components/PatientComponents/BottomNav';

const ChangePassword = ({navigation}) => {
  const [previouspassword, setPreviousPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successModal, setSuccessModal]=useState(false);
  const [errorModal,setErrorModal]=useState(false);

  const handleRegister = () => {
    if (!previouspassword  || !password || password !== confirmPassword ) {
      setErrorModal(true);
      return;
    }
    setSuccessModal(true);
  };

  return (
    <SafeAreaView style={{ flex: 1,backgroundColor: '#F3F5FF', }}>
      <KeyboardAvoidingView
        style={{ flex: 1 ,}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <TouchableOpacity onPress={()=>navigation.navigate("PatientProfile")}>
                <Ionicons name="chevron-back" size={28} color="#5771f9" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Security</Text>
              <View style={{ width: 30 }} />
            </View>
            <Text style={styles.text}>Change your Password</Text>

            <TextInput label="Previous Password" 
            value={previouspassword} onChangeText={setPreviousPassword} 
            mode="outlined" 
            theme={{ colors: { primary: "#5771f9", underlineColor: 'transparent' } }} 
            style={styles.input}/>

            <TextInput label="Mot de passe" 
            value={password} onChangeText={setPassword}
            mode="outlined" secureTextEntry  
            theme={{ colors: { primary: "#5771f9", underlineColor: 'transparent' } }}
              style={styles.input}/>

            <TextInput label="Confirmer mot de passe" 
            value={confirmPassword} onChangeText={setConfirmPassword} 
            mode="outlined" secureTextEntry  
            theme={{ colors: { primary: "#5771f9", underlineColor: 'transparent' } }} 
            style={styles.input} />


            <Button mode="contained" onPress={handleRegister} style={styles.buttonCr}>Change Password</Button>
      
            <Modal visible={successModal} transparent animationType="slide">
              <View style={styles.modalFcontainer}>
                <View style={styles.modalScontainer}>
                  <AntDesign name="checkcircleo" size={90} color= "#5771f9"style={{marginBottom:30,}}/>
                  <Text style={{ fontSize: 20, marginBottom: 20 }}>Password Changed </Text>
                  <Button mode="contained" onPress={() => setSuccessModal(false)} style={{ backgroundColor:  "#5771f9" }}>OK</Button>
                </View>
              </View>
            </Modal>

            <Modal visible={errorModal} transparent animationType="slide">
              <View style={styles.modalFcontainer}>
                <View style={styles.modalScontainer}>
                  <MaterialIcons name="error-outline" size={90} color="orange"style={{marginBottom:30,}}/>
                  <Text style={{ fontSize: 20, marginBottom: 20 }}>Error. Please Verify your input</Text>
                  <Button mode="contained" onPress={() => setErrorModal(false)} style={{ backgroundColor: 'orange' }}>OK</Button>
                </View>
              </View>
            </Modal>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View style={{paddingHorizontal: 20}}>
        <BottomNav/>
      </View>     
      
    </SafeAreaView>

  );
};

const styles=StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5FF',
    paddingTop: 40,
    paddingHorizontal: 20,
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
  text:{
     fontSize: 16, fontWeight:'400', marginVertical: 20, color:'rgb(135, 132, 132)'
  },
  input:{
    marginTop: 10,backgroundColor:'#E0E4FF' 
  },
  buttonCr:{ 
    marginTop: 40, 
    backgroundColor:"#5771f9" 
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

export default ChangePassword;