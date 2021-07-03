import React from 'react'

import { NavigationContainer } from "@react-navigation/native";
import { AuthNavigator, RootNavigator } from './AppNavigation';

import { LightTheme } from '../../constants/Themes/LightTheme';
import { DarkTheme } from '../../constants/Themes/DarkTheme';
import store from '../store/store';
import { observer } from 'mobx-react';
import SplashScreen from '../screens/SplashScreen';


const AppContainer = observer(() => {
    const loginCredsKeysLength = Object.values(store.loginCredentials)
    let isLoggedIn = false

    loginCredsKeysLength.forEach((value, index) => {
        if (value !== "") {
            isLoggedIn = true
        } else {
            isLoggedIn = false
        }
    })

    return (
        <NavigationContainer
            theme={DarkTheme}
        >
            {isLoggedIn && <RootNavigator />}
            {!isLoggedIn && store.didTryAutoLogin && <AuthNavigator />}
            {!isLoggedIn && !store.didTryAutoLogin && <SplashScreen />}

        </NavigationContainer>
    );
})

export default AppContainer;