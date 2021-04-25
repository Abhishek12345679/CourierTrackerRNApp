import React from 'react'

import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { AuthNavigator, RootNavigator, SitesNavigator } from './AppNavigation';

import { LightTheme } from '../../constants/Themes/LightTheme';
import { DarkTheme } from '../../constants/Themes/DarkTheme';
import store from '../store/store';
import { observer } from 'mobx-react';
import SplashScreen from '../screens/SplashScreen';


const AppContainer = observer(() => {

    if (store.googleCredentials.refresh_token.length === 0 && store.didTryAutoLogin) {
        console.log("AuthNavigator...")
    }


    return (
        <NavigationContainer
            theme={LightTheme}
        >
            {store.googleCredentials.refresh_token.length > 0 && <RootNavigator />}
            {store.googleCredentials.refresh_token.length === 0 &&
                (store.didTryAutoLogin ? <AuthNavigator /> : <SplashScreen />)}

            {/* {store.googleCredentials.refresh_token.length === 0 && !!!store.didTryAutoLogin && <SplashScreen />} */}

        </NavigationContainer>
    );
})

export default AppContainer;