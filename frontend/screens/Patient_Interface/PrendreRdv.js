import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Header from "../../components/PatientComponents/Header";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { usePatient } from "../../screens/context/PatientContext";
import { API_URL } from "../../config";
import { useTranslation } from "react-i18next";

const PrendreRdv = () => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [consultationReason, setConsultationReason] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigation = useNavigation();

  const { patient } = usePatient();
  const [nom, setNom] = useState(patient?.nom || "");
  const [prenom, setPrenom] = useState(patient?.prenom || "");
  const [cin, setCin] = useState(patient?.cin || "");
  const [telephone, setTelephone] = useState(patient?.telephone || "");
  const [mail, setMail] = useState(patient?.mail || "");

  const route = useRoute();
  const doctorInfo = route.params;
  const dayNames = [
    t("patient.bookAppointment.days.sunday"),
    t("patient.bookAppointment.days.monday"),
    t("patient.bookAppointment.days.tuesday"),
    t("patient.bookAppointment.days.wednesday"),
    t("patient.bookAppointment.days.thursday"),
    t("patient.bookAppointment.days.friday"),
    t("patient.bookAppointment.days.saturday"),
  ];

  // Map backend day names to frontend day names
  const mapBackendDayToFrontend = (backendDay) => {
    const dayMapping = {
      'dimanche': t("patient.bookAppointment.days.sunday"),
      'lundi': t("patient.bookAppointment.days.monday"),
      'mardi': t("patient.bookAppointment.days.tuesday"),
      'mercredi': t("patient.bookAppointment.days.wednesday"),
      'jeudi': t("patient.bookAppointment.days.thursday"),
      'vendredi': t("patient.bookAppointment.days.friday"),
      'samedi': t("patient.bookAppointment.days.saturday"),
    };
    return dayMapping[backendDay.toLowerCase()] || backendDay;
  };

  // Noms des jours de la semaine
  const generateAllAvailableSlots = () => {
    const allSlots = {};
    
    // Use disponibilite (backend field) or availability (frontend field)
    const availability = doctorInfo.disponibilite || doctorInfo.availability || [];

    availability.forEach((availability) => {
      const backendDay = availability.jour;
      const frontendDay = mapBackendDayToFrontend(backendDay);
      console.log(`Backend day: ${backendDay}, Frontend day: ${frontendDay}`);

      if (!dayNames.includes(frontendDay)) {
        console.warn(`Day ${frontendDay} not found in dayNames`);
        return; // Sécurité
      }

      const [startHour, startMinute] = availability.heureDebut
        .split(":")
        .map(Number);
      const [endHour, endMinute] = availability.heureFin.split(":").map(Number);

      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;
      const slotDuration = 30;

      const slots = [];

      for (let time = startTime; time < endTime; time += slotDuration) {
        const hours = Math.floor(time / 60);
        const minutes = time % 60;
        const slot = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`;
        slots.push(slot);
      }

      allSlots[frontendDay] = slots;
    });

    return allSlots;
  };

  const availableSlotsByDay = generateAllAvailableSlots();
  const selectedDayName = dayNames[selectedDate.getDay()];
  const availableSlots = availableSlotsByDay[selectedDayName] || [];

  console.log(availableSlotsByDay);

  // Fonction pour générer les jours du calendrier
  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();

    const calendarDays = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today && !isToday;
      const isSelected = date.toDateString() === selectedDate.toDateString();      const dayName = dayNames[date.getDay()];
      const availability = doctorInfo.disponibilite || doctorInfo.availability || [];
      const isAvailable =
        !isPast && availability.some((d) => mapBackendDayToFrontend(d.jour) === dayName);

      calendarDays.push({
        day,
        date,
        isToday,
        isPast,
        isSelected,
        isAvailable,
      });
    }

    return calendarDays;
  };

  // Fonctions utilitaires restantes...
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };
  const formatMonthYear = (date) => {
    const months = [
      t("patient.bookAppointment.months.january"),
      t("patient.bookAppointment.months.february"),
      t("patient.bookAppointment.months.march"),
      t("patient.bookAppointment.months.april"),
      t("patient.bookAppointment.months.may"),
      t("patient.bookAppointment.months.june"),
      t("patient.bookAppointment.months.july"),
      t("patient.bookAppointment.months.august"),
      t("patient.bookAppointment.months.september"),
      t("patient.bookAppointment.months.october"),
      t("patient.bookAppointment.months.november"),
      t("patient.bookAppointment.months.december"),
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleConfirm = async () => {
    if (!selectedTimeSlot) return;
    const [hours, minutes] = selectedTimeSlot.split(":").map(Number);
    const fullDateTime = new Date(selectedDate);
    fullDateTime.setHours(hours);
    fullDateTime.setMinutes(minutes);
    fullDateTime.setSeconds(0);
    fullDateTime.setMilliseconds(0);

    const rendezVousData = {
      nom,
      prenom,
      cin,
      telephone,
      mail,
      motif: consultationReason,
      date: fullDateTime,
      MedecinId: doctorInfo._id,
      PatientId: patient?._id,
    };

    try {
      const response = await fetch(`${API_URL}/api/patient/PostAppointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rendezVousData),
      });
      if (response.ok) {
        setShowAlert(true); // Affiche le modal    } else {
        const errorData = await response.json();
        alert(t("patient.bookAppointment.errors.booking") + errorData.message);
      }
    } catch (error) {
      console.error(error);
      alert(t("patient.bookAppointment.errors.occurred"));
    }
  };

  return (
    <View style={styles.container}>
      <Header param={t("patient.bookAppointment.title")} rja3="SearchDoctor" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Carte du médecin */}
        <View style={styles.doctorCard}>
          <View style={styles.doctorRow}>            {doctorInfo.image || doctorInfo.Photo ? (
              <Image
                source={{ uri: doctorInfo.image || doctorInfo.Photo }}
                style={styles.doctorImage}
              />
            ) : (
              <Image
                source={require("../../assets/doctor.jpg")}
                style={styles.doctorImage}
              />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.doctorName}>
                {doctorInfo.name || `Dr. ${doctorInfo.nom || ""} ${doctorInfo.prenom || ""}`.trim()}
              </Text>
              <Text style={styles.doctorSpecialty}>
                {doctorInfo.specialty || doctorInfo.specialite}
              </Text>
              <View style={styles.locationRow}>
                <FontAwesome name="map-marker" size={16} color="#666" />
                <Text style={styles.locationText}>
                  {doctorInfo.address || doctorInfo.adresse}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* Sélection de date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("patient.bookAppointment.selectDate")}
          </Text>
          <View style={styles.monthRow}>
            <TouchableOpacity onPress={() => navigateMonth(-1)}>
              <FontAwesome name="chevron-left" size={20} color="#3B82F6" />
            </TouchableOpacity>
            <Text style={styles.monthText}>
              {formatMonthYear(selectedDate)}
            </Text>
            <TouchableOpacity onPress={() => navigateMonth(1)}>
              <FontAwesome name="chevron-right" size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          <View style={styles.calendarGrid}>
            {dayNames.map((day, idx) => (
              <Text key={idx} style={styles.dayName}>
                {day}
              </Text>
            ))}
            {generateCalendarDays().map((day, idx) => (
              <View key={idx} style={styles.calendarCell}>
                {day ? (
                  <TouchableOpacity
                    style={[
                      styles.dayButton,
                      day.isSelected && styles.selectedDay,
                      day.isToday && styles.today,
                      day.isAvailable && styles.availableDay,
                    ]}
                    onPress={() =>
                      day.isAvailable && handleDateSelect(day.date)
                    }
                    disabled={!day.isAvailable}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        day.isSelected && { color: "#fff" },
                        day.isToday && { color: "#1D4ED8" },
                        !day.isAvailable && { color: "#ccc" },
                      ]}
                    >
                      {day.day}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{ width: 32, height: 32 }} />
                )}
              </View>
            ))}
          </View>
        </View>
        {/* Sélection des horaires */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("patient.bookAppointment.availableSlots")}
          </Text>

          {availableSlots.length > 0 ? (
            <View style={styles.slotGrid}>
              {availableSlots.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.slotButton,
                    selectedTimeSlot === slot && styles.selectedSlot,
                  ]}
                  onPress={() => handleTimeSlotSelect(slot)}
                >
                  <Text
                    style={[
                      styles.slotText,
                      selectedTimeSlot === slot && { color: "#fff" },
                    ]}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.noSlotsText}>
              {t("patient.bookAppointment.noSlotsAvailable")}
            </Text>
          )}
        </View>
        {/* Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("patient.bookAppointment.myInfo")}
          </Text>
          <Text style={styles.label}>
            {t("patient.bookAppointment.form.lastName")}
          </Text>
          <TextInput
            style={styles.textInput}
            value={nom}
            onChangeText={setNom}
          />
          <Text style={styles.label}>
            {t("patient.bookAppointment.form.firstName")}
          </Text>
          <TextInput
            style={styles.textInput}
            value={prenom}
            onChangeText={setPrenom}
          />
          <Text style={styles.label}>
            {t("patient.bookAppointment.form.cin")}
          </Text>
          <TextInput
            style={styles.textInput}
            value={cin}
            onChangeText={setCin}
          />
          <Text style={styles.label}>
            {t("patient.bookAppointment.form.phone")}
          </Text>
          <TextInput
            style={styles.textInput}
            keyboardType="phone-pad"
            value={telephone}
            onChangeText={setTelephone}
          />
          <Text style={styles.label}>
            {t("patient.bookAppointment.form.email")}
          </Text>
          <TextInput
            style={styles.textInput}
            keyboardType="email-address"
            autoCapitalize="none"
            value={mail}
            onChangeText={setMail}
          />
        </View>
        {/* Motif de consultation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("patient.bookAppointment.consultationReason")}
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder={t("patient.bookAppointment.reasonPlaceholder")}
            multiline
            maxLength={200}
            value={consultationReason}
            onChangeText={setConsultationReason}
          />
          <Text style={styles.charCount}>{consultationReason.length}/200</Text>
        </View>
        {/* Bouton de confirmation */}
        <TouchableOpacity
          style={[styles.confirmButton, !selectedTimeSlot && { opacity: 0.6 }]}
          disabled={!selectedTimeSlot}
          onPress={handleConfirm}
        >
          <FontAwesome
            name="check-circle"
            size={18}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.confirmText}>
            {t("patient.bookAppointment.confirmAppointment")}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal d'alerte */}
      <Modal
        visible={showAlert}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowAlert(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {t("patient.bookAppointment.modal.title")}
            </Text>
            <Text style={styles.modalMessage}>
              {t("patient.bookAppointment.modal.message", {
                doctorName: doctorInfo.name,
                date: selectedDate.toLocaleDateString(),
                time: selectedTimeSlot,
              })}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowAlert(false);
                navigation.navigate("DashboardPatient");
              }}
            >
              <Text style={styles.closeButtonText}>
                {t("patient.bookAppointment.modal.close")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", marginTop: 6 },
  scrollContent: { paddingBottom: 60 },
  doctorCard: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 10,
    padding: 16,
    elevation: 2,
  },
  doctorRow: { flexDirection: "row", alignItems: "center" },
  doctorImage: { width: 80, height: 80, borderRadius: 40, marginRight: 16 },
  doctorName: { fontSize: 18, fontWeight: "bold", color: "#1F2937" },
  doctorSpecialty: { color: "#2563EB", fontWeight: "600" },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  locationText: { marginLeft: 4, color: "#6B7280", fontSize: 13 },
  section: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 10,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  monthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  monthText: { fontSize: 16, fontWeight: "600" },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap" },
  dayName: {
    width: `${100 / 7}%`,
    textAlign: "center",
    fontSize: 12,
    color: "#6B7280",
  },
  calendarCell: {
    width: `${100 / 7}%`,
    alignItems: "center",
    marginVertical: 4,
  },
  dayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDay: { backgroundColor: "#2563EB" },
  today: { backgroundColor: "#DBEAFE" },
  dayText: { fontSize: 14 },
  subTitle: { fontSize: 16, fontWeight: "600", marginTop: 10, marginBottom: 6 },
  slotGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  slotButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#DBEAFE",
    borderRadius: 8,
    margin: 4,
  },
  selectedSlot: { backgroundColor: "#2563EB" },
  unavailableSlot: { backgroundColor: "#E5E7EB" },
  slotText: { fontSize: 12, color: "#1D4ED8" },
  textArea: {
    height: 100,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 12,
    textAlignVertical: "top",
  },
  charCount: {
    textAlign: "right",
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 4,
  },
  confirmButton: {
    backgroundColor: "#2563EB",
    margin: 16,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  confirmText: { color: "white", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563EB",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  closeButtonText: { color: "white", fontWeight: "bold" },
  noSlotsText: {
    color: "#6B7280",
    textAlign: "center",
    marginVertical: 10,
    fontStyle: "italic",
  },
  availableDay: {
    borderColor: "#10B981",
    borderWidth: 1.5,
  },
  label: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 7,
    marginTop: 18,
  },

  textInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },
});
export default PrendreRdv;
