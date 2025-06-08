import React from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import "../i18n";
import { handleDeleteAccount } from "../screens/LoginFront/authentification/deleteAdmin";

const DeleteAccountButton = () => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const confirmDelete = () => {
    Alert.alert(t("alerts.deleteConfirm"), t("alerts.deleteAccount"), [
      {
        text: t("common.cancel"),
        onPress: () => console.log("Annuler"),
        style: "cancel",
      },
      {
        text: t("common.delete"),
        onPress: () => handleDeleteAccount(navigation),
      }, // Correction ici
    ]);
  };

  return (
    <View style={styles.container}>
      <Button
        title={t("alerts.deleteAccountButton")}
        onPress={confirmDelete}
        color="#ff0000"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default DeleteAccountButton;
