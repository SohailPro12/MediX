// Updated ChatScreen.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  Modal,
  Linking,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../components/DoctorComponents/Header";
import { API_URL } from "../../config";
import { useRoute } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const timeAgo = (isoDate) => {
  const date = new Date(isoDate);
  const now = new Date();
  const deltaSeconds = Math.floor((now - date) / 1000);
  
  // Moins d'une minute
  if (deltaSeconds < 60) {
    return "Vu à l'instant";
  }
  
  // Moins d'une heure
  const deltaMinutes = Math.floor(deltaSeconds / 60);
  if (deltaMinutes < 60) {
    return deltaMinutes === 1 
      ? "Vu il y a 1 minute" 
      : `Vu il y a ${deltaMinutes} minutes`;
  }
  
  // Moins d'un jour
  const deltaHours = Math.floor(deltaMinutes / 60);
  if (deltaHours < 24) {
    return deltaHours === 1 
      ? "Vu il y a 1 heure" 
      : `Vu il y a ${deltaHours} heures`;
  }
  
  // Moins d'une semaine
  const deltaDays = Math.floor(deltaHours / 24);
  if (deltaDays < 7) {
    return deltaDays === 1 
      ? "Vu hier" 
      : `Vu il y a ${deltaDays} jours`;
  }
  
  // Moins d'un mois
  const deltaWeeks = Math.floor(deltaDays / 7);
  if (deltaWeeks < 4) {
    return deltaWeeks === 1 
      ? "Vu il y a 1 semaine" 
      : `Vu il y a ${deltaWeeks} semaines`;
  }
  
  // Date complète si plus ancien
  return `Vu le ${date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`;
};

export default function ChatScreen() {
  const { patientId, medecinId, otherName } = useRoute().params;
  const flatListRef = useRef();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [recording, setRecording] = useState(false);
  const recordRef = useRef();
  const [soundObj, setSoundObj] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [editingMsg, setEditingMsg] = useState(null);
  const [editText, setEditText] = useState("");
  const [userPhotoMap, setUserPhotoMap] = useState({});
  const [deletingId, setDeletingId] = useState(null);

  const [selectedImage, setSelectedImage] = useState({
    url: null,
    isOwner: false
  });
  const [imageModalVisible, setImageModalVisible] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const id = await AsyncStorage.getItem("userId");
      setUserId(id);
      try {
        const res = await fetch(
          `${API_URL}/api/conversations/${patientId}/${medecinId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setMessages(data.messages || []);

        // Créer une map des photos des utilisateurs
        const photoMap = {};
        if (data.patientId?.photo) {
          photoMap[data.patientId._id] = data.patientId.photo;
        }
        if (data.medecinId?.Photo) {
          photoMap[data.medecinId._id] = data.medecinId.Photo;
        }
        setUserPhotoMap(photoMap);

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 300);
      } catch (e) {
        console.error(e);
      }
    };

    fetchMessages();
    setLoading(false);
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [patientId, medecinId]);

  const uploadMedia = async (uri, field, mimeType, originalName) => {
    const token = await AsyncStorage.getItem("authToken");
    const form = new FormData();
    const ext = uri.split(".").pop();
    const filename = `${field}-${Date.now()}.${ext}`;
    form.append(field, { uri, type: mimeType, name: filename });
    const res = await fetch(
      `${API_URL}/api/conversations/${patientId}/${medecinId}/message/${field}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: form,
      }
    );
    const { newMessage: msg } = await res.json();
    setMessages((m) => [...m, msg]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const pickImage = async () => {
    const { assets } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (assets?.[0])
      uploadMedia(assets[0].uri, "image", assets[0].type + "/jpeg");
  };

  const pickDocument = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    });
    if (res.assets?.[0]) {
      const asset = res.assets[0];
      uploadMedia(asset.uri, "document", asset.mimeType, asset.name);
    }
  };

  const openPdf = async (pdfUrl) => {
    try {
      const supported = await Linking.canOpenURL(pdfUrl);
      if (supported) {
        await Linking.openURL(pdfUrl);
      } else {
        Alert.alert("Erreur", "Impossible d'ouvrir ce fichier");
      }
    } catch (error) {
      console.error("Erreur d'ouverture:", error);
      Alert.alert("Erreur", "Impossible d'ouvrir ce fichier");
    }
  };

  const handleDocumentPress = async (document) => {
    try {
      const localUri = FileSystem.documentDirectory + document.originalName;
      const downloadRes = await FileSystem.downloadAsync(
        document.url,
        localUri
      );
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadRes.uri);
      } else {
        Alert.alert("Info", "Document téléchargé dans les fichiers locaux");
      }
    } catch (error) {
      console.error("Document open failed:", error);
      Alert.alert("Error", "Failed to open the document.");
    }
  };

  const startRecording = async () => {
    await Audio.requestPermissionsAsync();
    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync({
      android: {
        extension: ".m4a",
        outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
        audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
      },
      ios: {
        extension: ".m4a",
        outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
      },
    });
    await rec.startAsync();
    recordRef.current = rec;
    setRecording(true);
  };

  const stopRecording = async () => {
    const rec = recordRef.current;
    await rec.stopAndUnloadAsync();
    const uri = rec.getURI();
    setRecording(false);
    uploadMedia(uri, "audio", "audio/m4a");
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const token = await AsyncStorage.getItem("authToken");
    const res = await fetch(
      `${API_URL}/api/conversations/${patientId}/${medecinId}/message/text`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newMessage }),
      }
    );
    const { newMessage: msg } = await res.json();
    setMessages((m) => [...m, msg]);
    setNewMessage("");
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const onLongPress = (msg) => {
    if (msg.sender !== userId || msg.type !== "text") return;
    setEditingMsg(msg);
    setEditText(msg.text || msg.message);
  };

  const applyEdit = async () => {
    console.log(
      "Editing message, patientid, medecinid:",
      editingMsg,
      patientId,
      medecinId
    );
    const token = await AsyncStorage.getItem("authToken");
    await fetch(
      `${API_URL}/api/conversations/${patientId}/${medecinId}/message/${editingMsg._id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: editText }),
      }
    );
    setMessages((ms) =>
      ms.map((m) => (m._id === editingMsg._id ? { ...m, text: editText } : m))
    );
    setEditingMsg(null);
  };

  const deleteMsg = async (msg) => {
    const token = await AsyncStorage.getItem("authToken");
    await fetch(
      `${API_URL}/api/conversations/${patientId}/${medecinId}/message/${msg._id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setMessages((ms) => ms.filter((m) => m._id !== msg._id));
    setEditingMsg(null);
  };

  const toggleSound = async (url, id) => {
    try {
      if (playingId === id && soundObj) {
        await soundObj.pauseAsync();
        setPlayingId(null);
        return;
      }
      if (soundObj) await soundObj.unloadAsync();
      const { sound } = await Audio.Sound.createAsync({ uri: url });
      setSoundObj(sound);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingId(null);
          sound.unloadAsync();
        }
      });
      await sound.playAsync();
      setPlayingId(id);
    } catch (err) {
      console.error("Audio playback error:", err);
      Alert.alert("Erreur audio", "Impossible de lire ce fichier.");
    }
  };

  const handleDeleteAudio = (audioMsg) => {
    Alert.alert(
      "Supprimer l'audio",
      "Voulez-vous vraiment supprimer ce message audio ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        { 
          text: "Supprimer", 
          onPress: () => deleteMsg(audioMsg),
          style: "destructive"
        }
      ]
    );
  };

  const handleDeleteDocument = (docMsg) => {
    Alert.alert(
      "Supprimer le document",
      "Voulez-vous vraiment supprimer ce fichier ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        { 
          text: "Supprimer", 
          onPress: () => deleteMsg(docMsg),
          style: "destructive"
        }
      ]
    );
  };

  const renderItem = ({ item }) => {
    const isMe = item.sender === userId;
    const type = item.type || "text";
    const avatarUri = userPhotoMap[item.sender];

    // Avatar on right if isMe, left otherwise
    return (
      <View style={[styles.row, isMe ? styles.right : styles.left]}>
        {!isMe && (
          <View style={styles.avatarWrapper}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback} />
            )}
          </View>
        )}
        <View>
          <TouchableOpacity
            onLongPress={() => isMe && type === "text" && onLongPress(item)}
            style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}
          >
            {type === "text" && (
              <Text style={styles.text}>{item.text || item.message}</Text>
            )}
            {type === "image" && (
              <TouchableOpacity 
                onPress={() => {
                  setSelectedImage({
                    url: item.url,
                    isOwner: isMe
                  });
                  setImageModalVisible(true);
                }}
              >
                <Image source={{ uri: item.url }} style={styles.image} />
              </TouchableOpacity>
            )}
            {type === "document" && (
              <View style={styles.documentContainer}>
                <TouchableOpacity 
                  onPress={() => openPdf(item.url)}
                  style={styles.documentBtn}
                >
                  <View style={styles.file}>
                    <MaterialCommunityIcons 
                      name="file-document-outline" 
                      size={24} 
                      color="#007AFF" 
                    />
                    <Text style={styles.filename}>{item.originalName}</Text>
                  </View>
                </TouchableOpacity>

                {isMe && (
                  <TouchableOpacity 
                    onPress={() => handleDeleteDocument(item)}
                    style={styles.deleteDocButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {type === "audio" && (
              <View style={styles.audioContainer}>
                <TouchableOpacity
                  onPress={() => toggleSound(item.url, item._id)}
                  style={styles.audioBtn}
                >
                  <Ionicons
                    name={playingId === item._id ? "pause-circle" : "play-circle"}
                    size={32}
                    color="#007AFF"
                  />
                  <Text style={styles.audioTime}>
                    {playingId === item._id ? "En cours..." : "Écouter"}
                  </Text>
                </TouchableOpacity>
                
                {isMe && (
                  <TouchableOpacity 
                    onPress={() => handleDeleteAudio(item)}
                    style={styles.deleteAudioButton}
                  >
                    <Ionicons name="trash-outline" size={20} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            )}

          </TouchableOpacity>
          {isMe && item.seen && item.seenAt && (
            <Text style={styles.seenText}>{timeAgo(item.seenAt)}</Text>
          )}
        </View>
        {isMe && (
          <View style={styles.avatarWrapper}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback} />
            )}
          </View>
        )}
      </View>
    );
  };

  if (loading)
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#75E1E5" />
    );

  return (
    <View style={styles.container}>
      <Header name={otherName} screen="Messagerie" />
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(m) => m._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />
      <Modal transparent visible={!!editingMsg}>
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <TextInput
              value={editText}
              onChangeText={setEditText}
              style={styles.editInput}
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity onPress={() => setEditingMsg(null)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={applyEdit}>
                <Text>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteMsg(editingMsg)}>
                <Text style={{ color: "red" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal pour l'image en plein écran */}
      <Modal transparent visible={imageModalVisible} animationType="fade">
        <View style={styles.imageModalContainer}>
          <TouchableOpacity 
            style={styles.imageModalCloseButton}
            onPress={() => setImageModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          
          <Image 
            source={{ uri: selectedImage.url }} 
            style={styles.fullImage} 
            resizeMode="contain"
          />
          
          {selectedImage.url && selectedImage.isOwner && (
            <View style={styles.imageOptions}>
              <TouchableOpacity 
                style={[styles.imageOptionButton, {backgroundColor: 'red'}]}
                onPress={() => {
                  // Trouve le message correspondant à l'image
                  const messageToDelete = messages.find(msg => msg.url === selectedImage.url);
                  if (messageToDelete) {
                    deleteMsg(messageToDelete); // Utilise votre fonction existante
                    setImageModalVisible(false);
                  }
                }}
              >
                <Text style={styles.imageOptionText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.imageOptionButton}
                onPress={() => setImageModalVisible(false)}
              >
                <Text style={styles.imageOptionText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>

      <View style={styles.toolbar}>
        <TouchableOpacity onPress={pickImage}>
          <Ionicons name="image-outline" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={pickDocument}>
          <Ionicons name="file-tray-full-outline" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
          <Ionicons
            name={recording ? "stop-circle" : "mic-outline"}
            size={24}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.inputBar}>
        <TextInput
          placeholder="Écrire un message…"
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
          onSubmitEditing={sendMessage}
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 6, paddingTop: 45 },
  row: { 
    flexDirection: "row", 
    marginVertical: 6, 
    alignItems: "flex-end",
    flexShrink: 1, // Permet au contenu de réduire si nécessaire
  },
  left: { 
    justifyContent: "flex-start",
    flex: 1, // Prend toute la largeur disponible
  },
  right: { 
    justifyContent: "flex-end",
    flex: 1, // Prend toute la largeur disponible
  },
  avatarWrapper: { 
    marginHorizontal: 6, // Utilisez marginHorizontal pour gérer à la fois left et right
  },
  avatar: { 
    width: 36, 
    height: 36, 
    borderRadius: 18 
  },
  avatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#007AFF",
  },
  bubble: { 
    padding: 8, 
    borderRadius: 12,
    flexShrink: 1, // Permet au bubble de réduire si nécessaire
  },
  otherBubble: { 
    backgroundColor: "#F2F3F5",
    alignSelf: 'flex-start', // Aligne à gauche
    marginRight: '20%', // Laisse de l'espace à droite
  },
  myBubble: { 
    backgroundColor: "#DCF8C6",
    alignSelf: 'flex-end', // Aligne à droite
    marginLeft: '20%', // Laisse de l'espace à gauche
  },
  text: { 
    color: "#000",
    flexShrink: 1, // Permet au texte de se réduire si nécessaire
  },
  image: { 
    width: 200, 
    height: 200, 
    borderRadius: 8 
  },
  file: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  filename: { 
    marginLeft: 6 
  },
  audioBtn: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  audioTime: { 
    marginLeft: 8 
  },
  seenText: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
    marginTop: 2,
  },
  toolbar: { flexDirection: "row", justifyContent: "space-around", padding: 8 },
  inputBar: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
  },
  modalBtns: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
  },
  imageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
  imageModalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  imageOptions: {
    flexDirection: 'row',
    marginTop: 20,
  },
  imageOptionButton: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
  },
  imageOptionText: {
    color: 'white',
    fontSize: 16,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  audioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8
  },
  audioTime: {
    marginLeft: 8,
    color: '#007AFF'
  },
  deleteAudioButton: {
    padding: 8,
    marginLeft: 10
  },
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  documentBtn: {
    flex: 1
  },
  deleteDocButton: {
    padding: 8,
    marginLeft: 10
  },
});
