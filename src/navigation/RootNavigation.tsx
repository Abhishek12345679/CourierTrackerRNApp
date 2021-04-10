import React from 'react'

import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { AuthNavigator, RootNavigator, SitesNavigator } from './AppNavigation';

import { LightTheme } from '../../constants/Themes/LightTheme';
import { DarkTheme } from '../../constants/Themes/DarkTheme';
import store from '../store/store';
import { observer } from 'mobx-react';
import SplashScreen from '../screens/SplashScreen';


const AppContainer = observer(() => {
    return (
        <NavigationContainer
            theme={LightTheme}
        >
            {/* {store.googleCredentials.refresh_token ? <SitesNavigator /> : <AuthNavigator />} */}
            {!!store.googleCredentials.refresh_token && <SitesNavigator />}
            {!!!store.googleCredentials.refresh_token && !!store.didTryAutoLogin && <AuthNavigator />}

            {!!!store.googleCredentials.refresh_token && !!!store.didTryAutoLogin && <SplashScreen />}

        </NavigationContainer>
    );
})

export default AppContainer;