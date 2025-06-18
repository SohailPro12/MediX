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
      
      console.log("Données des conversations:", data); // Ajoutez ceci
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
  console.log("Item complet:", item);

  const isDoctor = userRole === 'medecin';
  const otherUser = isDoctor ? item.patientId : item.medecinId;
  
  const messages = Array.isArray(item.messages) ? item.messages : [];
  const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;
  
  // Fonction pour déterminer le texte à afficher selon le type de message
  const getMessagePreview = (msg) => {
    if (!msg) return "Aucun message";
    
    // Si c'est un message texte normal
    if (msg.message || msg.content || msg.text) {
      return msg.message || msg.content || msg.text;
    }
    
    // Si c'est une image
    if (msg.imageUrl || msg.type === 'image') {
      return "📷 Photo";
    }
    
    // Si c'est un document
    if (msg.documentUrl || msg.type === 'document') {
      return "📄 Document";
    }
    
    // Si c'est un audio
    if (msg.audioUrl || msg.type === 'audio') {
      return "🎤 Message vocal";
    }
    
    // Cas par défaut
    return "Aucun message";
  };

  const messagePreview = getMessagePreview(lastMsg);
  const unreadCount = messages.filter(m => 
    m && !m.seen && m.receiver?.toString() === userId
  ).length;

  const profileImage = (otherUser.photo || otherUser.Photo) && 
                      (otherUser.photo || otherUser.Photo) !== "photo"
    ? { uri: otherUser.photo || otherUser.Photo }
    : null;
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
          {messagePreview}
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
      {userRole === 'medecin' ? (
        <Header name="Messagerie" screen="DashboardDoctor" />
      ) : (
        <Header name="Messagerie" screen="DashboardPatient" />
      )}
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
