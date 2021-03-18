import React from 'react'

import { createStackNavigator } from "@react-navigation/stack";
import AuthUrlScreen from "../screens/AuthUrlScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";


const AuthStackNavigator = createStackNavigator();
export const AuthNavigator = () => {
    return (
        <AuthStackNavigator.Navigator>
            <AuthStackNavigator.Screen
                name="LoginScreen"
                component={LoginScreen}
            />
            <AuthStackNavigator.Screen
                name="AuthUrlScreen"
                component={AuthUrlScreen}
            />
            <AuthStackNavigator.Screen name="HomeScreen" component={HomeScreen} />
        </AuthStackNavigator.Navigator>
    );
};