import React from 'react'

import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AuthUrlScreen from "../screens/AuthUrlScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import AmazonOrdersScreen from '../screens/AmazonOrdersScreen';
import FlipkartOrdersScreen from '../screens/FlipkartOrdersScreen';
import MyntraOrdersScreen from '../screens/MyntraOrdersScreen';


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


const RootStackNavigator = createStackNavigator();
export const RootNavigator = () => {
    return (
        <RootStackNavigator.Navigator>
            <RootStackNavigator.Screen name="HomeScreen" component={HomeScreen} />
        </RootStackNavigator.Navigator>
    );
};

const SitesTopTabNavigator = createMaterialTopTabNavigator()
export const SitesNavigator = () => {
    return (
        <SitesTopTabNavigator.Navigator tabBarOptions={{ scrollEnabled: true }}>
            <SitesTopTabNavigator.Screen name="Home" component={HomeScreen} />
            <SitesTopTabNavigator.Screen name="Amazon" component={AmazonOrdersScreen} />
            <SitesTopTabNavigator.Screen name="Flipkart" component={FlipkartOrdersScreen} />
            <SitesTopTabNavigator.Screen name="Myntra" component={MyntraOrdersScreen} />
        </SitesTopTabNavigator.Navigator>
    )
}
