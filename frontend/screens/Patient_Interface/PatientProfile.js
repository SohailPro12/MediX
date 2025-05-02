import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import BottomNav from '../../components/PatientComponents/BottomNav';


export default function PatientProfile({ navigation }) {
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState("Patient's Name");
  const [email, setEmail] = useState("Patient's Email");
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission refusée pour accéder à la galerie.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1,backgroundColor: '#F9FAFB', }}>
      <KeyboardAvoidingView
        style={{ flex: 1 ,}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.navigate('DashboardPatient')}>
                <Ionicons name="chevron-back" size={28} color="#5771f9" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Profile</Text>
              <View style={{ width: 30 }} />
            </View>

            <View style={styles.profileContainer}>
              <View style={{ position: 'relative', marginVertical: 10 }}>
                <Avatar.Image
                  size={120}
                  source={selectedImage ? { uri: selectedImage } : require('../../assets/Patient.jpeg')}
                />
                <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
                  <Ionicons name="create" size={20} color="white" />
                </TouchableOpacity>
              </View>

              {isEdit ? (
                <TextInput value={name} onChangeText={setName} style={styles.textInput} />
              ) : (
                <Text style={styles.name}>{name}</Text>
              )}

              {isEdit ? (
                <TextInput
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.textInput}
                />
              ) : (
                <Text style={styles.email}>{email}</Text>
              )}
            </View>

            <View style={styles.menu}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => setIsEdit(!isEdit)}
              >
                {isEdit ? (
                  <>
                    <Text style={styles.menuText}>Save</Text>
                    <Feather name="check-square" size={24} color="green" />
                  </>
                ) : (
                  <>
                    <Text style={styles.menuText}>Edit</Text>
                    <AntDesign name="edit" size={24} color="green" />
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('ChangePassword')}
              >
                <Text >Change password</Text>
                <FontAwesome name="lock" size={24} color="blue"style={{marginRight:4}} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <Text>Logout</Text>
                <MaterialIcons name="logout" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <BottomNav/>
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex:1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB',
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
  profileContainer: {
    alignItems: 'center',
    marginVertical: 0,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#5771f9',
    borderRadius: 10,
    padding: 5,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    fontSize: 14,
    color: 'gray',
  },
  menu: {
    width: '97%',
    alignSelf: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  menuText: {},
  textInput: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginTop: 8,
  },
/*   bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 60,
    backgroundColor: '#E0E4FF',
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  }, */
});