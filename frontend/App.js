import React, { useState } from 'react';
import AppNavigator from './navigation/AppNavigator';
import Splash from './screens/LoginFront/SplashScreen';
import { MedecinProvider } from "./screens/context/MedecinContext";

const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  return (
    <MedecinProvider>
      {isSplashVisible ? (
        <Splash onFinish={() => setIsSplashVisible(false)} />
      ) : (
        <AppNavigator />
      )}
    </MedecinProvider>
  );
};

export default App;
