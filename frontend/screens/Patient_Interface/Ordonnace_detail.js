import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const OrdonnanceView = ({ ordonnance, onClose }) => {
  const { t } = useTranslation();

  if (!ordonnance) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("patient.prescription.title")}</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#5771f9" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("patient.prescription.diagnosis")}
          </Text>
          <Text style={styles.text}>{ordonnance.natureMaladie}</Text>
        </View>

        {ordonnance.medicaments?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t("patient.prescription.medications")}
            </Text>
            {ordonnance.medicaments.map((med, index) => (
              <View key={index} style={styles.medicamentItem}>
                <Text style={styles.medicamentName}>{med.name}</Text>
                <View style={styles.detailRow}>
                  <FontAwesome5 name="calendar-alt" size={14} color="#64748b" />
                  <Text style={styles.detailText}>
                    {t("patient.prescription.until")}
                    {new Date(med.endDate).toLocaleDateString("fr-FR")}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <FontAwesome5 name="clock" size={14} color="#64748b" />
                  <Text style={styles.detailText}>
                    {t("patient.prescription.intake")}:{med.periods?.join(", ")}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {ordonnance.analyses?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t("patient.prescription.analyses")}
            </Text>
            {ordonnance.analyses.map((analyse, index) => (
              <View key={index} style={styles.analyseItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.analyseText}>
                  {analyse.name} - {analyse.description}
                </Text>
              </View>
            ))}
          </View>
        )}

        {ordonnance.traitement && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t("patient.prescription.treatment")}
            </Text>
            <Text style={styles.text}>{ordonnance.traitement.description}</Text>
            {ordonnance.traitement.duration && (
              <Text style={styles.duration}>
                {t("patient.prescription.duration")}:
                {ordonnance.traitement.duration}
                {t("patient.prescription.days")}
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#5771f9",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  medicamentItem: {
    backgroundColor: "#f8fafc",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  medicamentName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#1e40af",
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 8,
    color: "#64748b",
  },
  analyseItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  bullet: {
    color: "#5771f9",
    marginRight: 8,
  },
  analyseText: {
    flex: 1,
    color: "#333",
  },
  duration: {
    marginTop: 5,
    fontStyle: "italic",
    color: "#64748b",
  },
});

export default OrdonnanceView;
