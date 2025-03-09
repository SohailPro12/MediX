import React, { useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import DeleteAlert from "./DeleteAlert";
import { useTranslation } from 'react-i18next'

const DoctorCard = ({ name, specialty, image, onDelete = () => {console.log(
  "delete doctor"
)
} }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('DoctorProfile', { doctor: { name, specialty, image } })}>
        <View style={styles.card}>
          <Image source={image} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.specialty}>{t(specialty)}</Text>
          </View>

          {/* Icône de suppression qui ouvre le modal */}
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Icon name="delete" size={20} color="#6a6e6b" style={styles.deleteIcon} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Modal de confirmation */}
      <DeleteAlert
        isVisible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={() => {
          setModalVisible(false);
          onDelete();
        }}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
    marginVertical: 9,
    marginHorizontal: 9,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 9,
    elevation: 2,
    justifyContent: 'space-between', // Ajouter cet alignement pour positionner l'icône à droite
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  specialty: {
    fontSize: 14,
    color: "#666",
  },
  deleteIcon: {
    marginLeft: 10,  // Ajout d'un peu d'espace autour de l'icône
  },
});

export default DoctorCard;