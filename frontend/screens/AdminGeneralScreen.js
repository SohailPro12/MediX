import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { API_URL } from "../config";
import i18n from "../i18n";

const AdminGeneralScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setLanguageModalVisible(false);
    Alert.alert(
      t("admin.settings.language.title"),
      `${t("admin.settings.language.current")}: ${getLanguageName(
        languageCode
      )}`
    );
  };

  const getLanguageName = (code) => {
    switch (code) {
      case "fr":
        return t("admin.settings.language.french");
      case "en":
        return t("admin.settings.language.english");
      case "ar":
        return t("admin.settings.language.arabic");
      default:
        return t("admin.settings.language.french");
    }
  };

  const getCurrentLanguage = () => {
    return getLanguageName(i18n.language);
  };

  const fetchAdminProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`${API_URL}/api/admin/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP ${response.status} - ${errorBody}`);
      }

      const data = await response.json();
      setAdminData(data);
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      Alert.alert(t("common.error"), t("common.genericError"));
    } finally {
      setLoading(false);
    }
  };

  const uploadProfilePicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("alerts.permissionDenied"), t("alerts.galleryAccess"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const token = await AsyncStorage.getItem("authToken");
      const uri = result.assets[0].uri;

      const formData = new FormData();
      formData.append("image", {
        uri,
        type: "image/jpeg",
        name: "admin_profile.jpg",
      });

      try {
        const response = await axios.post(
          `${API_URL}/api/admin/uploadimage/admin`, // Updated the endpoint
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        Alert.alert(
          t("common.success"),
          response.data.message || t("doctor.success.imageUpdated")
        );
        fetchAdminProfile(); // refresh profile
      } catch (error) {
        console.error("Error uploading picture:", error);
        const errorMsg = error.response?.data?.error || error.message;
        Alert.alert(
          t("common.error"),
          `${t("common.genericError")}: ${errorMsg}`
        );
      }
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>{t("common.loading")}...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{t("admin.general")}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.profile}>
          <View style={styles.avatarWrapper}>
            <TouchableOpacity onPress={uploadProfilePicture}>
              {adminData?.image ? (
                <Image
                  source={{ uri: adminData.image }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Icon name="person-circle-outline" size={80} color="#888" />
                </View>
              )}
              <View style={styles.plusIcon}>
                <Icon name="add-circle" size={24} color="#007bff" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.name}>{`${adminData?.prenom || "Admin"} ${
              adminData?.nom || ""
            }`}</Text>
            <Text style={styles.info}>
              {t("common.email")}: {adminData?.mail || "N/A"}
            </Text>
            <Text style={styles.info}>
              {t("common.phone")}: {adminData?.telephone || "N/A"}
            </Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("DoctorList")}
          >
            <Text style={styles.menuText}>{t("admin.doctorsList")}</Text>
            <Icon name="chevron-forward" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("AddDoctor")}
          >
            <Text style={styles.menuText}>{t("admin.addDoctor")}</Text>
            <Icon name="chevron-forward" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("ProblemesScreen")}
          >
            <Text style={styles.menuText}>{t("admin.technicalProblems")}</Text>
            <Icon name="chevron-forward" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setLanguageModalVisible(true)}
          >
            <View style={styles.languageItemContainer}>
              <Text style={styles.menuText}>
                {t("admin.settings.language.title")}
              </Text>
              <Text style={styles.currentLanguageText}>
                {getCurrentLanguage()}
              </Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#000" />
          </TouchableOpacity>
        </View>
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
              {t("admin.settings.language.title")}
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
                {t("admin.settings.language.french")}
              </Text>
              {i18n.language === "fr" && (
                <Icon name="checkmark" size={20} color="#007bff" />
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
                {t("admin.settings.language.english")}
              </Text>
              {i18n.language === "en" && (
                <Icon name="checkmark" size={20} color="#007bff" />
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
                {t("admin.settings.language.arabic")}
              </Text>
              {i18n.language === "ar" && (
                <Icon name="checkmark" size={20} color="#007bff" />
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
  container: { flex: 1, backgroundColor: "#f4f4f4" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: { fontSize: 18, fontWeight: "bold", marginLeft: 16, color: "#333" },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  profile: { alignItems: "center", marginBottom: 32 },
  avatarWrapper: {
    position: "relative",
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ddd",
  },
  plusIcon: {
    position: "absolute",
    bottom: 0,
    right: -5,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  infoContainer: { alignItems: "center" },
  name: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 4 },
  info: { fontSize: 14, color: "#888", marginBottom: 2 },
  buttonsContainer: { width: "100%", alignItems: "center" },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 5,
  },
  menuText: { fontSize: 16, color: "#333", flex: 1 },
  languageItemContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  currentLanguageText: {
    fontSize: 14,
    color: "#007bff",
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
    color: "#007bff",
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

export default AdminGeneralScreen;
