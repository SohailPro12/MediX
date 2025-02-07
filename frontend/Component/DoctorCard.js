import React from "react";
import { View, Text, Image } from "react-native";
import styles from './style.js';
const DoctorCard = ({ name, specialty, image }) => {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.specialty}>{specialty}</Text>
      </View>
    </View>
  );
};



export default DoctorCard;
