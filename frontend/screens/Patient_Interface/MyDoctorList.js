import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../../config";
import { usePatient } from "../context/PatientContext";
import { useTranslation } from "react-i18next";

const CardAnimation = ({ children, delay }) => {
  const scaleValue = useRef(new Animated.Value(0.95)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 300,
        delay: delay || 0,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 500,
        delay: delay || 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleValue }],
        opacity: opacityValue,
      }}
    >
      {children}
    </Animated.View>
  );
};

export default function MyDoctorsList({ navigation }) {
  const { t } = useTranslation();
  const { patient } = usePatient();
  const patientId = patient?._id;
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDoctors = async () => {
    try {
      setError(null);
      setRefreshing(true);
      const response = await fetch(
        `${API_URL}/api/patient/getDocteurs/${patientId}`
      );
      if (!response.ok) {
        throw new Error(
          `${t("patient.myDoctors.httpError")}: ${response.status}`
        );
      }

      const data = await response.json();      const formattedDoctors = data.map((doctor) => ({
        _id: `${doctor._id}`,
        name: `Dr. ${doctor.prenom} ${doctor.nom}`,
        specialty: doctor.specialite,
        image: doctor.Photo && typeof doctor.Photo === 'string' ? doctor.Photo : null,
        about: `${doctor.description || ''}`,
        formation: doctor.formation || [],
        experience: doctor.experience || [],
        telephone: `${doctor.telephone}`,
        address: `${doctor.adresse || ''}`,
        email: `${doctor.mail}`,
        // Add original doctor data for compatibility
        nom: doctor.nom,
        prenom: doctor.prenom,
        specialite: doctor.specialite,
        Photo: doctor.Photo && typeof doctor.Photo === 'string' ? doctor.Photo : null,
        description: doctor.description,
        adresse: doctor.adresse,
        mail: doctor.mail,
        disponibilite: doctor.disponibilite || [],
      }));

      setDoctors(formattedDoctors);
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message || t("patient.myDoctors.loadError"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchDoctors();
    }
  }, [patientId]);

  const handleRefresh = () => {
    fetchDoctors();
  };
  const renderDoctor = ({ item, index }) => (
    <CardAnimation delay={index * 50}>      <View style={styles.card}>
        <View style={styles.cardContent}>
          <TouchableOpacity
            style={styles.doctorInfoSection}
            activeOpacity={0.9}
            onPress={() => {
              console.log('Navigating to DoctorInfo with:', {
                ...item,
                imageCheck: {
                  original: item.image,
                  type: typeof item.image,
                  isString: typeof item.image === 'string',
                  length: item.image ? item.image.length : 0
                }
              });
              navigation.navigate("DoctorInfo", { doctor: item });
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image 
                source={
                  item.image && typeof item.image === 'string' && item.image.trim() !== '' 
                    ? { uri: item.image } 
                    : require("../../assets/doctor.jpg")
                } 
                style={styles.avatar} 
                onError={(error) => {
                  console.log('Image loading error:', error);
                }}
              />
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{item.name}</Text>
                <Text style={styles.specialty}>{item.specialty}</Text>
                <Text style={styles.contact}>{item.telephone}</Text>
              </View>
            </View>
          </TouchableOpacity>
          
          <View style={styles.actionButtons}>            <TouchableOpacity 
              style={styles.messageButton}
              onPress={() => {
                console.log('Navigating to messaging with doctor:', item.name);
                navigation.navigate("ChatScreen", { 
                  patientId: patientId,
                  medecinId: item._id,
                  otherName: item.name
                });
              }}
            >
              <Ionicons name="chatbubble-outline" size={18} color="#fff" />
              <Text style={styles.messageText}>{t("patient.myDoctors.message")}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.infobutton}
              onPress={() => {
                navigation.navigate("DoctorInfo", { doctor: item });
              }}
            >
              <Ionicons name="information-circle-outline" size={18} color="#fff" />
              <Text style={styles.infoText}>{t("patient.myDoctors.info")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </CardAnimation>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5771f9" />
        <Text style={styles.loadingText}>{t("patient.myDoctors.loading")}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.screenContainer}>
        <View style={styles.errorContainer}>
          <Ionicons
            name="md-warning"
            size={50}
            color="#ef4444"
            style={styles.errorIcon}
          />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchDoctors}>
            <Text style={styles.retryText}>{t("patient.myDoctors.retry")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#5771f9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("patient.myDoctors.title")}</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <FlatList
        data={doctors}
        keyExtractor={(item) => item._id}
        renderItem={renderDoctor}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#5771f9"]}
            tintColor="#5771f9"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="medkit"
              size={60}
              color="#c7d2fe"
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>
              {t("patient.myDoctors.noDoctors")}
            </Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={fetchDoctors}
            >
              <Text style={styles.refreshText}>
                {t("patient.myDoctors.refresh")}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#f8f9ff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(87, 113, 249, 0.1)",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2d3748",
    letterSpacing: 0.5,
  },
  headerRightPlaceholder: {
    width: 28,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    marginHorizontal: 20,
    shadowColor: "#5771f9",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(163, 8, 21, 0.1)",
  },  cardContent: {
    flexDirection: "column",
  },
  doctorInfoSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 40,
    marginRight: 18,
    borderWidth: 2,
    borderColor: "#e0e7ff",
  },
  doctorInfo: {
    flex: 1,
  },

  doctorName: {
    fontWeight: "700",
    fontSize: 17,
    color: "#1e293b",
    marginBottom: 5,
  },
  specialty: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 5,
    fontWeight: "500",
  },
  contact: {
    fontSize: 14,
    color: "#647483",
    marginTop: 2,
    fontWeight: "500",
  },
  messageButton: {
    backgroundColor: "#10b981",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginRight: 5,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  messageText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    letterSpacing: 0.5,
    marginLeft: 5,
  },
  infobutton: {
    backgroundColor: "#5771f9",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginLeft: 5,
    shadowColor: "#5771f9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  infoText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    letterSpacing: 0.5,
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9ff",
  },
  loadingText: {
    marginTop: 15,
    color: "#64748b",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#fff",
    borderRadius: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  errorIcon: {
    marginBottom: 20,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 16,
    marginBottom: 25,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
  },
  retryButton: {
    backgroundColor: "#5771f9",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    shadowColor: "#5771f9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  retryText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  emptyIcon: {
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 17,
    color: "#475569",
    marginBottom: 25,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 24,
  },
  refreshButton: {
    backgroundColor: "#e0e7ff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  refreshText: {
    color: "#5771f9",
    fontWeight: "600",
    fontSize: 15,
  },
  listContent: {
    paddingBottom: 25,
    paddingTop: 15,
  },
});
