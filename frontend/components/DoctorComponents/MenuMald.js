import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const MenuMald = ({ patient, setSelectedMaladie }) => {
  const navigation = useNavigation(); // 🔄 pour pouvoir naviguer
  const { t } = useTranslation();
  const isFirstVisit = !patient.lastVisit;
  const maladies = patient.maladies || [];

  const handlePress = (maladie) => {
    const analysesIncompletes = maladie.analyses?.some(
      (a) => !a.resultats || a.resultats === "Aucun fichier"
    );

    if (analysesIncompletes) {
      // Aller vers PrescriptionScreen pour compléter les résultats
      navigation.navigate("PrescriptionScreen", {
        patient,
        maladieIncomplète: maladie, // envoie les données pour les pré-remplir
      });
    } else {
      // Toutes les analyses sont complètes, on peut afficher le modal
      setSelectedMaladie(maladie);
    }
  };

  return (
    <View style={styles.menu}>
      {" "}
      {maladies.length === 0 ? (
        <Text style={styles.noMaladies}>
          {isFirstVisit
            ? t("doctor.menuMald.firstVisit")
            : t("doctor.menuMald.noDiseases")}
        </Text>
      ) : (
        maladies.map((maladie) => {
          const analysesIncompletes = maladie.analyses?.some(
            (a) => !a.resultats || a.resultats === "Aucun fichier"
          );

          return (
            <TouchableOpacity
              key={maladie.id}
              style={styles.menuItem}
              onPress={() => handlePress(maladie)}
            >
              {" "}
              <View style={styles.info}>
                <Text style={styles.name}>
                  {t("doctor.menuMald.diseaseNature")}
                </Text>
                <Text style={styles.maladie}>{maladie.nature}</Text>
              </View>
              <View style={styles.iconContainer}>
                {analysesIncompletes ? (
                  <Ionicons name="alert-circle" size={22} color="#FFA500" /> // Orange pour incomplète
                ) : (
                  <Ionicons name="checkmark-circle" size={22} color="green" /> // Verte pour complète
                )}
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    width: "97%",
    alignSelf: "center",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  maladie: {
    fontSize: 14,
    color: "#666",
    marginLeft: "4%",
  },
  noMaladies: {
    fontSize: 16,
    color: "#ff6347",
    textAlign: "center",
    marginVertical: 20,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

export default MenuMald;
