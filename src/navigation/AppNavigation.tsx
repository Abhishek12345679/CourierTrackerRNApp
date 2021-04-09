import React from 'react'

import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AuthUrlScreen from "../screens/AuthUrlScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import AmazonOrdersScreen from '../screens/AmazonOrdersScreen';
import FlipkartOrdersScreen from '../screens/FlipkartOrdersScreen';
import MyntraOrdersScreen from '../screens/MyntraOrdersScreen';
import { Image, Text, View } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';


enableScreens()
const AuthStackNavigator = createNativeStackNavigator();
export const AuthNavigator = () => {
    return (
        <AuthStackNavigator.Navigator screenOptions={{ headerShown: false }}>
            <AuthStackNavigator.Screen
                name="LoginScreen"
                component={LoginScreen}
            />
            <AuthStackNavigator.Screen
                name="AuthUrlScreen"
                component={AuthUrlScreen}
                options={{ stackPresentation: 'modal' }}
            />
            <AuthStackNavigator.Screen name="HomeScreen" component={HomeScreen} />
        </AuthStackNavigator.Navigator>
    );
};


const RootStackNavigator = createStackNavigator();
export const RootNavigator = () => {
    return (
        <RootStackNavigator.Navigator screenOptions={{
            headerTitleStyle: {
                fontWeight: 'bold',
                borderBottomWidth: 0,
                alignSelf: 'center'

            }
        }}>
            <RootStackNavigator.Screen name="HomeScreen" component={HomeScreen} />
        </RootStackNavigator.Navigator>
    );
};

const SitesTopTabNavigator = createMaterialTopTabNavigator()
export const SitesNavigator = () => {
    return (
        <SitesTopTabNavigator.Navigator
            tabBarPosition="bottom"
            lazy={true}
            tabBarOptions={{
                scrollEnabled: true,
                showIcon: true,
                showLabel: false,
                tabStyle: {
                    width: 125
                },
            }}
        // tabBar={() => (<View><Text>Courier Tracker</Text></View>)}
        >

            <SitesTopTabNavigator.Screen
                name="Amazon"
                component={AmazonOrdersScreen}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Image source={require("../Assets/BrandLogos/amazon.png")} style={{ width: 30, height: 30 }} />
                    )

                }} />
            <SitesTopTabNavigator.Screen
                name="Flipkart"
                component={FlipkartOrdersScreen}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Image source={require("../Assets/BrandLogos/flipkart.png")} style={{ width: 30, height: 30 }} />
                    )
                }}
            />
            <SitesTopTabNavigator.Screen
                name="Myntra"
                component={MyntraOrdersScreen}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Image source={require("../Assets/BrandLogos/myntra.png")} style={{ width: 30, height: 30 }} />
                    )
                }}
            />
            <SitesTopTabNavigator.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Text style={{ width: 100 }}>Home</Text>

                    ),
                }}
            />
        </SitesTopTabNavigator.Navigator>
    )
}
