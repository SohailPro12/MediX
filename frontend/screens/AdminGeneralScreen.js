import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const AdminGeneralScreen = ({ navigation }) => {
    const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{t("General")}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.profile}>
          <Image
            source={{ uri: 'https://picsum.photos/200/300' }}
            style={styles.avatar}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>Admin's Name</Text>
            <Text style={styles.email}>admin@email.com</Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => console.log('Liste des médecins')}
          >
            <Text onPress={()=> navigation.navigate("DoctorList")} style={styles.menuText}>{t("Liste des médecins")}</Text>
            <Icon name="chevron-forward" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => console.log('Ajouter un médecin')}
          >
            <Text onPress={() => navigation.navigate("AddDoctor")} style={styles.menuText}>{t("Ajouter un médecin")}</Text>
            <Icon name="chevron-forward" size={24} color="#000" />
          </TouchableOpacity>

      

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => console.log('Problèmes techniques')}
          >
            <Text onPress={() => navigation.navigate("ProblemesScreen")} style={styles.menuText}>{t("Problèmes techniques")}</Text>
            <Icon name="chevron-forward" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4', // Subtle background color for better contrast
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff', // Keeps header clean and distinguished
    borderBottomWidth: 1,
    borderBottomColor: '#ddd', // Divider for header
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#333', // Dark color for text for readability
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  profile: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40, // Larger avatar size
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#ddd', // Border around avatar for emphasis
  },
  nameContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Darker color for name
  },
  email: {
    fontSize: 14,
    color: '#888', // Lighter color for email
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // Light border between menu items
    paddingHorizontal: 16,
    backgroundColor: '#fff', // Ensure each item stands out
    borderRadius: 8, // Slight border radius for buttons
  },
  menuText: {
    fontSize: 16,
    color: '#333', // Ensures text visibility and contrast
    flex: 1,
  },
});

export default AdminGeneralScreen;
