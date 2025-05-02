import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatusCard = ({ label, backgroundColor = '#f0f0f0', textColor = '#000' ,wid}) => {
  return (
    <View style={[styles.statusCard, { backgroundColor }]}>
      <Text style={[styles.label, { color: textColor },{width:wid}]}>{label} </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusCard: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default StatusCard;
