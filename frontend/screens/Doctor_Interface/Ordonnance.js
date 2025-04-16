import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Header from '../../components/DoctorComponents/Header';
import openPdf from "./openPdf";

const ordonnances = [
  {
    id: '1',
    patient: 'Jean Dupuis',
    maladies: {
      id: '1',
      nature: 'Grippe',
      date: 'Wednesday, Jun 15, 2025',
      medicaments: [
        { id: '1', name: 'méd1', endDate: '2025-03-27', periods: ['Matin', 'Soir'] },
        { id: '2', name: 'méd2', endDate: '2025-04-27', periods: ['Matin'] },
      ],
      analyses: [
        { id: '1', name: 'anal1', resultats: 'https://www.africau.edu/images/default/sample.pdf' },
      ],
      traitement: 'Faire du sport...'
    },
  },
  {
    id: '2',
    patient: 'Claire Martin',
    maladies: {
      id: '2',
      nature: 'Rhume',
      date: 'Thursday, Jun 16, 2025',
      medicaments: [
        { id: '1', name: 'méd3', endDate: '2025-03-28', periods: ['Soir'] },
      ],
      analyses: [],
      traitement: 'Repos et hydratation.'
    },
  },
];

export default function Ordonnance({ navigation }) {
  const [details, setDetails] = useState(false);
  const [selectedMaladie, setSelectedMaladie] = useState(null);

  const openDetails = (maladie) => {
    setSelectedMaladie(maladie);
    setDetails(true);
  };

  const closeDetails = () => {
    setDetails(false);
    setSelectedMaladie(null);
  };

  const renderOrdonnance = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.patientName}>Patient : {item.patient}</Text>
        <Text style={styles.date}>Date : {item.maladies.date}</Text>
        <Text style={styles.cause}>Nature de maladie : {item.maladies.nature}</Text>
      </View>
      <TouchableOpacity 
        style={styles.detailsButton}
        onPress={() => openDetails(item.maladies)}
      >
        <FontAwesome5 name="eye" size={16} color="white" />
        <Text style={styles.detailsText}> Voir détails</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header name="Mes Ordonnances" screen="DashboardDoctor" />

      <FlatList
        data={ordonnances}
        renderItem={renderOrdonnance}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <Modal visible={details} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedMaladie && (
              <>
                <Text style={styles.modalTitle}>Nature de la maladie</Text>
                <Text style={styles.modalText}>{selectedMaladie.nature}</Text>

                <Text style={styles.modalTitle}>Date de la visite</Text>
                <Text style={styles.modalText}>{selectedMaladie.date}</Text>

                <Text style={styles.modalTitle}>Médicaments</Text>
                {selectedMaladie.medicaments.map((med) => (
                  <View key={med.id} style={{ marginBottom: '4%' }}>
                    <Text style={styles.modalText}>Nom: {med.name}</Text>
                    <Text style={styles.modalText}>Date de fin: {med.endDate}</Text>
                    <Text style={styles.modalText}>Périodes: {med.periods.join(', ')}</Text>
                  </View>
                ))}

                <Text style={styles.modalTitle}>Analyses</Text>
                {selectedMaladie.analyses.map((ana) => (
                  <View key={ana.id} style={{ marginBottom: '4%' }}>
                    <Text style={styles.modalText}>Nom: {ana.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.modalText}>Résultats: {ana.resultats}</Text>
                      <TouchableOpacity onPress={() => openPdf(ana.resultats)}>
                        <AntDesign name="filetext1" size={20} color="blue" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                <Text style={styles.modalTitle}>Traitement</Text>
                <Text style={styles.modalText}>{selectedMaladie.traitement}</Text>

                <TouchableOpacity style={styles.detailsButton} onPress={closeDetails}>
                  <Text style={styles.detailsText}>Fermer</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  header: {
    flexDirection: 'column',
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0876d8',
    margin: 5,
  },
  date: {
    fontSize: 14,
    color: '#777',
    margin: 5,
  },
  cause: {
    fontSize: 14,
    color: 'black',
    margin: 5,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#75E1E5',
    padding: 10,
    borderRadius: 8,
    alignSelf:'center',
    justifyContent:'center',
    width:'95%',
    marginTop: 10,
  },
  detailsText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 2,
  },
});