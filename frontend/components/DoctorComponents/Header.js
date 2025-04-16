import React from 'react';
import {View,TouchableOpacity,Text,StyleSheet} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
const Header=({name,screen})=>{
  const navigation=useNavigation()
  const handleClick=()=>{
    navigation.navigate(screen)
  }
  return(
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClick}>
          <Ionicons name="chevron-back" size={24} color="black"  style={{marginTop:2}}/>
        </TouchableOpacity> 
        <Text style={styles.title}>{name}</Text>
      </View>
  )
}

const styles = StyleSheet.create({

    header:{
    flexDirection: 'row',
    },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    flex:1,
  }
});

export default Header;