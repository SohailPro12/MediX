import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
  Keyboard,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../../components/PatientComponents/BottomNav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";
import { useTranslation } from "react-i18next";

const ChangePassword = ({ navigation }) => {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    // Validation des champs
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage(t("patient.changePassword.allFieldsRequired"));
      setErrorModal(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(t("patient.changePassword.passwordsDontMatch"));
      setErrorModal(true);
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage(t("patient.changePassword.passwordTooShort"));
      setErrorModal(true);
      return;
    }

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await fetch(`${API_URL}/api/patient/EditProfile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: currentPassword,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || t("patient.changePassword.changePasswordFailed")
        );
      }

      // Réinitialisation des champs
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccessModal(true);
    } catch (error) {
      console.error("Erreur:", error);
      setErrorMessage(
        error.message || t("patient.changePassword.errorOccurred")
      );
      setErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={28} color="#5771f9" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                {t("patient.changePassword.title")}
              </Text>
              <View style={{ width: 30 }} />
            </View>

            <Text style={styles.subTitle}>
              {t("patient.changePassword.enterInfo")}
            </Text>

            <TextInput
              label={t("patient.changePassword.currentPassword")}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              mode="outlined"
              secureTextEntry
              theme={{ colors: { primary: "#5771f9" } }}
              style={styles.input}
              left={<TextInput.Icon name="lock" />}
            />

            <TextInput
              label={t("patient.changePassword.newPassword")}
              value={newPassword}
              onChangeText={setNewPassword}
              mode="outlined"
              secureTextEntry
              theme={{ colors: { primary: "#5771f9" } }}
              style={styles.input}
              left={<TextInput.Icon name="lock-reset" />}
            />

            <TextInput
              label={t("patient.changePassword.confirmNewPassword")}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry
              theme={{ colors: { primary: "#5771f9" } }}
              style={styles.input}
              left={<TextInput.Icon name="lock-check" />}
            />

            <Button
              mode="contained"
              onPress={handleChangePassword}
              style={styles.button}
              loading={isLoading}
              disabled={isLoading}
              labelStyle={styles.buttonLabel}
            >
              {isLoading
                ? t("patient.changePassword.processing")
                : t("patient.changePassword.updatePassword")}
            </Button>

            {/* Modal de succès */}
            <Modal visible={successModal} transparent animationType="fade">
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <AntDesign
                    name="checkcircle"
                    size={90}
                    color="#4BB543"
                    style={styles.modalIcon}
                  />
                  <Text style={styles.modalTitle}>
                    {t("patient.changePassword.success")}
                  </Text>
                  <Text style={styles.modalText}>
                    {t("patient.changePassword.successMessage")}
                  </Text>
                  <Button
                    mode="contained"
                    onPress={() => {
                      setSuccessModal(false);
                      navigation.goBack();
                    }}
                    style={styles.modalButton}
                    labelStyle={styles.modalButtonLabel}
                  >
                    {t("patient.changePassword.ok")}
                  </Button>
                </View>
              </View>
            </Modal>

            {/* Modal d'erreur */}
            <Modal visible={errorModal} transparent animationType="fade">
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <MaterialIcons
                    name="error"
                    size={90}
                    color="#ff4444"
                    style={styles.modalIcon}
                  />
                  <Text style={styles.modalTitle}>
                    {t("patient.changePassword.error")}
                  </Text>
                  <Text style={styles.modalText}>{errorMessage}</Text>
                  <Button
                    mode="contained"
                    onPress={() => setErrorModal(false)}
                    style={[styles.modalButton, { backgroundColor: "#ff4444" }]}
                    labelStyle={styles.modalButtonLabel}
                  >
                    {t("patient.changePassword.tryAgain")}
                  </Button>
                </View>
              </View>
            </Modal>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <BottomNav navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F5FF",
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  subTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    marginBottom: 20,
    backgroundColor: "white",
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: "#5771f9",
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
  },
  modalIcon: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  modalText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 22,
  },
  modalButton: {
    width: "100%",
    backgroundColor: "#5771f9",
    borderRadius: 8,
  },
  modalButtonLabel: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ChangePassword;
