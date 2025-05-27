import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import Header from "../../components/DoctorComponents/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function AddOrdonnanceScreen() {
  const navigation = useNavigation();
  const { appointmentId, ordonnanceId } = useRoute().params || {};

  const [loading, setLoading] = useState(false);

  // États
  const [patient, setPatient] = useState("");
  const [date, setDate] = useState("");
  const [nature, setNature] = useState("");

  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [observationTrat, setObservationTrat] = useState("");
  const [traitMedicaments, setTraitMedicaments] = useState([]);

  const [analyses, setAnalyses] = useState([]);

  // 1️⃣ Si on vient d’un RDV, on pré‑remplit patient, date, nature
  useEffect(() => {
    if (!appointmentId || ordonnanceId) return;
    (async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const res = await fetch(
          `${API_URL}/api/doctor/appointments/${appointmentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const appt = await res.json();
        setPatient(`${appt.PatientId.nom} ${appt.PatientId.prenom}`);
        setDate(new Date(appt.date).toISOString().slice(0, 10));
        setNature(appt.observation || "");
      } catch (e) {
        console.error("Erreur fetch RDV:", e);
      }
    })();
  }, [appointmentId, ordonnanceId]);

  // 2️⃣ Si on édite une ordonnance, on charge tous ses champs
  useEffect(() => {
    if (!ordonnanceId) return;
    (async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const res = await fetch(
          `${API_URL}/api/doctor/ordonnances/${ordonnanceId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const o = await res.json();

        // Patient en lecture seule
        setPatient(`${o.PatientId.nom} ${o.PatientId.prenom}`);

        // Champs ordonnance
        setDate(o.date.slice(0, 10));
        setNature(o.natureMaladie);

        // Traitement
        if (o.traitement) {
          setDateDebut(o.traitement.dateDebut?.slice(0, 10) || "");
          setDateFin(o.traitement.dateFin?.slice(0, 10) || "");
          setObservationTrat(o.traitement.observation || "");
          setTraitMedicaments(o.traitement.medicaments || []);
        }

        // Analyses
        setAnalyses(
          (o.analyses || []).map(a => ({
            date: a.date.slice(0, 10),
            laboratoire: { ...a.laboratoire },
            observation: a.observation || "",
            pdfs: a.pdfs.length ? a.pdfs : [""],
          }))
        );
      } catch (e) {
        console.error("Erreur fetch ordonnance:", e);
      }
    })();
  }, [ordonnanceId]);

  // — Traitement dynamiques —
 const addTraitMed = () =>
  setTraitMedicaments(ms => [
    ...ms,
    { nom: "", dosage: "", endDate: "", periods: [] }
  ]);
  const updateTraitMed = (i, field, v) =>
    setTraitMedicaments(ms =>
      ms.map((m, idx) => (idx === i ? { ...m, [field]: v } : m))
    );
  const removeTraitMed = i =>
    setTraitMedicaments(ms => ms.filter((_, idx) => idx !== i));

  // — Analyses dynamiques —
  const addAnalyse = () =>
    setAnalyses(as => [
      ...as,
      {
        date: "",
        laboratoire: { nom: "", adresse: "", telephone: "", email: "" },
        observation: "",
        pdfs: [""],
      },
    ]);
  const updateAnalyseField = (i, field, v) =>
    setAnalyses(as =>
      as.map((a, idx) => (idx === i ? { ...a, [field]: v } : a))
    );
  const updateAnalLabField = (i, field, v) =>
    setAnalyses(as =>
      as.map((a, idx) =>
        idx === i
          ? { ...a, laboratoire: { ...a.laboratoire, [field]: v } }
          : a
      )
    );
  const addPdfLink = i =>
    setAnalyses(as =>
      as.map((a, idx) =>
        idx === i ? { ...a, pdfs: [...a.pdfs, ""] } : a
      )
    );
  const updatePdfLink = (i, pidx, v) =>
    setAnalyses(as =>
      as.map((a, idx) =>
        idx === i
          ? {
              ...a,
              pdfs: a.pdfs.map((link, j) => (j === pidx ? v : link)),
            }
          : a
      )
    );
  const removeAnalyse = i =>
    setAnalyses(as => as.filter((_, idx) => idx !== i));

  // 📨 Envoi POST ou PUT selon l’existence d’ordonnanceId
  const handleSubmit = async () => {
    if (!nature) return Alert.alert("Erreur", "Nature est obligatoire");
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const payload = {
        appointmentId: appointmentId || null,
        natureMaladie: nature,
        date,
        traitement: {
          dateDebut,
          dateFin,
          observation: observationTrat,
          medicaments: traitMedicaments.filter(m => m.nom && m.dosage),
        },
        analyses: analyses.map(a => ({
          date: a.date,
          laboratoire: a.laboratoire,
          observation: a.observation,
          pdfs: a.pdfs.filter(url => url),
        })),
      };

      const url = ordonnanceId
        ? `${API_URL}/api/doctor/ordonnances/${ordonnanceId}`
        : `${API_URL}/api/doctor/ordonnances`;
      const method = ordonnanceId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
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
      Alert.alert("Succès", ordonnanceId ? "Modifiée !" : "Créée !");
      navigation.goBack();
    } catch (e) {
      console.error("Erreur ordonnance:", e);
      Alert.alert("Erreur", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header
        name={ordonnanceId ? "Modifier Ordonnance" : "Nouvelle Ordonnance"}
        screen="OrdonnanceList"
      />

      {loading && <ActivityIndicator size="large" color="#4287f5" />}

      {/* Patient (lecture seule) */}
      <View style={styles.section}>
        <Text style={styles.label}>Patient</Text>
        <TextInput
          style={[styles.input, styles.readOnly]}
          value={patient}
          editable={false}
        />
      </View>

      {/* Date & Nature */}
      <View style={styles.section}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Nature de la maladie</Text>
        <TextInput
          style={styles.input}
          value={nature}
          onChangeText={setNature}
          placeholder="Ex: Grippe, Rhume..."
        />
      </View>

      {/* Traitement */}
      <View style={styles.section}>
        <Text style={styles.label}>Traitement</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.half]}
            value={dateDebut}
            onChangeText={setDateDebut}
            placeholder="Début YYYY-MM-DD"
          />
          <TextInput
            style={[styles.input, styles.half]}
            value={dateFin}
            onChangeText={setDateFin}
            placeholder="Fin YYYY-MM-DD"
          />
        </View>
        <TextInput
          style={[styles.input, { height: 60 }]}
          value={observationTrat}
          onChangeText={setObservationTrat}
          placeholder="Observation"
          multiline
        />
       {traitMedicaments.map((m, i) => (
  <View key={i} style={{ marginBottom: 8 }}>
    <View style={styles.row}>
      <TextInput
        style={[styles.input, styles.half]}
        placeholder="Nom"
        value={m.nom}
        onChangeText={v => updateTraitMed(i, "nom", v)}
      />
      <TextInput
        style={[styles.input, styles.half]}
        placeholder="Dosage"
        value={m.dosage}
        onChangeText={v => updateTraitMed(i, "dosage", v)}
      />
      <TouchableOpacity onPress={() => removeTraitMed(i)}>
        <Text style={styles.removeBtn}>✕</Text>
      </TouchableOpacity>
    </View>
    <TextInput
      style={[styles.input, styles.half]}
      placeholder="Date fin (YYYY-MM-DD)"
      value={m.endDate}
      onChangeText={v => updateTraitMed(i, "endDate", v)}
    />
    <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
      {['Matin', 'Midi', 'Après-midi', 'Soir'].map(p => (
        <TouchableOpacity
          key={p}
          onPress={() =>
            updateTraitMed(i, "periods",
              m.periods.includes(p)
                ? m.periods.filter(pr => pr !== p)
                : [...m.periods, p]
            )
          }
          style={{
            padding: 6,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 20,
            margin: 4,
            backgroundColor: m.periods.includes(p) ? "#75E1E5" : "white"
          }}
        >
          <Text style={{ fontSize: 12 }}>{p}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
))}
        <TouchableOpacity style={styles.addBtn} onPress={addTraitMed}>
          <Text style={styles.addBtnText}>+ Ajouter Médicament</Text>
        </TouchableOpacity>
      </View>

      {/* Analyses */}
      <View style={styles.section}>
        <Text style={styles.label}>Analyses</Text>
        {analyses.map((a, i) => (
          <View key={i} style={styles.analysisBlock}>
            <Text style={styles.subLabel}>Analyse #{i + 1}</Text>
            <TextInput
              style={styles.input}
              value={a.date}
              placeholder="YYYY-MM-DD"
              onChangeText={v => updateAnalyseField(i, "date", v)}
            />
            <Text style={styles.subLabel}>Laboratoire</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={a.laboratoire.nom}
              onChangeText={v => updateAnalLabField(i, "nom", v)}
            />
            <TextInput
              style={styles.input}
              placeholder="Adresse"
              value={a.laboratoire.adresse}
              onChangeText={v => updateAnalLabField(i, "adresse", v)}
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.half]}
                placeholder="Téléphone"
                value={a.laboratoire.telephone}
                onChangeText={v => updateAnalLabField(i, "telephone", v)}
              />
              <TextInput
                style={[styles.input, styles.half]}
                placeholder="Email"
                value={a.laboratoire.email}
                onChangeText={v => updateAnalLabField(i, "email", v)}
              />
            </View>
            <TextInput
              style={[styles.input, { height: 60 }]}
              placeholder="Observation"
              value={a.observation}
              onChangeText={v => updateAnalyseField(i, "observation", v)}
              multiline
            />
            {a.pdfs.map((url, pidx) => (
              <View key={pidx} style={styles.row}>
                <TextInput
                  style={[styles.input, styles.half]}
                  placeholder="Lien PDF"
                  value={url}
                  onChangeText={v => updatePdfLink(i, pidx, v)}
                />
                <TouchableOpacity onPress={() => addPdfLink(i)}>
                  <Text style={styles.addPdfBtn}>+</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity onPress={() => removeAnalyse(i)}>
              <Text style={styles.removeBtn}>✕ Supprimer Analyse</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addBtn} onPress={addAnalyse}>
          <Text style={styles.addBtnText}>+ Ajouter Analyse</Text>
        </TouchableOpacity>
      </View>

      {/* Soumettre */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>
          {ordonnanceId ? "Modifier Ordonnance" : "Enregistrer Ordonnance"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  section: { marginHorizontal: 16, marginTop: 20 },
  label: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  subLabel: { fontSize: 14, fontWeight: "500", marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  readOnly: { backgroundColor: "#f0f0f0" },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  half: { flex: 1, marginRight: 6 },
  addBtn: {
    backgroundColor: "#75E1E5",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  addBtnText: { color: "#fff", fontWeight: "600" },
  removeBtn: { color: "red", fontSize: 18, marginLeft: 6 },
  addPdfBtn: { color: "#75E1E5", fontSize: 20, marginLeft: 6 },
  analysisBlock: { marginBottom: 10 },
  submitBtn: {
    margin: 20,
    backgroundColor: "#4287f5",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
