import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../config';

const ProblemDetailsScreen = ({ route }) => {
  const { user } = route.params;
  const navigation = useNavigation();

  const markAsSolved = async () => {
    try {
      const res = await fetch(`${API_URL}/api/problems/${user._id}/solve`, {
        method: 'PATCH',
      });
      if (res.ok) {
        Alert.alert('Succès', 'Marqué comme résolu');
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', "Impossible de marquer comme résolu.");
    }
  };

  const deleteProblem = async () => {
    Alert.alert("Confirmation", "Supprimer ce problème ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/api/problems/${user._id}`, {
              method: 'DELETE',
            });
            if (res.ok) {
              Alert.alert('Supprimé', 'Le problème a été supprimé');
              navigation.goBack();
            }
          } catch (error) {
            console.error(error);
            Alert.alert('Erreur', "Échec de la suppression.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{user.name}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.role}>{user.role}</Text>
        <Text style={styles.message}>{user.message}</Text>

        {!user.solved && (
          <TouchableOpacity style={styles.button} onPress={markAsSolved}>
            <Text style={styles.buttonText}>✅ Marquer comme résolu</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.button, { backgroundColor: '#ff4d4d' }]} onPress={deleteProblem}>
          <Text style={styles.buttonText}>🗑 Supprimer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  role: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1abc9c',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProblemDetailsScreen;