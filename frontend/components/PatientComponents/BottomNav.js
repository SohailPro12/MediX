import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const BottomNav = ({ onPress }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute(); // 👉 récupérer la route active actuelle

  const navItems = [
    {
      label: t("patient.navigation.home"),
      icon: "home",
      route: "DashboardPatient",
    },
    {
      label: t("patient.navigation.messages"),
      icon: "message-circle",
      route: "Messagerie",
    },
    {
      label: t("patient.navigation.doctors"),
      icon: "user-plus",
      route: "SearchDoctor",
    },
    {
      label: t("patient.navigation.profile"),
      icon: "user",
      route: "PatientProfile",
    },
  ];

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item, index) => {
        const isActive = route.name === item.route; // 👉 vérifier si c'est la route active
        return (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => {
              if (onPress) {
                onPress(index);
              }
              if (!isActive) {
                navigation.navigate(item.route); // naviguer seulement si ce n'est pas déjà actif
              }
            }}
          >
            <Icon
              name={item.icon}
              size={20}
              color={isActive ? "#3B82F6" : "#9CA3AF"} // Colorier selon la route active
            />
            <Text
              style={isActive ? styles.activeNavText : styles.inactiveNavText}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    bottom: 2,
    left: 0,
    right: 0,
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#zFFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: "space-around",
  },
  navItem: {
    alignItems: "center",
  },
  activeNavText: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "600",
    marginTop: 2,
  },
  inactiveNavText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
});

export default BottomNav;
