import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Supprimercompte from './Supprimercompte';


const DropdownMenu = ({ visible, onClose }) => {
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
   
    const switchLanguage = (lang) => {
      i18n.changeLanguage(lang);
      onClose();
    };
  
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownMenu}>
              {/* Bouton Général */}
              <TouchableOpacity onPress={() => 
                navigation.navigate("AdminGeneralScreen")} style={styles.menuItem}>
                <Text style={styles.menuText}>⚙️ {t('General')}</Text>
              </TouchableOpacity>
  
              {/* Séparateur */}
              <View style={styles.divider} />
  
              {/* Options de langue */}
              <TouchableOpacity onPress={() => switchLanguage('en')} style={styles.menuItem}>
                <Text style={styles.menuText}>🇬🇧 English</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => switchLanguage('fr')} style={styles.menuItem}>
                <Text style={styles.menuText}>🇫🇷 Français</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => switchLanguage('ar')} style={styles.menuItem}>
                <Text style={styles.menuText}>🇸🇦 العربية</Text>
              </TouchableOpacity>
  
              {/* Séparateur */}
              <View style={styles.divider} />
  
              {/* Supprimer le compte */}
              <Supprimercompte />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };
  
  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dropdownMenu: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      width: '80%',
      alignItems: 'center',
    },
    menuItem: {
      paddingVertical: 15,
    },
    menuText: {
      fontSize: 16,
    },
    divider: {
      height: 1,
      backgroundColor: '#e0e0e0',
      marginVertical: 10,
      width: '100%',
    },
  });
  
  export default DropdownMenu;
  