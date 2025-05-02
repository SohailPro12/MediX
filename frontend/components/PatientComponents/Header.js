import React from "react"
import { View,TouchableOpacity,Text,StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native";

const Header = ({param ,rja3}) =>{
  const navigation = useNavigation();
  return(
<View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.navigate(rja3)}>
          <Ionicons name="chevron-back" size={28} color="#5771f9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{param}</Text>
        <View style={{ width: 30 }} />
     </View>
</View>
  )
}


const styles =StyleSheet.create({
    container: {
     
        backgroundColor: '#f8f8f8',
        paddingTop: 40,
        paddingHorizontal: 20,
        },
        header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        },
        headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color:'#333',
    },
})
export default Header;
