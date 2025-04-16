import React from 'react';
import { View, Text,FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Header from '../../components/DoctorComponents/Header';
import SearchBar from '../../components/DoctorComponents/SearchBar';
import { useNavigation } from "@react-navigation/native";
const messages = [
  {
    id: '1',
    name: 'Ahmed ALaoui',
    role: 'Patient',
    message: 'Est ce que je dois prendre ce méde...',
    unread: true,
  },
  {
    id: '2',
    name: 'Ayoub',
    role: 'Patient',
    message: 'Merci Beaucoup',
    unread: false,
  },
];

export default function MessageListScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
    <Header name="messagerie"screen="DashboardDoctor"/>
    {/*la barre de recherche*/}
      <SearchBar searchplacehoder="Search"/>
       {/*list des comptes*/}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.messageItem} onPress={() => navigation.navigate("Chat", { name: item.name })}>
            <Image source={require('../../assets/doctor.png')} style={styles.avatar} />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.role}>{item.role}</Text>
              <Text style={styles.message} numberOfLines={1}>{item.message}</Text>
            </View>
            {item.unread && <View style={styles.unreadBadge}><Text style={styles.unreadText}>1</Text></View>}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFC', paddingTop: 50,padding:'3%', },
  messageItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#D1D5DB' },
  textContainer: { flex: 1, marginLeft: 10 },
  name: { fontWeight: 'bold' },
  role: { fontSize: 12, color: 'gray' },
  message: { color: 'gray' },
  unreadBadge: { backgroundColor: 'blue', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  unreadText: { color: 'white', fontSize: 12 },
});
