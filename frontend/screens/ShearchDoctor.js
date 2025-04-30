import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import DoctorCard from './DoctorCard';
import { FontAwesome5 } from '@expo/vector-icons'; // ou 'react-native-vector-icons/FontAwesome5'
import SearchBar from '../SearchBar';
const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const categories = [
    { id: 1, name: 'Tous', icon: 'stethoscope' },
    { id: 2, name: 'Généraliste', icon: 'user-md' },
    { id: 3, name: 'Cardiologue', icon: 'heart' },
    { id: 4, name: 'Dentiste', icon: 'tooth' },
    { id: 5, name: 'Pédiatre', icon: 'baby' },
    { id: 6, name: 'Dermatologue', icon: 'skin' },
    { id: 7, name: 'Ophtalmologue', icon: 'eye' },
  ];

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sophie Martin',
      specialty: 'Généraliste',
      address: '15 Rue de la Santé, Paris',
      availability: 'Disponible aujourd\'hui',
      imageUrl: require('../../assets/doctor.png'),
    },
    {
      id: 2,
      name: 'Dr. Jean Dupont',
      specialty: 'Cardiologue',
      address: '8 Avenue des Médecins, Lyon',
      availability: 'Disponible demain',
      imageUrl: require('../../assets/Doctor2.png'),
    },
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Tous' || doctor.specialty === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
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
              key={doctor.id}
              name={doctor.name}
              specialty={doctor.specialty}
              address={doctor.address}
              availability={doctor.availability}
              imageUrl={doctor.imageUrl}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:49,
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchContainer: {
    paddingHorizontal: 10,
    marginTop: 70,
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
    marginTop: 20,
    marginBottom: 20,
  },
  categoryCard: {
    width: '24%', // 5 catégories par ligne
    aspectRatio: 1, // carré
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

});

export default App;
