import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import Header from "../../components/DoctorComponents/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function AddOrdonnanceScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { appointmentId } = route.params || {};

  const [loading, setLoading] = useState(false);
  // Ordonnance
  const [patient, setPatient] = useState("");
  const [date, setDate] = useState("");
  const [nature, setNature] = useState("");

  // Traitement
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [traitementObservation, setTraitementObservation] = useState("");
  const [traitMedicaments, setTraitMedicaments] = useState([]);

  // Analyses
  const [analyses, setAnalyses] = useState([]);

  useEffect(() => {
    if (appointmentId) {
      (async () => {
        try {
          const token = await AsyncStorage.getItem("authToken");
          const res = await fetch(
            `${API_URL}/api/doctor/appointments/${appointmentId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const appt = await res.json();
          setPatient(`${appt.PatientId.nom} ${appt.PatientId.prenom}`);
          setDate(new Date(appt.date).toISOString().slice(0, 10)); // YYYY-MM-DD
          setNature(appt.observation || "");
        } catch (e) {
          console.error("Erreur fetch RDV:", e);
        }
      })();
    }
  }, [appointmentId]);

  // — Traitement dynamiques
  const addTraitMed = () =>
    setTraitMedicaments((m) => [...m, { nom: "", dosage: "" }]);
  const updateTraitMed = (i, field, v) =>
    setTraitMedicaments((m) =>
      m.map((x, idx) => (idx === i ? { ...x, [field]: v } : x))
    );
  const removeTraitMed = (i) =>
    setTraitMedicaments((m) => m.filter((_, idx) => idx !== i));

  // — Analyses dynamiques
  const addAnalyse = () =>
    setAnalyses((a) => [
      ...a,
      {
        date: "",
        laboratoire: { nom: "", adresse: "", telephone: "", email: "" },
        observation: "",
        pdfs: [""],
      },
    ]);
  const updateAnalyseField = (i, field, v) =>
    setAnalyses((a) =>
      a.map((x, idx) => (idx === i ? { ...x, [field]: v } : x))
    );
  const updateAnalLabField = (i, field, v) =>
    setAnalyses((a) =>
      a.map((x, idx) =>
        idx === i
          ? { ...x, laboratoire: { ...x.laboratoire, [field]: v } }
          : x
      )
    );
  const addPdfLink = (i) =>
    setAnalyses((a) =>
      a.map((x, idx) =>
        idx === i ? { ...x, pdfs: [...x.pdfs, ""] } : x
      )
    );
  const updatePdfLink = (i, pidx, v) =>
    setAnalyses((a) =>
      a.map((x, idx) =>
        idx === i
          ? {
              ...x,
              pdfs: x.pdfs.map((link, j) => (j === pidx ? v : link)),
            }
          : x
      )
    );
  const removeAnalyse = (i) =>
    setAnalyses((a) => a.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    if (!nature) return Alert.alert("Erreur", "Nature est obligatoire");
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const payload = {
        appointmentId: appointmentId || null,
        PatientId: null,         // Backend lira patient du RDV ou tu l'ajoutes manuellement
        MedecinId: null,         // JWT le fournira côté serveur
        natureMaladie: nature,
        date,
        // Traitement complet
        traitement: {
          dateDebut,
          dateFin,
          observation: traitementObservation,
          medicaments: traitMedicaments.filter((m) => m.nom && m.dosage),
        },
        // Analyses complètes
        analyses: analyses.map((a) => ({
          date: a.date,
          laboratoire: a.laboratoire,
          observation: a.observation,
          pdfs: a.pdfs.filter((url) => url),
        })),
      };

      const res = await fetch(`${API_URL}/api/doctor/ordonnances`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || res.statusText);
      }
      Alert.alert("Succès", "Ordonnance enregistrée");
      navigation.goBack();
    } catch (e) {
      console.error("Erreur création ordonnance:", e);
      Alert.alert("Erreur", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header name="Nouvelle Ordonnance" screen="OrdonnanceList" />
      {loading && <ActivityIndicator size="large" color="#4287f5" />}

      {/* Ordonnance principale */}
      <Section label="Patient">
        <TextInput
          style={[styles.input, appointmentId && styles.readOnly]}
          value={patient}
          onChangeText={setPatient}
          editable={!appointmentId}
          placeholder="Nom du patient"
        />
      </Section>

      <Section label="Date">
        <TextInput
          style={[styles.input, appointmentId && styles.readOnly]}
          value={date}
          onChangeText={setDate}
          editable={!appointmentId}
          placeholder="YYYY-MM-DD"
        />
      </Section>

      <Section label="Nature de la maladie">
        <TextInput
          style={styles.input}
          value={nature}
          onChangeText={setNature}
          placeholder="Ex: Grippe, Rhume..."
        />
      </Section>

      {/* Traitement */}
      <Section label="Traitement">
        <Text style={styles.subLabel}>Dates</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.half]}
            value={dateDebut}
            onChangeText={setDateDebut}
            placeholder="Date début"
          />
          <TextInput
            style={[styles.input, styles.half]}
            value={dateFin}
            onChangeText={setDateFin}
            placeholder="Date fin"
          />
        </View>
        <Text style={styles.subLabel}>Observation</Text>
        <TextInput
          style={[styles.input, { height: 60 }]}
          value={traitementObservation}
          onChangeText={setTraitementObservation}
          placeholder="Observations..."
          multiline
        />

        <Text style={styles.subLabel}>Médicaments</Text>
        {traitMedicaments.map((m, i) => (
          <View key={i} style={styles.row}>
            <TextInput
              style={[styles.input, styles.half]}
              placeholder="Nom"
              value={m.nom}
              onChangeText={(v) => updateTraitMed(i, "nom", v)}
            />
            <TextInput
              style={[styles.input, styles.half]}
              placeholder="Dosage"
              value={m.dosage}
              onChangeText={(v) => updateTraitMed(i, "dosage", v)}
            />
            <TouchableOpacity onPress={() => removeTraitMed(i)}>
              <Text style={styles.removeBtn}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addBtn} onPress={addTraitMed}>
          <Text style={styles.addBtnText}>+ Ajouter Médicament</Text>
        </TouchableOpacity>
      </Section>

      {/* Analyses */}
      <Section label="Analyses">
        {analyses.map((a, i) => (
          <View key={i} style={styles.analysisBlock}>
            <Text style={styles.subLabel}>Analyse #{i + 1}</Text>
            <TextInput
              style={styles.input}
              placeholder="Date (YYYY-MM-DD)"
              value={a.date}
              onChangeText={(v) => updateAnalyseField(i, "date", v)}
            />
            <Text style={styles.subLabel}>Laboratoire</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={a.laboratoire.nom}
              onChangeText={(v) => updateAnalLabField(i, "nom", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Adresse"
              value={a.laboratoire.adresse}
              onChangeText={(v) => updateAnalLabField(i, "adresse", v)}
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.half]}
                placeholder="Téléphone"
                value={a.laboratoire.telephone}
                onChangeText={(v) => updateAnalLabField(i, "telephone", v)}
              />
              <TextInput
                style={[styles.input, styles.half]}
                placeholder="Email"
                value={a.laboratoire.email}
                onChangeText={(v) => updateAnalLabField(i, "email", v)}
              />
            </View>
            <Text style={styles.subLabel}>Observation</Text>
            <TextInput
              style={[styles.input, { height: 60 }]}
              placeholder="Observation"
              value={a.observation}
              onChangeText={(v) => updateAnalyseField(i, "observation", v)}
              multiline
            />

            <Text style={styles.subLabel}>PDFs</Text>
            {a.pdfs.map((url, pidx) => (
              <View key={pidx} style={styles.row}>
                <TextInput
                  style={[styles.input, styles.half]}
                  placeholder="Lien PDF"
                  value={url}
                  onChangeText={(v) => updatePdfLink(i, pidx, v)}
                />
                <TouchableOpacity onPress={() => addPdfLink(i)}>
                  <Text style={styles.addPdfBtn}>+</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity onPress={() => removeAnalyse(i)}>
              <Text style={styles.removeBtn}>✕ Supprimer Analyse</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
          </View>
        ))}
        <TouchableOpacity style={styles.addBtn} onPress={addAnalyse}>
          <Text style={styles.addBtnText}>+ Ajouter Analyse</Text>
        </TouchableOpacity>
      </Section>

      {/* Soumettre */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Enregistrer Ordonnance</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Petit helper pour espacer
const Section = ({ label, children }) => (
  <View style={{ marginHorizontal: 16, marginTop: 20 }}>
    <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
      {label}
    </Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  readOnly: { backgroundColor: "#f0f0f0" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  half: { flex: 1, marginRight: 6 },
  addBtn: {
    marginVertical: 10,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#75E1E5",
    borderRadius: 8,
  },
  addBtnText: { color: "#fff", fontWeight: "600" },
  removeBtn: { fontSize: 16, color: "red", marginLeft: 6 },
  addPdfBtn: { fontSize: 20, color: "#75E1E5", marginLeft: 6 },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  submitBtn: {
    margin: 20,
    backgroundColor: "#4287f5",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
