import 'react-native-gesture-handler';
import React, { useState } from 'react'

import { StatusBar } from 'react-native'

import * as Fonts from "expo-font";
import AppLoading from "expo-app-loading";

import AppContainer from './src/navigation/RootNavigation';

import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Provider } from 'mobx-react';
import store from './src/store/store';

import RNBootSplash from "react-native-bootsplash";
import { useEffect } from 'react';

declare const global: { HermesInternal: null | {} };

const App = () => {
  const [fontLoaded, setFontLoaded] = useState<boolean>();

  const fetchFonts = async () => {
    // return Fonts.loadAsync({
    //   "segoe-bold": require("./constants/Fonts/Segoe_UI_Bold.ttf"),
    //   "segoe-normal": require("./constants/Fonts/Segoe_UI.ttf"),
    //   "gotham-black": require("./constants/Fonts/Gotham/Gotham-Black.otf"),
    //   "gotham-light": require("./constants/Fonts/Gotham/Gotham-Light.otf"),
    //   "gotham-normal": require("./constants/Fonts/Gotham/GothamBook.ttf"),
    //   "gotham-bold": require("./constants/Fonts/Gotham/GothamBold.ttf"),
    // });
  };

  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
      await fetchFonts()
      await RNBootSplash.show()
    };
    init()
  }, []);

  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" />
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <AppContainer />
      </ApplicationProvider>
    </Provider>
  )
};

export default App;
