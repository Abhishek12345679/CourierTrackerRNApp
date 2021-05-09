import React from 'react'

import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AuthUrlScreen from "../screens/AuthUrlScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import AmazonOrdersScreen from '../screens/AmazonOrdersScreen';
import FlipkartOrdersScreen from '../screens/FlipkartOrdersScreen';
import MyntraOrdersScreen from '../screens/MyntraOrdersScreen';
import { Animated, Dimensions, Image, Pressable, SafeAreaView, Text, TouchableOpacity, TouchableOpacityBase, View } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { ActionBar, Avatar } from 'react-native-ui-lib';


enableScreens()
const AuthStackNavigator = createNativeStackNavigator();
export const AuthNavigator = () => {
    return (
        <AuthStackNavigator.Navigator screenOptions={{ headerShown: false }}>
            <AuthStackNavigator.Screen
                name="LoginScreen"
                component={LoginScreen}
            />
            {/* <AuthStackNavigator.Screen
                name="AuthUrlScreen"
                component={AuthUrlScreen}
                options={{ stackPresentation: 'modal' }}
            /> */}
        </AuthStackNavigator.Navigator>
    );
};


const RootStackNavigator = createNativeStackNavigator();
export const RootNavigator = () => {

    return (
        <RootStackNavigator.Navigator
            screenOptions={{
                headerTitleStyle: {
                    // fontWeight: 'bold',
                    // borderBottomWidth: 0,
                    // alignSelf: 'center',
                    color: "#FFF",
                    fontWeight: 'bold',
                    fontSize: 30
                },
                headerTintColor: "#000",
                headerStyle: {
                    backgroundColor: "#600c91",
                    // height: 70
                },
                headerTitle: "W",
                headerRight: () => (
                    <TouchableOpacity style={{ marginEnd: 20 }}>
                        <Avatar
                            source={{ uri: "https://avatars.githubusercontent.com/u/24722640?v=4" }}
                            animate
                            imageStyle={{ borderColor: "#fff", borderWidth: 1 }} />
                    </TouchableOpacity>
                )
            }}
        >
            <RootStackNavigator.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
            <RootStackNavigator.Screen
                name="AuthUrlScreen"
                component={AuthUrlScreen}
                options={{ stackPresentation: 'modal' }}
            />
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
