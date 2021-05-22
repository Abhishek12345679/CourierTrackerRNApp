import 'react-native-gesture-handler';
import React, { useState } from 'react'

import * as Fonts from "expo-font";
import AppLoading from "expo-app-loading";

import AppContainer from './src/navigation/RootNavigation';

declare const global: { HermesInternal: null | {} };

const App = () => {
  const [fontLoaded, setFontLoaded] = useState<boolean>();
  const fetchFonts = () => {
    return Fonts.loadAsync({
      "segoe-bold": require("./constants/Fonts/Segoe_UI_Bold.ttf"),
      "segoe-normal": require("./constants/Fonts/Segoe_UI.ttf"),
    });
  };

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={(err: Error) => console.log(err)}
      />
    );
  }

  return (
    <AppContainer />
  )
};

export default App;
