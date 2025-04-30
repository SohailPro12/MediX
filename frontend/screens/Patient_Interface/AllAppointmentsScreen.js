import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons, FontAwesome5, Entypo } from '@expo/vector-icons';


const appointments = [
  {
    id: '1',
    name: 'Dr. Olivia Turner, M.D.',
    specialty: 'Dermato-Endocrinology',
    date: '2025-04-12',
    time: '09:30',
    image: require('../../assets/doctor.jpg'),
  },
  {
    id: '2',
    name: 'Dr. Alexander Bennett, Ph.D.',
    specialty: 'Dermato-Genetics',
    date: '2025-06-20',
    time: '14:30',
    image: require('../../assets/doctor.jpg'),
  },
  {
    id: '3',
    name: 'Dr. Sophia Martinez, Ph.D.',
    specialty: 'Cosmetic Bioengineering',
    date: '2025-01-15',
    time: '09:30',
    image: require('../../assets/doctor.jpg'),
  },
];

const StarRating = ({ rating, onChange }) => {
  return (
    <View style={{ flexDirection: 'row', margin:9,justifyContent:'center', }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onChange(star)}>
          <Entypo
            name="star"
            size={20}
            color={star <= rating ? '#FFD700' : '#ccc'}
            style={{ marginHorizontal: 6 }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function AllAppointmentsScreen({navigation}) {
  const [selectedTab, setSelectedTab] = useState('Upcoming');

  const [ratings, setRatings] = useState({});
  const [hasRated, setHasRated] = useState({});
  const [isEditingRating, setIsEditingRating] = useState({});
  const [tempRatings, setTempRatings] = useState({});

  const isAppointmentComplete = (appointment) => {
    const now = new Date();
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}:00`);
    return appointmentDateTime < now;
  };

  const handleStartRating = (id) => {
    setIsEditingRating((prev) => ({ ...prev, [id]: true }));
    setTempRatings((prev) => ({ ...prev, [id]: ratings[id] || 0 }));
  };

  const handleSaveRating = (id) => {
    if (tempRatings[id]) {
      setRatings((prev) => ({ ...prev, [id]: tempRatings[id] }));
      setHasRated((prev) => ({ ...prev, [id]: true }));
    }
    setIsEditingRating((prev) => ({ ...prev, [id]: false }));
  };

  const renderAppointment = ({ item }) => {
    const completed = isAppointmentComplete(item);
    if (selectedTab === 'Complete' && !completed) return null;
    if (selectedTab === 'Upcoming' && completed) return null;

    const isEditing = isEditingRating[item.id];

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={item.image} style={styles.avatar} />
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={styles.doctorName}>{item.name}</Text>
              <Text style={styles.specialty}>{item.specialty}</Text>
            </View>
          </View>

          {selectedTab === 'Complete' ? (
            <>
              {isEditing ? (
                <>
                  <StarRating
                    rating={tempRatings[item.id]}
                    onChange={(newRating) =>
                      setTempRatings((prev) => ({ ...prev, [item.id]: newRating }))
                    }
                  />
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.reviewButton}
                      onPress={() => handleSaveRating(item.id)}
                    >
                      <Text style={styles.reviewText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  {hasRated[item.id] && (
/*                     <View style={styles.ratingRow}>
                      <Entypo name="star" size={20} color="#FFD700" />
                      <Text style={styles.ratingText}>{ratings[item.id]}</Text>
                    </View> */
                    <View style={{ flexDirection: 'row', margin: 0,justifyContent:'center' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                          <Entypo
                          key={star}
                            name="star"
                            size={20}
                            color={star <= ratings[item.id] ? '#FFD700' : '#ccc'}
                            style={{ marginHorizontal: 2 }}
                          />
                      ))}
                  </View>
                  )}
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.reviewButton}
                      onPress={() => handleStartRating(item.id)}
                    >
                      <Text style={styles.reviewText}>Rating</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </>
          ) : (
            <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center', justifyContent: 'center' }}>
              <View style={styles.row}>
                <FontAwesome5 name="calendar-alt" size={16} color="#5771f9" />
                <Text style={styles.infoText}>{new Date(item.date).toDateString()}</Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="time-outline" size={16} color="#5771f9" />
                <Text style={styles.infoText}>{item.time}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.navigate("DashboardPatient")}>
          <Ionicons name="chevron-back" size={28} color="#5771f9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Appointments</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Complete' && styles.activeTab]}
          onPress={() => setSelectedTab('Complete')}
        >
          <Text style={[styles.tabText, selectedTab === 'Complete' && styles.activeTabText]}>
            Complete
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Upcoming' && styles.activeTab]}
          onPress={() => setSelectedTab('Upcoming')}
        >
          <Text style={[styles.tabText, selectedTab === 'Upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
      </View>

      {/* Appointments List */}
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={renderAppointment}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 10,
    backgroundColor: '#E0E4FF',
  },
  activeTab: {
    backgroundColor: '#5771f9',
  },
  tabText: {
    color: '#5771f9',
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#E0E4FF',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  doctorName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
    color: '#333',
  },
  specialty: {
    color: '#666',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginHorizontal: 3,
  },
  infoText: {
    marginLeft: 6,
    color: '#666',
    fontSize: 14,
  },
  ratingRow: {
    flexDirection: 'row',
    marginBottom: 0,
    marginHorizontal:'35%'
  },
  ratingText: {
    marginLeft: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent:'flex-end'
  },
  reviewButton: {
    backgroundColor: '#5771f9',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    width:100,
  },
  reviewText: {
    color: 'white',
    fontWeight: '600',
    textAlign:'center'
  },
});