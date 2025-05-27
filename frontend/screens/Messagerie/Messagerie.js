import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Header from "../../components/DoctorComponents/Header";
import SearchBar from "../../components/DoctorComponents/SearchBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../../config";
import { Image } from "react-native";

export default function MessageListScreen() {
  const navigation = useNavigation();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
const [userId, setUserId] = useState(null);
const [userRole, setUserRole] = useState(null);

useEffect(() => {
  const loadUserInfo = async () => {
    const token = await AsyncStorage.getItem('authToken');
    const user = JSON.parse(atob(token.split('.')[1])); // assumes JWT
    setUserId(user.id);
    setUserRole(user.role); // "Patient" or "Medecin"
  };
  loadUserInfo();
}, []);

  const fetchConvos = useCallback(async () => {
    setRefreshing(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/api/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Échec chargement");
      const data = await res.json();

      setConversations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchConvos();
  }, [fetchConvos]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#75E1E5" />
      </View>
    );
  }

const renderItem = ({ item }) => {
  const isDoctor = userRole === 'medecin';
console.log("userRole", userRole);
  const otherUser = isDoctor ? item.patientId : item.medecinId;
  const lastMsg = item.messages[item.messages.length - 1];
  const unreadCount = item.messages.filter(m => !m.seen && m.receiver.toString() === userId).length;

  const profileImage = (otherUser.photo || otherUser.Photo) && (otherUser.photo || otherUser.Photo) !== "photo"
    ? { uri: otherUser.photo || otherUser.Photo }
    : null;
console.log("profileimage", profileImage);
  return (

    <TouchableOpacity
      style={styles.messageItem}
      onPress={() =>
        navigation.navigate('ChatScreen', {
          patientId: item.patientId._id,
          medecinId: item.medecinId._id,
          otherName: `${otherUser.nom} ${otherUser.prenom}`,
        })
      }
    >
      {profileImage ? (
        <Image source={profileImage} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, { backgroundColor: '#007bff' }]} />
      )}

      <View style={styles.textContainer}>
        <Text style={styles.name}>{otherUser.nom} {otherUser.prenom}</Text>
        <Text style={styles.message} numberOfLines={1}>
          {lastMsg?.message || "Aucun message"}
        </Text>
      </View>

      {unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

  return (
    <View style={styles.container}>
      <Header name="Messagerie" screen="DashboardDoctor" />
      <SearchBar searchplacehoder="Rechercher..." />
      <FlatList
        data={conversations}
        keyExtractor={(item) => `${item.patientId._id}_${item.medecinId._id}`}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={fetchConvos}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text>Aucune conversation</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFC", paddingTop: 50 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D1D5DB",
  },
  textContainer: { flex: 1, marginLeft: 10 },
  name: { fontWeight: "bold" },
  message: { color: "gray", marginTop: 4 },
  unreadBadge: {
    backgroundColor: "#4287f5",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: { color: "white", fontSize: 12 },
});
