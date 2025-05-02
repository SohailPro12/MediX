// screens/Doctor/OrdonnanceList.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import Header from '../../components/DoctorComponents/Header';
import openPdf from './openPdf';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';

export default function OrdonnanceList({ navigation }) {
  const [ordonnances, setOrdonnances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchOrdonnances();
  }, []);

  const fetchOrdonnances = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/api/doctor/ordonnances`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Échec du chargement');
      const data = await res.json();
      setOrdonnances(data);
    } catch (e) {
      console.error('Erreur chargement ordonnances:', e);
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (item) => {
    setSelected(item);
    setModalVisible(true);
  };
  const closeDetails = () => {
    setSelected(null);
    setModalVisible(false);
  };

  const renderOrdonnance = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.patientName}>
        Patient : {item.PatientId.nom} {item.PatientId.prenom}
      </Text>
      <Text style={styles.date}>
        Date : {new Date(item.date).toLocaleDateString()}
      </Text>
      <Text style={styles.cause}>Nature : {item.natureMaladie}</Text>
      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => openDetails(item)}
      >
        <FontAwesome5 name="eye" size={16} color="white" />
        <Text style={styles.detailsText}>Voir détails</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4287f5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header name="Mes Ordonnances" screen="DashboardDoctor" />

      <FlatList
        data={ordonnances}
        renderItem={renderOrdonnance}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            {selected && (
              <>
                <Text style={styles.modalTitle}>Nature</Text>
                <Text style={styles.modalText}>{selected.natureMaladie}</Text>

                <Text style={styles.modalTitle}>Date</Text>
                <Text style={styles.modalText}>
                  {new Date(selected.date).toLocaleString()}
                </Text>

                <Text style={styles.modalTitle}>Médicaments</Text>
                {selected.medicaments.map((med, i) => (
                  <View key={i} style={styles.subBlock}>
                    <Text style={styles.modalText}>Nom : {med.name}</Text>
                    <Text style={styles.modalText}>
                      Fin : {new Date(med.endDate).toLocaleDateString()}
                    </Text>
                    <Text style={styles.modalText}>
                      Périodes : {med.periods.join(', ')}
                    </Text>
                  </View>
                ))}

                <Text style={styles.modalTitle}>Traitement</Text>
                {selected.traitement && (
                  <View style={styles.subBlock}>
                    <Text style={styles.modalText}>
                      Début : {new Date(selected.traitement.dateDebut).toLocaleDateString()}
                    </Text>
                    {selected.traitement.dateFin && (
                      <Text style={styles.modalText}>
                        Fin : {new Date(selected.traitement.dateFin).toLocaleDateString()}
                      </Text>
                    )}
                    <Text style={styles.modalText}>
                      Obs. : {selected.traitement.observation}
                    </Text>
                    {selected.traitement.medicaments.map((m, j) => (
                      <Text key={j} style={styles.modalText}>
                        • {m.nom} ({m.dosage})
                      </Text>
                    ))}
                  </View>
                )}

                <Text style={styles.modalTitle}>Analyses</Text>
                {selected.analyses.map((ana, k) => (
                  <View key={ana._id} style={styles.subBlock}>
                    <Text style={styles.modalText}>
                      Date : {new Date(ana.date).toLocaleDateString()}
                    </Text>
                    <Text style={styles.modalText}>
                      Lab : {ana.laboratoire.nom}
                    </Text>
                    <Text style={styles.modalText}>
                      Obs. : {ana.observation}
                    </Text>
                    {ana.pdfs.map((url, u) => (
                      <TouchableOpacity
                        key={u}
                        style={styles.pdfRow}
                        onPress={() => openPdf(url)}
                      >
                        <Text style={styles.modalText}>{url}</Text>
                        <AntDesign name="filetext1" size={20} color="blue" />
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}

                <TouchableOpacity
                  style={[styles.detailsButton, { marginTop: 20 }]}
                  onPress={closeDetails}
                >
                  <Text style={styles.detailsText}>Fermer</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  patientName: { fontSize: 18, fontWeight: '600', color: '#0876d8' },
  date: { fontSize: 14, color: '#777', marginTop: 4 },
  cause: { fontSize: 14, color: '#333', marginTop: 4 },
  detailsButton: {
    flexDirection: 'row',
    backgroundColor: '#75E1E5',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    justifyContent: 'center',
  },
  detailsText: { color: 'white', marginLeft: 8 },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16 },
  modalText: { fontSize: 16, marginTop: 4 },
  subBlock: { marginLeft: 8, marginTop: 8 },
  pdfRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
});
