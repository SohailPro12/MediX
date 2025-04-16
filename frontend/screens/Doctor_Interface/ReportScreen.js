import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, FlatList, Text, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/DoctorComponents/Header";

const ReportScreen = ({ navigation }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // Stocker les messages localement

  // Fonction pour ajouter le message localement
  const sendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      text: message,
      createdAt: new Date().toISOString(), // Date actuelle
    };

    setMessages([...messages, newMessage]); // Ajoute le message au tableau
    setMessage(""); // Réinitialise le champ de texte
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, backgroundColor: "white",paddingTop:'12%',padding:20}}>
      {/* Header */}
      <Header name='Signaler un Problème' screen='SettingsDScreen'/>
      

      {/* Liste des messages */}
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ alignSelf: "flex-end", backgroundColor: "#007AFF", padding: 10, borderRadius: 15, margin: 5, maxWidth: "70%" }}>
            <Text style={{ color: "white" }}>{item.text}</Text>
          </View>
        )}
      />

      {/* Barre de saisie */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 15, borderTopWidth: 1, borderColor: "#ddd" }}>
        <TextInput
          style={{ flex: 1, padding: 10, backgroundColor: "#f5f5f5", borderRadius: 20 }}
          placeholder="Écrire un message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={{ marginLeft: 10 }}>
          <Ionicons name="send" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ReportScreen;