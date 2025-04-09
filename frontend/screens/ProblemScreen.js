import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import { API_URL } from '../config';
import { Picker } from '@react-native-picker/picker'; 

const ProblemesScreen = ({ navigation }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');  // For role filter
  const [dateSortOrder, setDateSortOrder] = useState('desc'); // For sorting date filter (ascending or descending)
  const isFocused = useIsFocused();

  const fetchProblems = async () => {
    try {
      let url = `${API_URL}/api/problems?`;

      if (roleFilter) url += `role=${roleFilter}&`;
      url += `dateSortOrder=${dateSortOrder}`; // Pass the date sort order as a query parameter

      const response = await fetch(url);
      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des problèmes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchProblems();
    }
  }, [isFocused, roleFilter, dateSortOrder]); // Re-fetch problems when filters change

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Problèmes Signalés</Text>
      </View>

      <View style={styles.filterContainer}>
        {/* Role Filter */}
        <Picker
          selectedValue={roleFilter}
          style={styles.picker}
          onValueChange={(itemValue) => setRoleFilter(itemValue)}>
          <Picker.Item label="All Roles" value="" />
          <Picker.Item label="Patient" value="Patient" />
          <Picker.Item label="Médecin" value="Médecin" />
        </Picker>

        {/* Date Sort Order Filter */}
        <Picker
          selectedValue={dateSortOrder}
          style={styles.picker}
          onValueChange={(itemValue) => setDateSortOrder(itemValue)}>
          <Picker.Item label="Date Croissant" value="asc" />
          <Picker.Item label="Date Décroissant" value="desc" />
        </Picker>
      </View>

      <FlatList
        data={problems}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.userItem, item.solved && { backgroundColor: '#e0ffe0' }]}
            onPress={() => navigation.navigate('ProblemDetailsScreen', { user: item })}
          >
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userRole}>{item.role}</Text>
            </View>
            <Text style={styles.userMessage}>{item.message}</Text>
            {item.solved && <Text style={styles.solvedLabel}>✔ Résolu</Text>}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',  // Soft background color
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#007bff',  // Main blue color
    borderBottomWidth: 1,
    borderBottomColor: '#0056b3',  // Darker blue for the border
  },
  headerButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  picker: {
    height: 50,
    marginBottom: 10,
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
  },
  content: {
    paddingHorizontal: 16,
  },
  userItem: {
    flexDirection: 'column',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4, // For Android shadow
  },
  userInfo: {
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userRole: {
    fontSize: 14,
    color: '#888',
  },
  userMessage: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
  },
  solvedLabel: {
    marginTop: 6,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
});

export default ProblemesScreen;
