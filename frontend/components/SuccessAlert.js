import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SuccessAlert = ({ visible, onClose, message }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Ionicons name="checkmark-circle" size={50} color="#6a6e" />
          <Text style={styles.modalText}>{message}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center", width: 300 },
  modalText: { fontSize: 18, fontWeight: "bold", marginVertical: 15, textAlign: "center" },
  closeButton: { backgroundColor: "#75E1CC", padding: 10, borderRadius: 5, marginTop: 10, width: "60%", alignItems: "center" },
  closeButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default SuccessAlert;