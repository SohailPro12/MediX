import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';

const DeleteAccountButton = () => {
  const confirmDelete = () => {
    Alert.alert(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
      [
        {
          text: "Annuler",
          onPress: () => console.log("Annuler"),
          style: "cancel"
        },
        { text: "Supprimer", onPress: () => handleDeleteAccount() }
      ]
    );
  };

  const handleDeleteAccount = () => {
    // Logique pour supprimer le compte, par exemple en appelant une API
    console.log("Compte supprimé");
  };

  return (
    <View style={styles.container}>
      <Button
        title="Supprimer le compte"
        onPress={confirmDelete}
        color="#ff0000"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default DeleteAccountButton;
