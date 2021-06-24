import React from 'react'

import AuthUrlScreen from "../screens/AuthUrlScreen";
import HomeScreen from "../screens/RootScreens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import { TouchableOpacity } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { Avatar } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import SettingsScreen from '../screens/RootScreens/SettingsScreen';
import OrderDetailsScreen from '../screens/RootScreens/OrderDetailsScreen';
import AddOrderScreen from '../screens/RootScreens/AddOrderScreen';
import PrivacyPolicyScreen from '../screens/RootScreens/PrivacyPolicyScreen';


enableScreens()
const AuthStackNavigator = createNativeStackNavigator();
export const AuthNavigator = () => {
    return (
        <AuthStackNavigator.Navigator screenOptions={{ headerShown: false, headerTintColor: "#ccc" }}>
            <AuthStackNavigator.Screen
                name="LoginScreen"
                component={LoginScreen}
            />
            {/* add sign in screen and login screen separately */}
        </AuthStackNavigator.Navigator>
    );
};


const RootStackNavigator = createNativeStackNavigator();
export const RootNavigator = () => {
    return (
        <RootStackNavigator.Navigator
            screenOptions={({ route, navigation }) => ({
                headerTitleStyle: {
                    color: "#FFF",
                    fontSize: 20,
                    fontFamily: 'gotham-black',
                },
                // headerTintColor: "#fff",
                headerStyle: {
                    backgroundColor: "#121212",

                },
                stackPresentation: 'modal',
            })}
        >
            <RootStackNavigator.Screen name="HomeScreen" component={HomeScreen} options={{
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
                        // fontFamily: 'segoe-bold'
                    },
                }} />
            <RootStackNavigator.Screen name="Settings" component={SettingsNavigator} options={{ headerShown: false, headerTitle: "Settings" }} />
            <RootStackNavigator.Screen name="AddOrder" component={AddOrderNavigator} options={{ headerShown: false, headerTitle: "Add Order" }} />

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
            screenOptions={({ route, navigation }) => ({
                headerTitleStyle: {
                    color: "#ffffff",
                    // fontSize: 45,
                    // fontFamily: 'gotham-',
                },
                headerTintColor: "#fff",
                headerStyle: {
                    backgroundColor: "#121212",

                },
                stackPresentation: 'modal',
                // headerTitle: 'Settings'
            })}
        >
            <SettingsStackNavigator.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerTitle: 'Settings' }} />
            <SettingsStackNavigator.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} options={{ headerTitle: 'Privacy Policy' }} />
        </SettingsStackNavigator.Navigator>
    );
};

const AddOrderStackNavigator = createNativeStackNavigator();
export const AddOrderNavigator = () => {
    return (
        <AddOrderStackNavigator.Navigator
            screenOptions={({ route, navigation }) => ({
                headerTitleStyle: {
                    color: "#c2c2c2",

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


