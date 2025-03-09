import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import '../i18n';

const DeleteAccountButton = () => {
  const { t, i18n } = useTranslation(); 

  const confirmDelete = () => {
    Alert.alert(
      t("Confirmer la suppression"),  
      t("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."), 
      [
        {
          text: t("Annuler"), 
          onPress: () => console.log("Annuler"),
          style: "cancel"
        },
        { text: t("Supprimer"), onPress: () => handleDeleteAccount() } 
      ]
    );
  };

  const handleDeleteAccount = () => {
    console.log("Compte supprimé");
  };

  return (
    <View style={styles.container}>
      <Button
        title={t("Supprimer le compte")} 
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
