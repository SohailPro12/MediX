// Importations nécessaires depuis React et React Native
import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet,Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Importation des icônes
import Header from '../../components/PatientComponents/Header';
import { useRoute } from "@react-navigation/native";

// Définition du composant principal App
 const  PrendreRdv = () => {
  // États pour stocker la date sélectionnée, le créneau horaire et le motif de consultation
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [consultationReason, setConsultationReason] = useState('');
  const [showAlert, setShowAlert] = useState(false); // État pour gérer l'affichage du modal
  const route = useRoute();
  const doctorInfo = route.params;

    // Fonction pour afficher l'alerte
    const handleConfirm = () => {
      // Affiche l'alerte une fois que le bouton est cliqué
      if (selectedTimeSlot) {
        setShowAlert(true);
      }
    };

  // Créneaux horaires disponibles
  const morningSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
  const afternoonSlots = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

  // Noms des jours de la semaine
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  // Fonction pour générer les jours du calendrier du mois actuel
  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();

    const calendarDays = [];

    // Ajouter des cellules vides si le mois ne commence pas dimanche
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(null);
    }

    // Générer les jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today && !isToday;
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const isAvailable = !isPast && day % 3 !== 0; // Simule la disponibilité

      calendarDays.push({ day, date, isToday, isPast, isSelected, isAvailable });
    }

    return calendarDays;
  };

  // Vérifie si un créneau horaire est disponible
  const isSlotAvailable = (slot) => {
    const slotNumber = parseInt(slot.replace(':', ''));
    return slotNumber % 100 !== 0; // Exclure les créneaux à pile (ex: 09:00)
  };

  // Sélection d'une date
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset du créneau choisi
  };

  // Sélection d'un créneau horaire
  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
  };

  // Naviguer entre les mois du calendrier
  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  // Formater le mois et l'année affichés
  const formatMonthYear = (date) => {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Affichage de l'interface utilisateur
  return (
    <View style={styles.container}>
    <Header param="Planifier Rendez-vous" rja3="SearchDoctor"/>  
      <ScrollView contentContainerStyle={ {flexGrow: 1}}>

        {/* Carte du médecin */}
        <View style={styles.doctorCard}>
      <View style={styles.doctorRow}>
        <Image source={typeof doctorInfo.imageUrl === 'number' ? doctorInfo.imageUrl : { uri: doctorInfo.imageUrl }} style={styles.doctorImage} />
        <View style={{ flex: 1 }}>
          <Text style={styles.doctorName}>{doctorInfo.name}</Text>
          <Text style={styles.doctorSpecialty}>{doctorInfo.specialty}</Text>
          
          <View style={styles.locationRow}>
            <FontAwesome name="map-marker" size={16} color="#666" />
            <Text style={styles.locationText}>{doctorInfo.address}</Text>
          </View>
        </View>
      </View>
    </View>

        {/* Sélection de date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sélectionner une date</Text>
          <View style={styles.monthRow}>
            <TouchableOpacity onPress={() => navigateMonth(-1)}>
              <FontAwesome name="chevron-left" size={20} color="#3B82F6" />
            </TouchableOpacity>
            <Text style={styles.monthText}>{formatMonthYear(selectedDate)}</Text>
            <TouchableOpacity onPress={() => navigateMonth(1)}>
              <FontAwesome name="chevron-right" size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          {/* Grille du calendrier */}
          <View style={styles.calendarGrid}>
            {dayNames.map((day, idx) => (
              <Text key={idx} style={styles.dayName}>{day}</Text>
            ))}
            {generateCalendarDays().map((day, idx) => (
              <View key={idx} style={styles.calendarCell}>
                {day ? (
                  <TouchableOpacity
                    style={[
                      styles.dayButton,
                      day.isSelected && styles.selectedDay,
                      day.isToday && styles.today,
                      !day.isAvailable && styles.unavailableDay
                    ]}
                    onPress={() => day.isAvailable && handleDateSelect(day.date)}
                    disabled={!day.isAvailable}
                  >
                    <Text style={[
                      styles.dayText,
                      day.isSelected && { color: '#fff' },
                      day.isToday && { color: '#1D4ED8' },
                      !day.isAvailable && { color: '#ccc' }
                    ]}>
                      {day.day}
                    </Text>
                  </TouchableOpacity>
                ) : <View style={{ width: 32, height: 32 }} />}
              </View>
            ))}
          </View>
        </View>

        {/* Sélection des horaires */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horaires disponibles</Text>

          {/* Matin */}
          <Text style={styles.subTitle}>Matin</Text>
          <View style={styles.slotGrid}>
            {morningSlots.map(slot => {
              const available = isSlotAvailable(slot);
              return (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.slotButton,
                    selectedTimeSlot === slot && styles.selectedSlot,
                    !available && styles.unavailableSlot
                  ]}
                  onPress={() => available && handleTimeSlotSelect(slot)}
                  disabled={!available}
                >
                  <Text style={[
                    styles.slotText,
                    selectedTimeSlot === slot && { color: '#fff' },
                    !available && { color: '#ccc' }
                  ]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Après-midi */}
          <Text style={styles.subTitle}>Après-midi</Text>
          <View style={styles.slotGrid}>
            {afternoonSlots.map(slot => {
              const available = isSlotAvailable(slot);
              return (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.slotButton,
                    selectedTimeSlot === slot && styles.selectedSlot,
                    !available && styles.unavailableSlot
                  ]}
                  onPress={() => available && handleTimeSlotSelect(slot)}
                  disabled={!available}
                >
                  <Text style={[
                    styles.slotText,
                    selectedTimeSlot === slot && { color: '#fff' },
                    !available && { color: '#ccc' }
                  ]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Motif de consultation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Motif de consultation</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Décrivez brièvement le motif de votre consultation"
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
          onPress={handleConfirm}// Afficher l'alerte à la confirmation
        >
          <FontAwesome name="check-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.confirmText}>Confirmer le rendez-vous</Text>
        </TouchableOpacity>

      </ScrollView>
        {/* Modal d'alerte */}
        <Modal
  visible={showAlert}
  animationType="fade"
  transparent={true}
  onRequestClose={() => setShowAlert(false)} // Fermer le modal si on clique en dehors
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>
        Rendez-vous confirmé
      </Text>
      <Text style={styles.modalMessage}>
        {`Votre rendez-vous avec ${doctorInfo.name} est confirmé pour le ${selectedDate.toLocaleDateString()} à ${selectedTimeSlot}.`}
      </Text>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setShowAlert(false)}
      >
        <Text style={styles.closeText}>Fermer</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

</View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB',marginTop:6 },
  scrollContent: { paddingBottom: 60 },
  doctorCard: { backgroundColor: 'white', margin: 16, borderRadius: 10, padding: 16, elevation: 2 },
  doctorRow: { flexDirection: 'row', alignItems: 'center' },
  doctorImage: { width: 80, height: 80, borderRadius: 40, marginRight: 16 },
  doctorName: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  doctorSpecialty: { color: '#2563EB', fontWeight: '600' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  locationText: { marginLeft: 4, color: '#6B7280', fontSize: 13 },
  section: { backgroundColor: 'white', margin: 16, borderRadius: 10, padding: 16, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  monthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  monthText: { fontSize: 16, fontWeight: '600' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayName: { width: `${100/7}%`, textAlign: 'center', fontSize: 12, color: '#6B7280' },
  calendarCell: { width: `${100/7}%`, alignItems: 'center', marginVertical: 4 },
  dayButton: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  selectedDay: { backgroundColor: '#2563EB' },
  today: { backgroundColor: '#DBEAFE' },
  dayText: { fontSize: 14 },
  subTitle: { fontSize: 16, fontWeight: '600', marginTop: 10, marginBottom: 6 },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotButton: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#DBEAFE', borderRadius: 8, margin: 4 },
  selectedSlot: { backgroundColor: '#2563EB' },
  unavailableSlot: { backgroundColor: '#E5E7EB' },
  slotText: { fontSize: 12, color: '#1D4ED8' },
  textArea: { height: 100, backgroundColor: '#F3F4F6', borderRadius: 8, padding: 12, textAlignVertical: 'top' },
  charCount: { textAlign: 'right', color: '#9CA3AF', fontSize: 12, marginTop: 4 },
  confirmButton: { backgroundColor: '#2563EB', margin: 16, padding: 14, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  confirmText: { color: 'white', fontWeight: 'bold' },
  modalOverlay: {flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: 'rgba(0, 0, 0, 0.5)'},
  modalContainer: { backgroundColor: 'white',padding: 20,borderRadius: 10,width: 300,alignItems: 'center',elevation: 10, },
  modalTitle: {fontSize: 20,fontWeight: 'bold',color: '#2563EB',marginBottom: 10},
  modalMessage: {fontSize: 16,color: '#4B5563',textAlign: 'center',marginBottom: 20},
  closeButton: {backgroundColor: '#2563EB',paddingVertical: 10,paddingHorizontal: 30,borderRadius: 5},
  closeText: {color: 'white',fontWeight: 'bold'}
});
export default PrendreRdv;