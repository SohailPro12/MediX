import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "react-native-paper";
import Header from "../../components/DoctorComponents/Header";
import { useMedecin } from "../context/MedecinContext";
import i18n from "../../i18n";

const SettingsDScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { medecin } = useMedecin(); // Récupère les infos du médecin depuis le contexte
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  // Assure-toi que medecin existe avant de l'afficher
  if (!medecin) {
    return <Text>{t("doctor.settings.loading")}</Text>; // Affiche un message de chargement si les données du médecin ne sont pas encore disponibles
  }

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setLanguageModalVisible(false);
    Alert.alert(
      t("doctor.settings.language.title"),
      `${t("doctor.settings.language.current")}: ${getLanguageName(
        languageCode
      )}`
    );
  };

  const getLanguageName = (code) => {
    switch (code) {
      case "fr":
        return t("doctor.settings.language.french");
      case "en":
        return t("doctor.settings.language.english");
      case "ar":
        return t("doctor.settings.language.arabic");
      default:
        return t("doctor.settings.language.french");
    }
  };

  const getCurrentLanguage = () => {
    return getLanguageName(i18n.language);
  };

  return (
    <View style={styles.container}>
      <Header name={t("doctor.settings.title")} screen="DashboardDoctor" />
      <View style={styles.profileContainer}>
        <View style={{ position: "relative" }}>
          <Avatar.Image
            size={120}
            source={
              medecin.Photo
                ? { uri: medecin.Photo }
                : require("../../assets/doctor.png")
            }
          />
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => navigation.navigate("EditDoctorProfile")}
          >
            <Ionicons name="create" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>Dr. {medecin.nom}</Text>
        <Text style={styles.email}>{medecin.mail}</Text>

        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <Ionicons
              key={index}
              name={index < medecin.rating ? "star" : "star-outline"}
              size={20}
              color="#75E1E5"
            />
          ))}
        </View>
      </View>
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("PatientList")}
        >
          <Text style={styles.menuText}>
            {t("doctor.settings.menu.patientList")}
          </Text>
          <Ionicons name="chevron-forward" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("AjouterPa")}
        >
          <Text style={styles.menuText}>
            {t("doctor.settings.menu.addPatient")}
          </Text>
          <Ionicons name="chevron-forward" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("ReportScreen")}
        >
          <Text style={styles.menuText}>
            {t("doctor.settings.menu.reportProblem")}
          </Text>
          <Ionicons name="chevron-forward" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setLanguageModalVisible(true)}
        >
          <View style={styles.languageItem}>
            <Text style={styles.menuText}>
              {t("doctor.settings.menu.language")}
            </Text>
            <Text style={styles.currentLanguage}>{getCurrentLanguage()}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} />
        </TouchableOpacity>
      </View>
      {/* Language Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t("doctor.settings.language.title")}
            </Text>

            <TouchableOpacity
              style={[
                styles.languageOption,
                i18n.language === "fr" && styles.selectedLanguage,
              ]}
              onPress={() => changeLanguage("fr")}
            >
              <Text
                style={[
                  styles.languageText,
                  i18n.language === "fr" && styles.selectedLanguageText,
                ]}
              >
                {t("doctor.settings.language.french")}
              </Text>
              {i18n.language === "fr" && (
                <Ionicons name="checkmark" size={20} color="#75E1E5" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageOption,
                i18n.language === "en" && styles.selectedLanguage,
              ]}
              onPress={() => changeLanguage("en")}
            >
              <Text
                style={[
                  styles.languageText,
                  i18n.language === "en" && styles.selectedLanguageText,
                ]}
              >
                {t("doctor.settings.language.english")}
              </Text>
              {i18n.language === "en" && (
                <Ionicons name="checkmark" size={20} color="#75E1E5" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageOption,
                i18n.language === "ar" && styles.selectedLanguage,
              ]}
              onPress={() => changeLanguage("ar")}
            >
              <Text
                style={[
                  styles.languageText,
                  i18n.language === "ar" && styles.selectedLanguageText,
                ]}
              >
                {t("doctor.settings.language.arabic")}
              </Text>
              {i18n.language === "ar" && (
                <Ionicons name="checkmark" size={20} color="#75E1E5" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>{t("common.cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: "6%",
    paddingVertical: "12%",
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#75E1E5",
    borderRadius: 10,
    padding: 5,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  email: {
    fontSize: 14,
    color: "gray",
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  menu: {
    width: "97%",
    alignSelf: "center",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
  languageItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  currentLanguage: {
    fontSize: 14,
    color: "#75E1E5",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  languageOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedLanguage: {
    backgroundColor: "#E8F8F8",
  },
  languageText: {
    fontSize: 16,
    color: "#333",
  },
  selectedLanguageText: {
    color: "#75E1E5",
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
  },
});

export default SettingsDScreen;
