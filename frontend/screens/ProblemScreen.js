import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ProblemesScreen = ({ navigation }) => {
  const usersWithProblems = [
    { id: '1', name: 'Ahmed Alaoui', role: 'Patient', message: 'Quand je clique sur le bouton langue, je reçois pas le choix des langues possibles.' },
    { id: '2', name: 'Dr Karim', role: 'Médecin', message: 'Je n\'arrive pas à ouvrir ma boîte messagerie.' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Problème</Text>
      </View>

      <View style={styles.content}>
        <FlatList
          data={usersWithProblems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userItem}
              onPress={() => navigation.navigate('ProblemDetailsScreen', { user: item })}
            >
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userRole}>{item.role}</Text>
              </View>
              <Text style={styles.userMessage}>{item.message}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  content: {
    flex: 1,
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
});

export default ProblemesScreen;
