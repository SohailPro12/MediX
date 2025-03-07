import React, { useState } from 'react';
import AppNavigator from './navigation/AppNavigator';
import Splash from './screens/LoginFront/SplashScreen'; // Import du Splash

const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  return isSplashVisible ? (
    <Splash onFinish={() => setIsSplashVisible(false)} />
  ) : (
    <AppNavigator />
  );
};

export default App;

