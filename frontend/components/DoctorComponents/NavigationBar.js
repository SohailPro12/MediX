import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const NavigationBar = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <NavItem
        icon="bell"
        label={t("doctor.navigation.messages")}
        press="Messagerie"
      />
      <NavItem
        icon="calendar-alt"
        label={t("doctor.navigation.reminders")}
        press="AppointmentCalendar"
      />
      <NavItem
        icon="user"
        label={t("doctor.navigation.profile")}
        press="SettingsDScreen"
      />
    </View>
  );
};
{
  /*composant des items*/
}
const NavItem = ({ icon, label, press }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.navItem}
      onPress={() => navigation.navigate(press)}
    >
      <FontAwesome5 name={icon} size={22} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    paddingVertical: 0,
    paddingHorizontal: 0,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 100,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
    textAlign: "center",
  },
});

export default NavigationBar;
