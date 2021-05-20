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
                headerTintColor: "#000",
                headerStyle: {
                    backgroundColor: "#050505",
                    // height: 70
                },

                // headerTitle: "Orders",
                // headerRight: () => (
                //     <TouchableOpacity style={{ marginEnd: 20 }} onPress={() => navigation.navigate('SettingsScreen')}
                //     >
                //         <Avatar
                //             source={{ uri: "https://avatars.githubusercontent.com/u/24722640?v=4" }}
                //             animate
                //             imageStyle={{ borderColor: "#fff", borderWidth: 1 }} />
                //     </TouchableOpacity>
                // )
            })}
        >
            <RootStackNavigator.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: true, headerTitle: "Orders" }} />
            <RootStackNavigator.Screen name="Settings" component={SettingsNavigator} options={{ headerShown: false, headerTitle: "Settings" }} />

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



