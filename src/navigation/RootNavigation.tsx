import React, { useEffect, useState } from 'react'

import { NavigationContainer } from "@react-navigation/native";
import { AuthNavigator, RootNavigator, SitesNavigator } from './AppNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from "../screens/HomeScreen";

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
        <NavigationContainer>
            {isSignedIn ? <SitesNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

export default AppContainer;