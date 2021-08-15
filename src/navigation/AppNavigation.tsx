import React from 'react'

import AuthUrlScreen from "../screens/AuthUrlScreen";
import HomeScreen from "../screens/RootScreens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import SettingsScreen from '../screens/RootScreens/SettingsScreen';
import OrderDetailsScreen from '../screens/RootScreens/OrderDetailsScreen';
import AddOrderScreen from '../screens/RootScreens/AddOrderScreen';
import PrivacyPolicyScreen from '../screens/RootScreens/PrivacyPolicyScreen';
import ETAOverviewScreen from '../screens/RootScreens/ETAOverviewScreen';
import OpenSourceLicensesScreen from '../screens/RootScreens/OpenSourceLicensesScreen';
import AmazonOrderDetailsScreen from '../screens/RootScreens/AmazonOrderDetailsScreen';


enableScreens()
const AuthStackNavigator = createNativeStackNavigator();
export const AuthNavigator = () => {
    return (
        <AuthStackNavigator.Navigator screenOptions={{ headerShown: false, headerTintColor: "#ccc" }}>
            <AuthStackNavigator.Screen
                name="LoginScreen"
                component={LoginScreen}
            />
        </AuthStackNavigator.Navigator>
    );
};


const RootStackNavigator = createNativeStackNavigator();
export const RootNavigator = () => {
    return (
        <RootStackNavigator.Navigator
            screenOptions={() => ({
                headerTitleStyle: {
                    color: "#FFF",
                    fontSize: 20,
                    fontFamily: 'gotham-black',
                },
                headerStyle: {
                    backgroundColor: "#121212",

                },
                stackPresentation: 'modal',
            })}
        >
            <RootStackNavigator.Screen
                name="HomeScreen"
                component={HomeScreen}
                initialParams={{ gmailAccess: false, from: '' }}
                options={{
                    headerShown: true,
                    headerTitle: "AIO",
                    headerTitleStyle: {
                        color: "#ffffff",
                        fontSize: 35,
                        fontFamily: 'gotham-black'
                    },
                }} />
            <RootStackNavigator.Screen
                name="OrderDetailsScreen"
                component={OrderDetailsScreen}
                options={{
                    headerShown: false,
                    headerTitleStyle: {
                        color: "#FFF",
                        fontWeight: 'bold',
                        fontSize: 20,
                    },
                }} />
            <RootStackNavigator.Screen
                name="AmazonOrderDetailsScreen"
                component={AmazonOrderDetailsScreen}
                options={{
                    headerShown: false,
                    headerTitleStyle: {
                        color: "#FFF",
                        fontWeight: 'bold',
                        fontSize: 20,
                    },
                }} />
            <RootStackNavigator.Screen name="Settings" component={SettingsNavigator} options={{ headerShown: false }} />
            <RootStackNavigator.Screen name="AddOrder" component={AddOrderNavigator} options={{ headerShown: false }} />
            <RootStackNavigator.Screen name="ETAOverview" component={ETAOverviewScreen} options={{ headerShown: false }} />

            <RootStackNavigator.Screen
                name="AuthUrlScreen"
                component={AuthUrlScreen}
                options={{ stackPresentation: 'modal', headerShown: false }}
            />
        </RootStackNavigator.Navigator>
    );
};

const SettingsStackNavigator = createNativeStackNavigator();
export const SettingsNavigator = () => {
    return (
        <SettingsStackNavigator.Navigator
            screenOptions={() => ({
                headerTitleStyle: {
                    color: "#ffffff",
                },
                headerTintColor: "#fff",
                headerStyle: {
                    backgroundColor: "#121212",

                },
                stackPresentation: 'modal',
            })}
        >
            <SettingsStackNavigator.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerTitle: 'Settings' }} />
            <SettingsStackNavigator.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} options={{ headerTitle: 'Privacy Policy' }} />
            <SettingsStackNavigator.Screen name="OpenSourceLicensesScreen" component={OpenSourceLicensesScreen} options={{ headerTitle: 'Open Source Licenses' }} />
        </SettingsStackNavigator.Navigator>
    );
};

const AddOrderStackNavigator = createNativeStackNavigator();
export const AddOrderNavigator = () => {
    return (
        <AddOrderStackNavigator.Navigator
            screenOptions={() => ({
                headerTitleStyle: {
                    color: "#fff",

                },
                headerTintColor: "#fff",
                headerStyle: {
                    backgroundColor: "#121212",

                }, stackPresentation: 'modal',
            })}
        >
            <AddOrderStackNavigator.Screen name="AddOrderScreen" component={AddOrderScreen} options={{ headerTitle: "Add Order Manually" }} />
        </AddOrderStackNavigator.Navigator>
    );
};


