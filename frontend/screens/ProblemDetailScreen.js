import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

const ProblemDetailsScreen = ({ route }) => {
    const { user } = route.params;
    const navigation = useNavigation();
  
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
  },
});

export default ProblemDetailsScreen;
