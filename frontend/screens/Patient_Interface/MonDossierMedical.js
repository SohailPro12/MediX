import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image,Modal } from 'react-native';
import { Ionicons, FontAwesome5, Entypo } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import openPdf from '../Doctor_Interface/openPdf';
import Fontisto from '@expo/vector-icons/Fontisto';
import { MaterialCommunityIcons } from '@expo/vector-icons';
//import { useNavigation } from '@react-navigation/native';


const Maladies = [
  {
    id: '1',
    name: 'Grippe',
    doctor: 'Dr. Olivia Turner, M.D',
    date: '2025-04-12',
    medicaments: [
        {
          id: "1",
          name: "méd1",
          endDate: "2025-03-27",
          periods: ["Matin", "Soir"],
        },
        {
          id: "2",
          name: "méd2",
          endDate: "2025-04-27",
          periods: ["Matin"],
        },
      ],
      analyses: [
        {
          id: "1",
          name: "anal1",
          resultats: "https://www.africau.edu/images/default/sample.pdf",
        },
      ],
      traitement: "Play Sports...",
  },
  {
    id: '2',
    name: 'Tuberculose',
    doctor: 'Dr. Alexander Bennett, Ph.D.',
    date: '2025-06-20',
    medicaments: [
        {
          id: "3",
          name: "méd3",
          endDate: "2025-05-27",
          periods: ["Matin", "Soir"],
        },
        {
          id: "4",
          name: "méd3",
          endDate: "2025-01-27",
          periods: ["Matin"],
        },
      ],
      analyses: [
/*         {
          id: "2",
          name: "anal2",
          resultats: "https://www.africau.edu/images/default/sample.pdf",
        }, */
      ],
      traitement: "Eat healthy food...",

  },
  {
    id: '3',
    name: 'VIH/SIDA',
    doctor: 'Dr. Sophia Martinez, Ph.D.',
    date: '2025-01-15',
    medicaments: [
/*         {
          id: "5",
          name: "méd5",
          endDate: "2025-03-27",
          periods: ["Matin", "Soir"],
        },
        {
          id: "6",
          name: "méd6",
          endDate: "2025-04-27",
          periods: ["Matin"],
        }, */
      ],
      analyses: [
        {
          id: "3",
          name: "anal3",
          resultats: "https://www.africau.edu/images/default/sample.pdf",
        },
      ],
      traitement: "",
  },
];

export default function MonDossierMedical({navigation}) {
  //const navigation=useNavigation();
  const [selectedMaladie,setSelectedMaladie]=useState(null);
  const renderMaladies=({item})=>{
    
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={require('../../assets/maladie.png')} style={styles.avatar} />
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={styles.maladieName}>{item.name}</Text>
                <Text style={styles.doctorName}>{item.doctor}</Text>
                <View style={styles.row}>
                    <FontAwesome5 name="calendar-alt" size={16} color="#5771f9" />
                    <Text style={styles.infoTexte}>{new Date(item.date).toDateString()}</Text>
                 </View>
            </View>
          </View> 
          <TouchableOpacity style={styles.infobutton}>
            <Text style={styles.infoText} onPress={()=>{setTimeout(()=>{setSelectedMaladie(item);},100);}}>Details</Text>
          </TouchableOpacity>
        </View>

        
      </View>
    );
  }
  return(
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={()=> navigation.navigate("DashboardPatient")}>
          <Ionicons name="chevron-back" size={28} color="#5771f9" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Medical File</Text>
        <View style={{ width: 30 }} />
     </View>
    <FlatList
      data={Maladies}
      keyExtractor={(item) => item.id}
      renderItem={renderMaladies}
      contentContainerStyle={{ paddingBottom: 100 }}
    />

    {selectedMaladie !== null && (
        <Modal visible={true} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedMaladie && (
              <>
                <Text style={styles.modalTitle}>Medicines</Text>
                {selectedMaladie.medicaments.length>0?(
                selectedMaladie.medicaments.map((med) => (
                    <View key={med.id} style={{flexDirection:'row',alignItems:'center'}}>
                        <Fontisto name="pills" size={44} color="#5771f9" />
                        <View style={{ marginBottom: '4%', }}>
                            
                            <Text style={styles.modalText}> 
                            <   Text style={styles.modalftext}>Name : </Text>
                                {med.name}</Text>
                            <Text style={styles.modalText}> 
                            <   Text style={styles.modalftext}>End Date : </Text>
                                {med.endDate}</Text>
                            <Text style={styles.modalText}> 
                            <   Text style={styles.modalftext}>Periods : </Text>
                                {med.periods.join(", ")}</Text>                
                        </View>
                    </View>

                ))):(
                    <Text>No medicines</Text>
                )}

                <Text style={styles.modalTitle}>Analyses</Text>
                {selectedMaladie.analyses.length>0 ?
                (selectedMaladie.analyses.map((ana) => (
                    <View key={ana.id} style={{flexDirection:'row',alignItems:'center'}}>
                        <MaterialCommunityIcons name="test-tube" size={44} color="#5771f9"  />
                        <View  style={{ marginBottom: '4%' }}>
                            <Text style={styles.modalText}>
                            <Text style={styles.modalftext}>Name : </Text> {ana.name}</Text>
                            <View style={{ flexDirection: 'row', justifyContent:'space-between', }}>
                                <Text style={styles.modalText}>
                                    <Text style={styles.modalftext}>Resultats : </Text> Check the result here</Text>
                                <TouchableOpacity onPress={() => openPdf(ana.resultats)}>
                                    <AntDesign name="filetext1" size={20} color="#5771f9" style={{}}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                  </View>
                ))):(
                    <Text>No analyses</Text>
                )}

                <Text style={styles.modalTitle}>Treatment</Text>
                {selectedMaladie.traitement?.trim()?
                (<Text style={styles.modalText}>{selectedMaladie.traitement}</Text>)
                :<Text>No treatment</Text>}

                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedMaladie(null)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#E0E4FF',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    //borderRadius: 20,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  maladieName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
    color: '#333',
  },
  doctorName: {
    color: '#666',
    marginBottom: 8,
  },
  infobutton:{
    backgroundColor: '#5771f9',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    width:100,
    justifyContent:'center',
    alignSelf:'center',
    marginTop:10
  },
  infoText:{
    fontWeight: '600',
    textAlign:'center',
    color:'white',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 16,
    //marginHorizontal: 0,
    //justifyContent:'flex-start',
    //alignSelf:'center',
    width:160
  },
  infoTexte: {
    marginLeft: 6,
    color: '#666',
    fontSize: 14,
  },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#E0E4FF', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  modalDate: { fontSize: 16, color: "#666", marginBottom: 10 },
  modalText: { fontSize: 14, color: "#444", marginLeft: '4%' },
  closeButton: { marginTop: 20, padding: 10, backgroundColor: '#5771f9', borderRadius: 5, alignItems: 'center' },
  closeButtonText: { color: '#fff', fontWeight: 'bold' },
  modalftext:{fontSize: 14, color: "black", marginLeft: '4%',fontWeight:'bold'},
})