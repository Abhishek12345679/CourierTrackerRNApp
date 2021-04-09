import React, { useEffect, useState } from 'react'

import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { AuthNavigator, RootNavigator, SitesNavigator } from './AppNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from "../screens/HomeScreen";
import { Text, View } from 'react-native';
import { LightTheme } from '../../constants/Themes/LightTheme';
import { DarkTheme } from '../../constants/Themes/DarkTheme';


const AppContainer = () => {
    const [isSignedIn, setIsSignedIn] = useState(false)

    const getCredentials = async () => {
        try {
            const creds = await AsyncStorage.getItem('credentials')
            if (creds) {
                setIsSignedIn(true)
            }
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        getCredentials()
    }, [])
    return (
        <NavigationContainer
            theme={DarkTheme}
        >
            {isSignedIn ? <SitesNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

export default AppContainer;