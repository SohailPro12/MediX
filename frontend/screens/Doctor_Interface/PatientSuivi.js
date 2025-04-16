import React from 'react';
import { View, FlatList, TextInput, StyleSheet} from 'react-native';

import PatientCard from '../../components/DoctorComponents/CurrentPatientCard';
import Header from '../../components/DoctorComponents/Header';
import SearchBar from '../../components/DoctorComponents/SearchBar';
 {/*list des patient pour tester */}
const patients = [
    { id: '1', numero: '1', nom: 'Abdou', prenom: 'Abdou', date_naissance: '01/01/1990', telephone: '+21355555', email: 'abdou@mail.com' },
    { id: '2', numero: '2', nom: 'Dorosu', prenom: 'Doros', date_naissance: '05/06/1985', telephone: '+2187654', email: 'dorosu@mail.com' },
    { id: '3', numero: '3', nom: 'Ahmed', prenom: 'Didou', date_naissance: '12/09/1992', telephone: '+2187754', email: 'ahmed@mail.com' },
    { id: '4', numero: '4', nom: 'Fatima', prenom: 'Fati', date_naissance: '20/07/1988', telephone: '+2128754', email: 'fatima@mail.com' },
  ];

const PatientListScreen = () => {
    return (
      <View style={styles.container}>
         <Header name="Les patient Suivi"  screen="DashboardDoctor"/>
        {/* Barre de recherche */}    
        <SearchBar searchplacehoder="Rechercher un patient..."/>
        {/* Liste des patients */}
        <FlatList
          data={patients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PatientCard patient={item} />}
        />      
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 45,
      padding:'3%',
      backgroundColor: '#F1F5F9',

    },
   
  });
  
  export default PatientListScreen;