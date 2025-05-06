// screens/Doctor/ReportScreen.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/DoctorComponents/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";

export default function ReportScreen() {
  const [message, setMessage] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // load existing reports by this user
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const res = await fetch(`${API_URL}/api/reporting?solved=false`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setReports(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const token = await AsyncStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/api/reporting/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });
      const { problem } = await res.json();
      if (res.ok) {
        setReports([problem, ...reports]);
        setMessage("");
      } else {
        console.error("Server error:", problem);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex:1,justifyContent:'center' }} size="large" />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white", paddingTop:'12%', padding:20 }}
    >
      <Header name="Signaler un Problème" screen="SettingsDScreen" />

      <FlatList
        data={reports}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf: item.solved ? "flex-start" : "flex-end",
              backgroundColor: item.solved ? "lightgreen" : "#007AFF",
              padding: 10,
              borderRadius: 15,
              margin: 5,
              maxWidth: "70%"
            }}
          >
            <Text style={{ color: "white" }}>{item.message}</Text>
            <Text style={{ color: "#eee", fontSize: 10 }}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        )}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingTop: 15,
          borderTopWidth: 1,
          borderColor: "#ddd"
        }}
      >
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
}
