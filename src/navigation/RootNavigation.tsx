import React, { useEffect } from 'react'

import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { AuthNavigator, RootNavigator } from './AppNavigation';

import { LightTheme } from '../../constants/Themes/LightTheme';
import { DarkTheme } from '../../constants/Themes/DarkTheme';
import store from '../store/store';
import { observer } from 'mobx-react';
import SplashScreen from '../screens/SplashScreen';


const AppContainer = observer(() => {

    // if (store.loginCredentials && store.didTryAutoLogin) {
    //     console.log("AuthNavigator...")
    // }
    const loginCredsKeysLength = Object.values(store.loginCredentials)
    let isLoggedIn = false

    loginCredsKeysLength.forEach((value, index) => {
        console.log()
        if (value !== "") {
            isLoggedIn = true
        } else {
            isLoggedIn = false
        }
    })



    useEffect(() => { console.log("Logged in:", isLoggedIn) }, [])

    return (
        <NavigationContainer
            theme={LightTheme}
        >
            <SplashScreen />
            {/* {isLoggedIn && <RootNavigator />}
            {!isLoggedIn && store.didTryAutoLogin && <AuthNavigator />}
            {!isLoggedIn && !store.didTryAutoLogin && <SplashScreen />} */}

        </NavigationContainer>
    );
})

export default AppContainer;