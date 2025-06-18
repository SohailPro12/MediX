// screens/Doctor/OrdonnanceList.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Header from "../../components/DoctorComponents/Header";
import openPdf from "./openPdf";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";

export default function OrdonnanceList({ navigation }) {
  const { t } = useTranslation();
  const [ordonnances, setOrdonnances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchOrdonnances();
  }, []);

  const fetchOrdonnances = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/api/doctor/ordonnances`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(t("doctor.ordonnances.loadError"));
      const data = await res.json();
      setOrdonnances(data);
    } catch (e) {
      console.error("Erreur chargement ordonnances:", e);
      Alert.alert(t("common.error"), t("doctor.ordonnances.loadError"));
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
  const confirmDelete = (id) => {
    Alert.alert(
      t("doctor.ordonnances.deleteConfirmation.title"),
      t("doctor.ordonnances.deleteConfirmation.message"),
      [
        {
          text: t("doctor.ordonnances.deleteConfirmation.cancel"),
          style: "cancel",
        },
        {
          text: t("doctor.ordonnances.deleteConfirmation.delete"),
          style: "destructive",
          onPress: () => handleDelete(id),
        },
      ]
    );
  };

  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/api/doctor/ordonnances/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(t("doctor.ordonnances.deleteError"));
      // on rafraîchit la liste
      setOrdonnances((prev) => prev.filter((o) => o._id !== id));
      Alert.alert(t("common.success"), t("doctor.ordonnances.deleteSuccess"));
    } catch (e) {
      console.error("Erreur suppression ordonnance:", e);
      Alert.alert(t("common.error"), t("doctor.ordonnances.deleteError"));
    }
  };
  const renderOrdonnance = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.patientName}>
        {t("doctor.ordonnances.patient")} : {item.PatientId.nom}
        {item.PatientId.prenom}
      </Text>
      <Text style={styles.date}>
        {t("doctor.ordonnances.date")} :
        {new Date(item.date).toLocaleDateString()}
      </Text>
      <Text style={styles.cause}>
        {t("doctor.ordonnances.nature")} : {item.natureMaladie}
      </Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => openDetails(item)}
        >
          <FontAwesome5 name="eye" size={16} color="white" />
          <Text style={styles.detailsText}>{t("doctor.ordonnances.view")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() =>
            navigation.navigate("AddOrdonnanceScreen", {
              ordonnanceId: item._id,
            })
          }
        >
          <AntDesign name="edit" size={16} color="white" />
          <Text style={styles.detailsText}>{t("doctor.ordonnances.edit")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => confirmDelete(item._id)}
        >
          <AntDesign name="delete" size={16} color="white" />
          <Text style={styles.detailsText}>
            {t("doctor.ordonnances.delete")}
          </Text>
        </TouchableOpacity>
      </View>
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
      <Header name={t("doctor.ordonnances.title")} screen="DashboardDoctor" />

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
                <Text style={styles.modalTitle}>
                  {t("doctor.ordonnances.details.nature")}
                </Text>
                <Text style={styles.modalText}>{selected.natureMaladie}</Text>

                <Text style={styles.modalTitle}>
                  {t("doctor.ordonnances.details.date")}
                </Text>
                <Text style={styles.modalText}>
                  {new Date(selected.date).toLocaleString()}
                </Text>

                <Text style={styles.modalTitle}>
                  {t("doctor.ordonnances.details.treatment")}
                </Text>
                {selected.traitement && (
                  <View style={styles.subBlock}>
                    <Text style={styles.modalText}>
                      {t("doctor.ordonnances.details.startDate")} :
                      {new Date(
                        selected.traitement.dateDebut
                      ).toLocaleDateString()}
                    </Text>
                    {selected.traitement.dateFin && (
                      <Text style={styles.modalText}>
                        {t("doctor.ordonnances.details.endDate")} :
                        {new Date(
                          selected.traitement.dateFin
                        ).toLocaleDateString()}
                      </Text>
                    )}
                    <Text style={styles.modalText}>
                      {t("doctor.ordonnances.details.observation")} :
                      {selected.traitement.observation}
                    </Text>
                    {selected.traitement.medicaments.map((m, j) => (
                      <Text key={j} style={styles.modalText}>
                        • {m.nom} ({m.dosage})
                      </Text>
                    ))}
                  </View>
                )}

                <Text style={styles.modalTitle}>
                  {t("doctor.ordonnances.details.analyses")}
                </Text>
                {selected.analyses.map((ana) => (
                  <View key={ana._id} style={styles.subBlock}>
                    <Text style={styles.modalText}>
                      {t("doctor.ordonnances.details.date")} :
                      {new Date(ana.date).toLocaleDateString()}
                    </Text>
                    <Text style={styles.modalText}>
                      {t("doctor.ordonnances.details.laboratory")} :
                      {ana.laboratoire.nom}
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
                  <Text style={styles.detailsText}>{t("common.close")}</Text>
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
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  patientName: { fontSize: 18, fontWeight: "600", color: "#0876d8" },
  date: { fontSize: 14, color: "#777", marginTop: 4 },
  cause: { fontSize: 14, color: "#333", marginTop: 4 },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionBtn: {
    flexDirection: "row",
    backgroundColor: "#75E1E5",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 4,
  },
  editBtn: { backgroundColor: "#4287f5" },
  deleteBtn: { backgroundColor: "#e74c3c" },
  detailsText: { color: "white", marginLeft: 6, fontSize: 14 },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    maxHeight: "90%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginTop: 16 },
  modalText: { fontSize: 16, marginTop: 4 },
  subBlock: { marginLeft: 8, marginTop: 8 },
  pdfRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  detailsButton: {
    flexDirection: "row",
    backgroundColor: "#75E1E5",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    justifyContent: "center",
  },
});
