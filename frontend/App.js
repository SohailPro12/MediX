import React, { useState } from 'react';
import AppNavigator from './navigation/AppNavigator';
import Splash from './screens/LoginFront/SplashScreen';
import { MedecinProvider } from './screens/context/MedecinContext';
import { PatientProvider } from './screens/context/PatientContext';

const App = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  return (
    <MedecinProvider>
      <PatientProvider>
        {isSplashVisible ? (
          <Splash onFinish={() => setIsSplashVisible(false)} />
        ) : (
          <AppNavigator />
        )}
      </PatientProvider>
    </MedecinProvider>
  );
};

export default App;
