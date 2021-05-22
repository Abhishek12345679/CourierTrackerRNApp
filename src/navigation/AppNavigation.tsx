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


enableScreens()
const AuthStackNavigator = createNativeStackNavigator();
export const AuthNavigator = () => {
    return (
        <AuthStackNavigator.Navigator screenOptions={{ headerShown: false }}>
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
                    fontWeight: 'bold',
                    fontSize: 45,
                    fontFamily: 'segoe-bold'
                },
                headerTintColor: "#fff",
                headerStyle: {
                    backgroundColor: "#050505",
                },
            })}
        >
            <RootStackNavigator.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: true, headerTitle: "Orders" }} />
            <RootStackNavigator.Screen
                name="OrderDetailsScreen"
                component={OrderDetailsScreen}
                options={{
                    headerShown: true,
                    headerTitleStyle: {
                        color: "#FFF",
                        fontWeight: 'bold',
                        fontSize: 20,
                        fontFamily: 'segoe-bold'
                    },
                }} />
            <RootStackNavigator.Screen name="Settings" component={SettingsNavigator} options={{ headerShown: false, headerTitle: "Settings" }} />
            <RootStackNavigator.Screen name="AddOrder" component={AddOrderNavigator} options={{ headerShown: false, headerTitle: "Add Order" }} />

            <RootStackNavigator.Screen
                name="AuthUrlScreen"
                component={AuthUrlScreen}
                options={{ stackPresentation: 'modal' }}
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
                    fontWeight: 'bold',
                    fontSize: 30,
                    fontFamily: 'segoe-bold',
                },
                headerTintColor: "#fff",
                headerStyle: {
                    backgroundColor: "#050505",
                    // height: 70,
                },
                headerBackTitleVisible: true,
            })}
        >
            <SettingsStackNavigator.Screen name="SettingsScreen" component={SettingsScreen} />
        </SettingsStackNavigator.Navigator>
    );
};

const AddOrderStackNavigator = createNativeStackNavigator();
export const AddOrderNavigator = () => {
    return (
        <AddOrderStackNavigator.Navigator
            screenOptions={({ route, navigation }) => ({
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 30,
                    fontFamily: 'segoe-bold',
                },
                headerTintColor: "#fff",
                headerStyle: {
                    backgroundColor: "#050505",
                    // height: 70,
                },
                headerBackTitleVisible: true,
                stackPresentation: 'fullScreenModal'
            })}
        >
            <AddOrderStackNavigator.Screen name="AddOrderScreen" component={AddOrderScreen} options={{ headerTitle: "Add Order Manually" }} />
        </AddOrderStackNavigator.Navigator>
    );
};


