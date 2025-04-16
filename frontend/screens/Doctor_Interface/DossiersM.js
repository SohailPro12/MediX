// DossiersM.js
import Header from "../../components/DoctorComponents/Header";
import PatientCard from "../../components/DoctorComponents/PatientCard";
import { View, StyleSheet, TouchableOpacity, Text, Modal } from "react-native";
import { useEffect, useState } from "react";
import MenuMald from "../../components/DoctorComponents/MenuMald";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRoute } from '@react-navigation/native';
import openPdf from "./openPdf";

const DossiersM = ({ navigation }) => {
  const route = useRoute();
  const passedPatient = route.params?.patient;
  const updatedMaladie = route.params?.updatedMaladie;
  const patientId = route.params?.patientId;

  const [patientData, setPatientData] = useState(passedPatient);
  const [selectedMaladie, setSelectedMaladie] = useState(null);

  useEffect(() => {
    if (updatedMaladie && patientData.id === patientId) {
      setPatientData((prev) => ({
        ...prev,
        lastVisit: route.params?.patient?.lastVisit || prev.lastVisit, // Conserve la nouvelle date
        maladies: prev.maladies ? [...prev.maladies, updatedMaladie] : [updatedMaladie],
      }));
    }
  }, [updatedMaladie, patientId]);

  return (
    <View style={styles.container}>
      <Header name="Dossier Médical" screen='PatientList' />
      <PatientCard patient={patientData} isClickable={false} />
      <MenuMald patient={patientData} setSelectedMaladie={setSelectedMaladie} />

      <Modal visible={!!selectedMaladie} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedMaladie && (
              <>
                <Text style={styles.modalTitle}>Nature de la maladie</Text>
                <Text style={styles.modalText}>{selectedMaladie.nature}</Text>

                <Text style={styles.modalTitle}>Date de la visite</Text>
                <Text style={styles.modalDate}>{selectedMaladie.date}</Text>

                <Text style={styles.modalTitle}>Médicaments</Text>
                {selectedMaladie.medicaments.map((med, index) => (
                  <View key={index} style={{ marginBottom: '4%' }}>
                    <Text style={styles.modalText}>Nom: {med.name}</Text>
                    <Text style={styles.modalText}>Date de fin: {med.endDate}</Text>
                    <Text style={styles.modalText}>Périodes: {med.periods.join(", ")}</Text>
                  </View>
                ))}

                <Text style={styles.modalTitle}>Analyses</Text>
                {selectedMaladie.analyses.map((ana, index) => (
                  <View key={index} style={{ marginBottom: '4%' }}>
                    <Text style={styles.modalText}>Nom: {ana.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: "center" }}>
                      <Text style={styles.modalText}>Résultats: {ana.resultats}</Text>
                      <TouchableOpacity onPress={() => openPdf(ana.resultats)}>
                        <AntDesign name="filetext1" size={20} color="blue" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                <Text style={styles.modalTitle}>Traitement</Text>
                <Text style={styles.modalText}>{selectedMaladie.traitement}</Text>

                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedMaladie(null)}>
                  <Text style={styles.closeButtonText}>Fermer</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("PrescriptionScreen", { patient: patientData })}
      >
        <AntDesign name="plus" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingVertical: '12%' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  modalDate: { fontSize: 16, color: "#666", marginBottom: 10 },
  modalText: { fontSize: 14, color: "#444", marginLeft: '4%' },
  closeButton: { marginTop: 20, padding: 10, backgroundColor: '#75E1E5', borderRadius: 5, alignItems: 'center' },
  closeButtonText: { color: '#fff', fontWeight: 'bold' },
  addButton: {
    backgroundColor: '#75E1E5',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 58,
    height: 58,
    position: 'absolute',
    bottom: '3%',
    right: '8%',
  },
});

export default DossiersM;