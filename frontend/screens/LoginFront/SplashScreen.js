import React, { useEffect, useCallback } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Empêcher Expo de cacher immédiatement le Splash Screen
SplashScreen.preventAutoHideAsync();

const Splash = ({ onFinish }) => {
  useEffect(() => {
    const load = async () => {
      await new Promise(resolve => setTimeout(resolve, 4000)); // Attendre 4s et demi
      onFinish(); // Signale que le Splash est terminé
    };

    load();
  }, []);

  // Forcer Expo à garder le Splash visible jusqu'à la fin de l'effet
  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Image source={require('../../assets/splash.jpg')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white',
    justifyContent:'center',
  },
  image: {
    width: '100%',
    height: '58%',
    alignSelf:'center',
    marginLeft:12,
  },
});

export default Splash;
