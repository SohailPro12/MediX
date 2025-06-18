import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
  Alert,
  RefreshControl,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import BottomNav from "../../components/PatientComponents/BottomNav";
import { usePatient } from "../context/PatientContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

const PatientProfile = ({ navigation }) => {
  const { t } = useTranslation();
  const { patient, setPatient } = usePatient();
  const [isEdit, setIsEdit] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    mail: "",
    photo: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setLanguageModalVisible(false);
    Alert.alert(
      t("patient.settings.language.title"),
      `${t("patient.settings.language.current")}: ${getLanguageName(
        languageCode
      )}`
    );
  };

  const getLanguageName = (code) => {
    switch (code) {
      case "fr":
        return t("patient.settings.language.french");
      case "en":
        return t("patient.settings.language.english");
      case "ar":
        return t("patient.settings.language.arabic");
      default:
        return t("patient.settings.language.french");
    }
  };

  const getCurrentLanguage = () => {
    return getLanguageName(i18n.language);
  };

  const fetchPatientData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/api/patient/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Échec de la récupération des données patient");
      }

      const patientData = await response.json();
      setPatient(patientData);
      setFormData({
        _id: null,
        cin: null,
        telephone: null,
        prenom: patientData.prenom || "",
        nom: patientData.nom || "",
        mail: patientData.mail || "",
        photo: patientData.photo || null,
      });
    } catch (error) {
      console.error("Erreur:", error);
      Alert.alert("Erreur", "Impossible de charger les données du patient");
    }
  }, [setPatient]);

  useEffect(() => {
    fetchPatientData();
  }, [fetchPatientData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPatientData();
    setRefreshing(false);
  }, [fetchPatientData]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "Nous avons besoin de la permission pour accéder à vos photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, photo: result.assets[0].uri });
    }
  };

  const uploadImage = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const data = new FormData();
    data.append("image", {
      uri: formData.photo,
      type: "image/jpeg",
      name: "profile.jpg",
    });

    const res = await fetch(`${API_URL}/api/patient/uploadimage`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      body: data,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Erreur upload image");
    }
    const result = await res.json();
    return result.url;
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (!formData.prenom.trim()) {
        throw new Error("Le prénom est requis");
      }
      if (!formData.nom.trim()) {
        throw new Error("Le nom est requis");
      }
      if (formData.mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.mail)) {
        throw new Error("Veuillez entrer un email valide");
      }

      let imageUrl = formData.photo;
      if (formData.photo && formData.photo.startsWith("file:")) {
        imageUrl = await uploadImage();
      }

      const updatedData = {
        prenom: formData.prenom.trim(),
        nom: formData.nom.trim(),
        mail: formData.mail.trim(),
        telephone: patient.telephone,
        cin: patient.cin,
        photo: imageUrl,
      };

      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/api/patient/EditProfile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Échec de la mise à jour du profil"
        );
      }

      const updatedPatient = await response.json();
      setPatient({ ...patient, ...updatedPatient });

      Alert.alert("Succès", "Profil mis à jour avec succès");
      setIsEdit(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      Alert.alert(
        "Erreur",
        error.message || "Une erreur est survenue lors de la mise à jour"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("authToken");
            navigation.navigate("CodeSSOScreen");
          } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
          }
        },
      },
    ]);
  };
  if (!patient) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{t("patient.profile.loading")}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#5771f9"]}
                tintColor="#5771f9"
              />
            }
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={28} color="#5771f9" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                {t("patient.profile.title")}
              </Text>
              <View style={{ width: 30 }} />
            </View>
            <View style={styles.profileContainer}>
              <View style={styles.avatarContainer}>
                {formData.photo ? (
                  <Avatar.Image size={120} source={{ uri: formData.photo }} />
                ) : (
                  <View style={styles.defaultAvatar}>
                    <Ionicons name="person" size={60} color="white" />
                  </View>
                )}
                {isEdit && (
                  <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
                    <Ionicons name="camera" size={20} color="white" />
                  </TouchableOpacity>
                )}
              </View>

              {isEdit ? (
                <>
                  <TextInput
                    value={formData.prenom}
                    onChangeText={(text) =>
                      setFormData({ ...formData, prenom: text })
                    }
                    style={styles.textInput}
                    placeholder={t("patient.profile.firstName")}
                  />
                  <TextInput
                    value={formData.nom}
                    onChangeText={(text) =>
                      setFormData({ ...formData, nom: text })
                    }
                    style={styles.textInput}
                    placeholder={t("patient.profile.lastName")}
                  />
                </>
              ) : (
                <Text style={styles.name}>
                  {formData.prenom + " " + formData.nom}
                </Text>
              )}

              {isEdit ? (
                <TextInput
                  keyboardType="email-address"
                  value={formData.mail}
                  onChangeText={(text) =>
                    setFormData({ ...formData, mail: text })
                  }
                  style={styles.textInput}
                  placeholder={t("common.email")}
                />
              ) : (
                <Text style={styles.email}>
                  {formData.mail || t("patient.profile.noEmail")}
                </Text>
              )}
            </View>
            <View style={styles.menu}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={isEdit ? handleSave : () => setIsEdit(true)}
                disabled={isLoading}
              >
                {isEdit ? (
                  <>
                    <Text style={styles.menuText}>
                      {isLoading
                        ? t("patient.profile.saving")
                        : t("common.save")}
                    </Text>
                    <Feather name="check-square" size={24} color="green" />
                  </>
                ) : (
                  <>
                    <Text style={styles.menuText}>
                      {t("patient.profile.editProfile")}
                    </Text>
                    <AntDesign name="edit" size={24} color="green" />
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("ChangePassword")}
              >
                <Text style={styles.menuText}>
                  {t("patient.profile.changePassword")}
                </Text>
                <FontAwesome name="lock" size={24} color="blue" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => setLanguageModalVisible(true)}
              >
                <View style={styles.languageItemContainer}>
                  <Text style={styles.menuText}>
                    {t("patient.settings.language.title")}
                  </Text>
                  <Text style={styles.currentLanguageText}>
                    {getCurrentLanguage()}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#333" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate("ReportScreen")}
              >
                <Text style={styles.menuText}>
                  {t("patient.profile.reportProblem")}
                </Text>
                <MaterialIcons name="report-problem" size={24} color="orange" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <Text style={styles.menuText}>
                  {t("patient.profile.logout")}
                </Text>
                <MaterialIcons name="logout" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

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
              {t("patient.settings.language.title")}
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
                {t("patient.settings.language.french")}
              </Text>
              {i18n.language === "fr" && (
                <Ionicons name="checkmark" size={20} color="#5771f9" />
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
                {t("patient.settings.language.english")}
              </Text>
              {i18n.language === "en" && (
                <Ionicons name="checkmark" size={20} color="#5771f9" />
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
                {t("patient.settings.language.arabic")}
              </Text>
              {i18n.language === "ar" && (
                <Ionicons name="checkmark" size={20} color="#5771f9" />
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

      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9FAFB" },
  keyboardView: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { paddingTop: 40, paddingHorizontal: 20, paddingBottom: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  profileContainer: { alignItems: "center", marginVertical: 20 },
  avatarContainer: { position: "relative", marginBottom: 15 },
  defaultAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#5771f9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#5771f9",
    borderRadius: 20,
    padding: 6,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 5,
    textAlign: "center",
  },
  email: { fontSize: 16, color: "gray", marginBottom: 10 },
  menu: {
    width: "100%",
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    alignItems: "center",
  },
  menuText: { fontSize: 16, color: "#333" },
  languageItemContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  currentLanguageText: {
    fontSize: 14,
    color: "#5771f9",
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
    backgroundColor: "#E8F4FF",
  },
  languageText: {
    fontSize: 16,
    color: "#333",
  },
  selectedLanguageText: {
    color: "#5771f9",
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
  textInput: {
    width: "80%",
    fontSize: 16,
    color: "#555",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    backgroundColor: "white",
  },
});

export default PatientProfile;
