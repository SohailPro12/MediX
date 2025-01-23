import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View>
    <View style={styles.container}>
      <Text>hello world!</Text>
        
      <StatusBar style="auto" />
    </View>
     </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
