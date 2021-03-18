import 'react-native-gesture-handler';
import React from 'react'

import AppContainer from './src/navigation/RootNavigation';

declare const global: { HermesInternal: null | {} };

const App = () => {
  return (
    <AppContainer />
  )
};

export default App;
