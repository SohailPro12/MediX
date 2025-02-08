import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { useTranslation } from 'react-i18next'; 
import '../i18n';

const AdminCalendar = () => {
  const { t, i18n } = useTranslation(); 
  const [items, setItems] = useState({
    '2025-01-21': [
      { name: 'Dr. Ahmed: John D', time: '09:00 - 10:00' },
      { name: 'Dr. Smith: John Doe', time: '09:00 - 10:00' },
      { name: 'Dr. Jane: Mary Johnson', time: '11:00 - 12:00' },
    ],
    '2025-01-22': [
      { name: 'Dr. Taylor: Bob Green', time: '09:30 - 10:30' },
      { name: 'Dr. Wilson: Clara Black', time: '13:00 - 14:00' },
    ],
  });

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text style={styles.emptyDateText}>{t('Aucun rendez-vous')}</Text> 
      </View>
    );
  };

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.itemTime}>{item.time}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('Calendrier des rendez-vous')}</Text>
      <Agenda
        items={items}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        theme={{
          agendaDayTextColor: '#5D5FEF',
          agendaDayNumColor: '#2E86C1',
          agendaTodayColor: '#27AE60',
          agendaKnobColor: '#A569BD',
          dotColor: '#3498DB',
          selectedDotColor: '#F1C40F',
          todayTextColor: '#C0392B',
          backgroundColor: '#ECF0F1',
          calendarBackground: '#FFF',
          selectedDayBackgroundColor: '#1ABC9C',
          selectedDayTextColor: '#FFF',
          dayTextColor: '#34495E',
          textDisabledColor: '#BDC3C7',
          monthTextColor: '#8E44AD',
          textMonthFontWeight: 'bold',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#2C3E50',
  },
  item: {
    backgroundColor: '#E8DAEF',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  itemTime: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  emptyDate: {
    backgroundColor: '#D5DBDB',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDateText: {
    color: '#7F8C8D',
    fontSize: 16,
  },
});

export default AdminCalendar;
