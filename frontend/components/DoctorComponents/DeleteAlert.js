import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { Button } from "react-native-paper";
import { useTranslation } from "react-i18next";

const DeleteAlert = ({ isVisible, onConfirm, onCancel }) => {
  const { t } = useTranslation();
  const [pressedButton, setPressedButton] = useState(null);

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.5}
      animationIn="zoomIn"
      animationOut="zoomOut"
    >
      <View style={styles.modalContainer}>
        <Text style={styles.title}>{t("doctor.deleteAlert.title")}</Text>
        <Text style={styles.message}>{t("doctor.deleteAlert.message")}</Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => {
              setPressedButton("Non");
              onCancel();
            }}
            style={[
              styles.buttonN,
              pressedButton === "Non" && styles.pressedButton,
            ]}
            labelStyle={styles.buttonNText}
          >
            {t("doctor.deleteAlert.no")}
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              setPressedButton("Oui");
              onConfirm();
            }}
            style={[
              styles.buttonO,
              pressedButton === "Oui" && styles.pressedButton,
            ]}
          >
            {t("doctor.deleteAlert.yes")}
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  buttonN: {
    flex: 1,
    marginHorizontal: 5,
    borderColor: "black",
  },
  buttonNText: {
    color: "black",
  },
  buttonO: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#02e5de",
  },
  pressedButton: {
    opacity: 0.5,
  },
});

export default DeleteAlert;
