import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/PatientComponents/Header';
import { useRoute } from "@react-navigation/native";

export default function Chat() {
   {/*les messages pour tester */}
  const [messages, setMessages] = useState([
    { id: '1', text: 'Bonjour Docteur', sender: 'other' },
    { id: '2', text: 'ça va ?', sender: 'other' },
    { id: '3', text: 'Bonjour Ahmed', sender: 'me' },
    { id: '4', text: 'Tout va bien merci', sender: 'me' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: (messages.length + 1).toString(),
      text: newMessage,
      sender: 'me',
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };
  const route = useRoute();
  const { name } = route.params;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header param={name} rja3="Messagerie"/>


      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.sender === 'me' ? styles.myMessage : styles.otherMessage]}>
            {item.name && <Text style={styles.senderName}>{item.name}</Text>}
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity onPress={handleSend}>
          <Ionicons name="send" size={24} color="#069af5" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: '#fff',paddingTop:12},
  messageContainer: { padding: 10, borderRadius: 10, marginVertical: 9, marginHorizontal: 14, maxWidth: '75%' },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#05cbe6' },
  otherMessage: { alignSelf: 'flex-start', backgroundColor: '#F2F3F5' },
  senderName: { fontWeight: 'bold', marginBottom: 3 },
  messageText: { color: '#000' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F3F5', padding: 10, borderRadius: 20, margin: 10 },
  input: { flex: 1, marginHorizontal: 10 },
});
