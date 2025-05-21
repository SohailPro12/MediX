// screens/Patient/MonDossierMedical.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons, Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import openPdf from "../Doctor_Interface/openPdf";
import { API_URL } from "../../config";

export default function MonDossierMedical() {
  const nav = useNavigation();
  const [loading, setLoading] = useState(true);
  const [dossier, setDossier] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const patientId = await AsyncStorage.getItem("userId");
        const res = await fetch(
          `${API_URL}/api/patient/dossiers/${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Impossible de charger le dossier");
        const data = await res.json();
        setDossier(data);
      } catch (e) {
        Alert.alert("Erreur", e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#5771f9" />
      </View>
    );

  if (!dossier || !dossier.ordonnances?.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Mon Dossier Médical</Text>
        <Text style={{ textAlign: "center", marginTop: 40 }}>
          Aucun dossier trouvé.
        </Text>
      </View>
    );
  }

  const renderOrdonnance = ({ item: ord }) => {
    const doc = ord.MedecinId || {};
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          {doc.Photo ? (
            <Image source={{ uri: doc.Photo }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: "#007AFF" }]} />
          )}
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.maladieName}>{ord.natureMaladie}</Text>
            <Text style={styles.doctorName}>
              Dr. {doc.nom} {doc.prenom}
            </Text>
            <View style={styles.row}>
              <Fontisto name="date" size={14} color="#5771f9" />
              <Text style={styles.infoText}>
                {new Date(ord.date).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => setSelected(ord)}
          >
            <Text style={styles.infoButtonText}>Détails</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#5771f9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon Dossier Médical</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={dossier.ordonnances}
        keyExtractor={(o) => o._id}
        renderItem={renderOrdonnance}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Details Modal */}
      {selected && (
        <Modal
          visible
          transparent
          animationType="slide"
          onRequestClose={() => setSelected(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.modalTitle}>Médicaments</Text>
                {selected.traitement?.medicaments?.length > 0 ? (
                  selected.traitement.medicaments.map((m, i) => (
                    <View key={i} style={styles.detailRow}>
                      <Fontisto
                        name="pills"
                        size={32}
                        color="#5771f9"
                        style={{ marginRight: 10 }}
                      />
                      <View>
                        <Text style={styles.detailText}>
                          <Text style={styles.bold}>Nom: </Text>
                          {m.nom}
                        </Text>
                        <Text style={styles.detailText}>
                          <Text style={styles.bold}>Dosage: </Text>
                          {m.dosage}
                        </Text>
                        {m.periods?.length > 0 && (
                          <Text style={styles.detailText}>
                            <Text style={styles.bold}>Périodes: </Text>
                            {m.periods.join(", ")}
                          </Text>
                        )}
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noneText}>Pas de médicaments</Text>
                )}

                <Text style={[styles.modalTitle, { marginTop: 20 }]}>
                  Analyses
                </Text>
                {selected.analyses?.length > 0 ? (
                  selected.analyses.map((a) => (
                    <View key={a._id} style={styles.detailRow}>
                      <MaterialCommunityIcons
                        name="test-tube"
                        size={32}
                        color="#5771f9"
                        style={{ marginRight: 10 }}
                      />
                      <View>
                        <Text style={styles.detailText}>
                          <Text style={styles.bold}>Nom: </Text>
                          {a.name}
                        </Text>
                        <TouchableOpacity onPress={() => openPdf(a.pdfs?.[0])}>
                          <Text
                            style={[styles.detailText, { color: "#5771f9" }]}
                          >
                            Voir le PDF
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noneText}>Pas d’analyses</Text>
                )}

                <Text style={[styles.modalTitle, { marginTop: 20 }]}>
                  Traitement
                </Text>
                {selected.traitement ? (
                  <View style={styles.detailRow}>
                    <Fontisto
                      name="injection-syringe"
                      size={32}
                      color="#5771f9"
                      style={{ marginRight: 10 }}
                    />
                    <View>
                      <Text style={styles.detailText}>
                        <Text style={styles.bold}>Début: </Text>
                        {new Date(
                          selected.traitement.dateDebut
                        ).toLocaleDateString()}
                      </Text>
                      {selected.traitement.dateFin && (
                        <Text style={styles.detailText}>
                          <Text style={styles.bold}>Fin: </Text>
                          {new Date(
                            selected.traitement.dateFin
                          ).toLocaleDateString()}
                        </Text>
                      )}
                      {selected.traitement.medicaments.map((tm, i) => (
                        <Text key={i} style={styles.detailText}>
                          <Text style={styles.bold}>Médicament: </Text>
                          {tm.nom} ({tm.dosage})
                        </Text>
                      ))}
                      {selected.traitement.observation && (
                        <Text style={styles.detailText}>
                          <Text style={styles.bold}>Obs.: </Text>
                          {selected.traitement.observation}
                        </Text>
                      )}
                    </View>
                  </View>
                ) : (
                  <Text style={styles.noneText}>Pas de traitement</Text>
                )}
              </ScrollView>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelected(null)}
              >
                <Text style={styles.closeButtonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center" },
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  card: {
    backgroundColor: "#E0E4FF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#ccc" },
  maladieName: { fontWeight: "bold", fontSize: 16, color: "#333" },
  doctorName: { color: "#666", marginTop: 4 },
  row: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  infoText: { marginLeft: 6, color: "#666" },
  infoButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#5771f9",
    borderRadius: 20,
    marginLeft: "auto",
  },
  infoButtonText: { color: "#fff", fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    height: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 8,
  },
  detailText: { color: "#444", fontSize: 14 },
  bold: { fontWeight: "600" },
  noneText: { color: "#888", fontStyle: "italic" },
  closeButton: {
    marginTop: 12,
    backgroundColor: "#5771f9",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
});
