import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import DoctorCard from '../../components/PatientComponents/DoctorCard';
import { FontAwesome5 } from '@expo/vector-icons';
import SearchBar from '../../components/PatientComponents/SearchBar';
import Header from '../../components/PatientComponents/Header';
import BottomNav from '../../components/PatientComponents/BottomNav';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "../../config";



const fetchMedecinsBySSO = async (sso) => {
  try {
    const response = await fetch(`${API_URL}/api/patient/getAllMedecins/${sso}`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération");
    }
    const data = await response.json();
    return data; // tableau de médecins
  } catch (error) {
    console.error("Erreur lors du fetch des médecins:", error);
    throw error;
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        
        const storedSSO = await AsyncStorage.getItem('ssoCode');
        if (!storedSSO) {
          console.warn("SSO manquant dans le stockage");
          return;
        }

        const data = await fetchMedecinsBySSO(storedSSO);
        setDoctors(data);
      } catch (error) {
        console.error("Erreur lors du chargement des médecins:", error);
      }
    };

    loadDoctors();
  }, []);



  const categories = [
    { id: 1, name: 'Tous', icon: 'stethoscope' },
    { id: 2, name: 'Généraliste', icon: 'user-md' },
    { id: 3, name: 'Cardiologue', icon: 'heart' },
    { id: 4, name: 'Dentiste', icon: 'tooth' },
    { id: 5, name: 'Pédiatre', icon: 'baby' },
    { id: 6, name: 'Dermatologue', icon: 'skin' },
    { id: 7, name: 'Ophtalmologue', icon: 'eye' },
  ];


  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch =
      doctor.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialite.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Tous' || doctor.specialite.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <View style={styles.containerV}>
       <Header param="Chercher Doctor" rja3="DashboardPatient"/>
    <ScrollView style={styles.container}>
      {/* Search Bar */}
   <SearchBar/>
  
      {/* Categories */}
      <View style={styles.categoriesContainer}>
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                isSelected && styles.selectedCategoryCard,
              ]}
              onPress={() => handleCategorySelect(category.name)}
            >
              <View style={[
                styles.iconContainer,
                isSelected && styles.selectedIconContainer
              ]}>
                <FontAwesome5
                  name={category.icon}
                  size={20}
                  color={isSelected ? '#fff' : '#3498db'}
                />
              </View>
              <Text style={[
                styles.categoryLabel,
                isSelected && styles.selectedCategoryLabel
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Doctors List */}
      <Text style={styles.sectionTitle}>Médecins disponibles</Text>

      {filteredDoctors.length === 0 ? (
        <View style={styles.noDoctorsContainer}>
          <Text style={styles.noDoctorsText}>Aucun médecin trouvé.</Text>
        </View>
      ) : (
        <View>
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor._id}
              _id={doctor._id}
              name={`Dr. ${doctor.nom} ${doctor.prenom}`}
              specialty={doctor.specialite}
              address={doctor.adresse||""}
              email={doctor.mail}
              telephone={doctor.telephone}
              availability={doctor.disponibilite}
              image={doctor.Photo}
              formation={doctor.formation}
              about={doctor.description}
              experience={doctor.experience}
            />
          ))}
        </View>
      )}
    </ScrollView>
      {/* Barre de navigation inférieure */}
          <BottomNav/>
    </View>
  );
};

const styles = StyleSheet.create({
  containerV: { flex: 1, backgroundColor: '#F9FAFB' },
  container: {
flex:1,
    backgroundColor: '#f8f8f8',
    flexGrow: 1 
  },

  searchInput: {
    height: 45,
    borderRadius: 13,
    backgroundColor: '#fff',
    paddingLeft: 15,
    fontSize: 14,
    elevation: 5,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 7,
    marginBottom: 20,
  },
  categoryCard: {
    width: '24%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  selectedCategoryCard: {
    borderColor: '#3498db',
    backgroundColor: '#e6f0fa',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6f0fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  selectedIconContainer: {
    backgroundColor: '#3498db',
  },
  categoryLabel: {
    fontSize: 10,
    color: '#333',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  noDoctorsContainer:{
  marginTop:80,
  alignItems:"center"
  },
  noDoctorsText:{
  fontSize:16,
  fontFamily:"serif"
  }
});

export default App;
