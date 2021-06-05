import 'react-native-gesture-handler';
import React, { useState } from 'react'

import * as Fonts from "expo-font";
import AppLoading from "expo-app-loading";

import AppContainer from './src/navigation/RootNavigation';

import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';

declare const global: { HermesInternal: null | {} };

//TODO:  add loading up orders here 

const App = () => {
  const [fontLoaded, setFontLoaded] = useState<boolean>();
  const fetchFonts = () => {
    return Fonts.loadAsync({
      "segoe-bold": require("./constants/Fonts/Segoe_UI_Bold.ttf"),
      "segoe-normal": require("./constants/Fonts/Segoe_UI.ttf"),
      "gotham-black": require("./constants/Fonts/Gotham/Gotham-Black.otf"),
      "gotham-light": require("./constants/Fonts/Gotham/Gotham-Light.otf"),
      "gotham-normal": require("./constants/Fonts/Gotham/GothamBook.ttf"),
      "gotham-bold": require("./constants/Fonts/Gotham/GothamBold.ttf"),
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
    <ApplicationProvider {...eva} theme={eva.dark}>
      <AppContainer />
    </ApplicationProvider>
  )
};

export default App;
