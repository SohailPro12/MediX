import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "#FFC107";
    case "confirmed":
      return "#28A745";
    case "completed":
      return "#6C757D";
    case "cancelled":
      return "#DC3545";
    default:
      return "#6C757D";
  }
};

// Helper function to get status text with translation
const getStatusText = (status, t) => {
  switch (status) {
    case "pending":
      return t("doctor.appointmentCard.status.pending");
    case "confirmed":
      return t("doctor.appointmentCard.status.confirmed");
    case "completed":
      return t("doctor.appointmentCard.status.completed");
    case "cancelled":
      return t("doctor.appointmentCard.status.cancelled");
    default:
      return t("doctor.appointmentCard.status.pending");
  }
};

export default function CardRdv({ item }) {
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      style={styles.appointmentCard}
      onPress={() => console.log(`Détails du rendez-vous: ${item.id}`)}
    >
      <View style={styles.appointmentHeader}>
        <View style={styles.patientInfo}>
          <Image source={item.patientImg} style={styles.patientImage} />
          <View>
            <Text style={styles.patientName}>{item.patientName}</Text>
            <Text style={styles.appointmentType}>{item.type}</Text>
          </View>
        </View>{" "}
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(item.status, t)}</Text>
        </View>
      </View>

      <View style={styles.appointmentDetails}>
        <View style={styles.detailItem}>
          <FontAwesome5 name="calendar-alt" size={16} color="#666" />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        <View style={styles.detailItem}>
          <FontAwesome5 name="clock" size={16} color="#666" />
          <Text style={styles.detailText}>{item.time}</Text>
        </View>
        <View style={styles.detailItem}>
          <FontAwesome5 name="sticky-note" size={16} color="#666" />
          <Text style={styles.detailText}>{item.notes}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        {" "}
        <TouchableOpacity
          style={[styles.actionButton, styles.messageButton]}
          onPress={() => console.log(`Message à ${item.patientName}`)}
        >
          <FontAwesome5 name="comment-alt" size={14} color="#4A90E2" />
          <Text style={styles.messageButtonText}>
            {t("doctor.appointmentCard.message")}
          </Text>
        </TouchableOpacity>
        {item.status !== "completed" && item.status !== "cancelled" && (
          <TouchableOpacity
            style={[styles.actionButton, styles.rescheduleButton]}
            onPress={() => console.log(`Reprogrammer RDV: ${item.id}`)}
          >
            <FontAwesome5 name="calendar-plus" size={14} color="#FFC107" />
            <Text style={styles.rescheduleButtonText}>
              {t("doctor.appointmentCard.reschedule")}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  addButton: {
    backgroundColor: "#4A90E2",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#EAEAEA",
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#333",
    fontWeight: "bold",
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  appointmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  patientInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  patientImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  appointmentType: {
    fontSize: 14,
    color: "#666",
  },
  statusIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: "#FFF",
    fontWeight: "500",
  },
  appointmentDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-start",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingTop: 12,
    marginTop: 4,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  messageButton: {
    backgroundColor: "#EBF5FF",
  },
  messageButtonText: {
    marginLeft: 6,
    color: "#4A90E2",
    fontSize: 12,
    fontWeight: "500",
  },
  rescheduleButton: {
    backgroundColor: "#FFF9E6",
  },
  rescheduleButtonText: {
    marginLeft: 6,
    color: "#FFC107",
    fontSize: 12,
    fontWeight: "500",
  },
});
