import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import SuccessAlert from "../components/SuccessAlert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config";
import { useTranslation } from "react-i18next";
import "../i18n";

const AddDoctor = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [cin, setCin] = useState("");
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photoUri, setPhotoUri] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageSelect = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
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
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleAddDoctor = async () => {
    setIsSubmitting(true); // Basic validations
    if (
      !nom ||
      !prenom ||
      !mail ||
      !specialty ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert(t("common.error"), t("doctor.validation.allFieldsRequired"));
      setIsSubmitting(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail.trim())) {
      Alert.alert(t("common.error"), t("doctor.validation.invalidEmail"));
      setIsSubmitting(false);
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(t("common.error"), t("doctor.validation.passwordMismatch"));
      setIsSubmitting(false);
      return;
    }

    // Retrieve SSO code
    let codeSSO;
    try {
      codeSSO = await AsyncStorage.getItem("ssoCode");
      if (!codeSSO) throw new Error(t("common.error"));
    } catch (error) {
      Alert.alert(t("common.error"), error.message);
      setIsSubmitting(false);
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");
      const formData = new FormData();

      // Append image if selected
      if (photoUri) {
        formData.append("image", {
          uri: photoUri,
          type: "image/jpeg",
          name: "doctor_profile.jpg",
        });
      }

      // Append all fields
      formData.append("nom", nom.trim());
      formData.append("prenom", prenom.trim());
      formData.append("cin", cin.trim());
      formData.append("mail", mail.trim());
      formData.append("phone", phone.trim());
      formData.append("specialty", specialty.trim());
      formData.append("licenseNumber", licenseNumber.trim());
      formData.append("password", password.trim());
      formData.append("codeSSO", codeSSO);

      const response = await fetch(`${API_URL}/api/admin/addDoc`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.status === 400) {
        Alert.alert(t("common.error"), t("doctor.validation.emailExists"));
      } else if (response.ok) {
        setModalVisible(true);
      } else {
        const errText = await response.text();
        throw new Error(errText);
      }
    } catch (error) {
      console.error("handleAddDoctor error:", error);
      Alert.alert(t("common.error"), t("common.genericError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>{" "}
      <Text style={styles.title}>{t("doctor.addTitle")}</Text>
      <Text style={styles.subtitle}>{t("doctor.addSubtitle")}</Text>
      <TouchableOpacity
        onPress={handleImageSelect}
        style={styles.imageContainer}
      >
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.image} />
        ) : (
          <Ionicons name="camera" size={32} color="#aaa" />
        )}
      </TouchableOpacity>{" "}
      <Text style={styles.label}>{t("doctor.form.lastName")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("doctor.form.placeholders.lastName")}
        value={nom}
        onChangeText={setNom}
      />
      <Text style={styles.label}>{t("doctor.form.firstName")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("doctor.form.placeholders.firstName")}
        value={prenom}
        onChangeText={setPrenom}
      />
      <Text style={styles.label}>{t("doctor.form.cin")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("doctor.form.placeholders.cin")}
        value={cin}
        onChangeText={setCin}
      />
      <Text style={styles.label}>{t("doctor.form.email")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("doctor.form.placeholders.email")}
        value={mail}
        onChangeText={setMail}
        keyboardType="email-address"
      />
      <Text style={styles.label}>{t("doctor.form.phone")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("doctor.form.placeholders.phone")}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>{t("doctor.form.specialty")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("doctor.form.placeholders.specialty")}
        value={specialty}
        onChangeText={setSpecialty}
      />
      <Text style={styles.label}>{t("doctor.form.licenseNumber")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("doctor.form.placeholders.licenseNumber")}
        value={licenseNumber}
        onChangeText={setLicenseNumber}
        keyboardType="numeric"
      />
      <Text style={styles.label}>{t("doctor.form.password")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("doctor.form.placeholders.password")}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder={t("doctor.form.placeholders.confirmPassword")}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity
        style={[styles.addButton, isSubmitting && { opacity: 0.6 }]}
        onPress={handleAddDoctor}
        disabled={isSubmitting}
      >
        <Text style={styles.addButtonText}>
          {isSubmitting
            ? t("doctor.success.addingInProgress")
            : t("common.add")}
        </Text>
      </TouchableOpacity>
      <SuccessAlert
        visible={modalVisible}
        message={t("doctor.success.accountCreated")}
        onClose={() => {
          setModalVisible(false);
          if (navigation.canGoBack()) navigation.goBack();
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#f7f7f7", padding: 26, alignItems: "center" },
  backButton: { alignSelf: "flex-start", marginBottom: 6 },
  title: { fontSize: 26, fontWeight: "bold", color: "#333" },
  subtitle: { fontSize: 16, color: "#777", marginBottom: 20 },
  imageContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#d0dbda",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
    fontSize: 16,
    elevation: 2,
  },
  addButton: {
    backgroundColor: "#75E1E5",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    width: "75%",
    marginTop: 10,
    elevation: 3,
  },
  addButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default AddDoctor;
