// PrescriptionScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback,
  Keyboard, ScrollView, StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import Header from '../../components/DoctorComponents/Header';
import PatientCard from '../../components/DoctorComponents/PatientCard';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';

const PrescriptionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const patient = route.params?.patient;

  const [nature, setnature] = useState('');
  const [visitDate, setVisitDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [medications, setMedications] = useState([]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedEndDate, setNewMedEndDate] = useState(undefined);
  const [newMedPeriods, setNewMedPeriods] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [newAnalysisName, setNewAnalysisName] = useState('');
  const [newAnalysisResults, setNewAnalysisResults] = useState(null);
  const [traitement, setTraitement] = useState('');

  useEffect(() => {
    const maladieIncomplète = route.params?.maladieIncomplète;
    if (maladieIncomplète) {
      setnature(maladieIncomplète.nature);
      setVisitDate(new Date(maladieIncomplète.date));
      setMedications(maladieIncomplète.medicaments || []);
      setAnalyses(maladieIncomplète.analyses || []);
      setTraitement(maladieIncomplète.traitement || '');
    }
  }, []);


  const selectPeriod = (period) => {
    setNewMedPeriods(prev => (
      prev.includes(period) ? prev.filter(p => p !== period) : [...prev, period]
    ));
  };

  const addMedication = () => {
    if (newMedName) {
      const newMed = {
        id: `${medications.length + 1}`,
        name: newMedName,
        endDate: newMedEndDate ? newMedEndDate.toDateString() : null,
        periods: newMedPeriods,
      };
      setMedications([...medications, newMed]);
      setNewMedName('');
      setNewMedEndDate(undefined);
      setNewMedPeriods([]);
    }
  };

 const addAnalysis = () => {
    if (newAnalysisName) {
      const newAnalysis = {
        id: `${analyses.length + 1}`,
        name: newAnalysisName,
        results: newAnalysisResults,
      };
      setAnalyses([...analyses, newAnalysis]);
      setNewAnalysisName('');
      setNewAnalysisResults(null);
    }
  };

  const handleAddResults = async (id) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });

      if (result?.assets?.length > 0) {
        const file = result.assets[0];
        const newResults = {
          uri: file.uri,
          name: file.name,
          type: file.mimeType,
        };

        setAnalyses(prev =>
          prev.map(a =>
            a.id === id ? { ...a, results: newResults } : a
          )
        );
      }
    } catch (error) {
      console.log("Erreur document:", error);
    }
  };

  const savePatientData = () => {
    const updatedMaladie = {
      id: route.params?.maladieIncomplète?.id || Date.now().toString(), // si existante, garder le même ID
      nature,
      date: visitDate.toDateString(),
      medicaments: medications,
      analyses: analyses.map(a => ({
        ...a,
        resultats: a.results?.uri || "Aucun fichier",
      })),
      traitement,
    };
  
    let updatedMaladies = [];
  
    // Si c'est une mise à jour d'une maladie existante
    if (route.params?.maladieIncomplète) {
      updatedMaladies = patient.maladies.map(m =>
        m.id === updatedMaladie.id ? updatedMaladie : m
      );
    } else {
      // Sinon, ajout d'une nouvelle maladie
      updatedMaladies = patient.maladies
        ? [...patient.maladies, updatedMaladie]
        : [updatedMaladie];
    }
  
    const updatedPatient = {
      ...patient,
      lastVisit: visitDate.toDateString(),
      maladies: updatedMaladies,
    };
  
    navigation.navigate('DossiersM', {
      updatedMaladie,
      patient: updatedPatient,
    });
  };
  

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Header name="Ordonnance" screen='PatientList' />
      <PatientCard patient={patient} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView contentContainerStyle={styles.inner}>
          <Text>Nature de maladie</Text>
          <TextInput value={nature} onChangeText={setnature} placeholder="Nom de maladie" style={styles.input} />

          <Text>Date de la visite</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
            <Text>{visitDate.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={visitDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setVisitDate(selectedDate);
              }}
            />
          )}

          {/* Médicament */}
          <Text style={styles.sectionTitle}>Ajouter un médicament</Text>
          <TextInput
            value={newMedName}
            onChangeText={setNewMedName}
            placeholder="Nom du médicament"
            style={styles.input}
          />
          <Text>Fin de consommation</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
            <Text>{newMedEndDate ? newMedEndDate.toDateString() : 'Non défini'}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={newMedEndDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setNewMedEndDate(selectedDate);
              }}
            />
          )}

          <Text>Périodes de prise</Text>
          <View style={styles.periodsContainer}>
            {['Matin', 'Après Midi', 'Soir'].map(period => (
              <TouchableOpacity
                key={period}
                onPress={() => selectPeriod(period)}
                style={[styles.periodButton, {
                  backgroundColor: newMedPeriods.includes(period) ? '#75E1E5' : 'gray'
                }]}>
                <Text style={styles.periodText}>{period}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button mode="contained" onPress={addMedication} style={{ backgroundColor: '#75E1E5' }}>Ajouter médicament</Button>

          {/* Liste des médicaments */}
          <Text style={styles.sectionTitle}>Médicaments ajoutés</Text>
              <FlatList
              scrollEnabled={false}
              data={medications}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                <Text>{item.name || 'Médicament sans nom'}</Text>
                <Text>{item.endDate ? `Fin: ${item.endDate.toString()}` : 'Fin: Non définie'}</Text>
                <Text>{`Périodes: ${item.periods?.join(', ') || 'Aucune période définie'}`}</Text>
              </View>
              )}
            />

          {/* Analyses */}
          <Text style={styles.sectionTitle}>Ajouter une analyse</Text>
          <TextInput
            value={newAnalysisName}
            onChangeText={setNewAnalysisName}
            placeholder="Nom de l'analyse"
            style={styles.input}
          />
          <Button mode="contained" onPress={addAnalysis} style={{ backgroundColor: '#75E1E5' }}>Ajouter analyse</Button>

          {/* Liste des analyses */}
          <Text style={styles.sectionTitle}>Analyses ajoutées</Text>
          <FlatList
            scrollEnabled={false}
            data={analyses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text>{item.name || 'Analyse sans nom'}</Text>
                {item.results ? (
                  <View style={styles.resultsContainer}>
                    <Text>{item.results?.name || 'Fichier sans nom'}</Text>
                    <Ionicons name="checkmark-circle" size={24} color="green" />
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => handleAddResults(item.id)}>
                    <Text>Ajouter les résultats</Text>
                    <Ionicons name="cloud-upload" size={24} color="blue" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          />

          {/* Traitement */}
          <Text style={styles.sectionTitle}>Traitement</Text>
          <TextInput
            value={traitement}
            onChangeText={setTraitement}
            placeholder="Description du traitement"
            style={styles.input}
          />

          {/* Sauvegarde */}
          <Button mode="contained" onPress={savePatientData} style={{ marginTop: '5%' }}>Sauvegarder</Button>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingVertical: '12%' },
  inner: { paddingBottom: 20 },
  input: { borderWidth: 1, padding: 10, borderRadius: 5, marginVertical: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15 },
  periodsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  periodButton: { padding: 10, borderRadius: 5 },
  periodText: { color: 'white' },
  itemContainer: { marginVertical: 5, padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 10 },
});

export default PrescriptionScreen;