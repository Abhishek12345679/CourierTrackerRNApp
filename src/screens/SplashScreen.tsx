import AsyncStorage from '@react-native-async-storage/async-storage'
import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { View, Text, Platform, Image, StatusBar } from 'react-native'
import PushNotification from 'react-native-push-notification'
import { initiateAllReminders, initiateSelectedReminders } from '../helpers/notificationHelpers'
import store from '../store/store'


enum ReminderFrequency {
    all = "all",
    none = "none",
    selected = "selected"
}

const SplashScreen = observer(() => {

    // fetch credentials from the Local Storage of the device
    const getCredentials = async () => {
        console.log('splash screen')
        store.setTryAutoLogin()

        const credentials = await AsyncStorage.getItem('loginCredentials')
        const googleCredentials = await AsyncStorage.getItem('credentials')

        console.log('google creds: ', googleCredentials)

        if (credentials) {
            store.setLoginCredentials(JSON.parse(credentials!))
            if (googleCredentials) {
                if (JSON.parse(googleCredentials).refresh_token !== "" || JSON.parse(googleCredentials).refresh_token !== undefined) {
                    console.log('Credentials: ', JSON.stringify(credentials, null, 4))
                    store.setCredentials(JSON.parse(googleCredentials))
                } else {
                    const refToken = await AsyncStorage.getItem('refresh_token')
                    console.log("ref: ", refToken)
                    let newCreds = JSON.parse(googleCredentials!)
                    newCreds.refresh_token = refToken

                    store.setCredentials(newCreds)
                    console.log('Credentials: ', credentials)
                }
            }
        }
    }

    const fetchSettings = async () => {
        try {
            console.log("fetching settings...")
            const settings = await AsyncStorage.getItem('settings')
            if (settings) {
                await store.updateSettings(JSON.parse(settings))
            }
        } catch (err) {
            console.error(err)
        }

    }

    useEffect(() => {
        const startUp = async (reminderFrequency: string) => {
            await getCredentials()
            await fetchSettings()

            switch (reminderFrequency) {
                case ReminderFrequency.all:
                    await initiateAllReminders()
                    break;
                case ReminderFrequency.selected:
                    PushNotification.cancelAllLocalNotifications()
                    await initiateSelectedReminders()
                    break;
                case ReminderFrequency.none:
                    PushNotification.cancelAllLocalNotifications()
                    break;
                default:
                    console.error("Invalid Case")
                //add default code
            }
        }
        startUp(store.settings.reminder_frequency)
    }, [])

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#121212" }}>
            <StatusBar backgroundColor="#121212" barStyle="light-content" />
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                {/* <Text style={{ fontSize: 80, color: '#a5a2a2', fontFamily: Platform.OS === "ios" ? "segoe-normal" : 'gotham-normal', }}>AIO</Text> */}
                <Image source={require('../Assets/Icons/appicon.png')} style={{ width: 125, height: 125 }} />
                {/* <Text style={{ fontSize: 20, color: '#fff', fontWeight: "bold", }}>OrderGator </Text> */}
            </View>
            {/* <Text style={{ fontSize: 15, color: '#a39e9e', fontFamily: Platform.OS === "ios" ? "segoe-normal" : 'gotham-normal', marginBottom: 10 }}>Made with Love in 🇳🇪 </Text> */}
        </View>
    )
})

export default SplashScreen
