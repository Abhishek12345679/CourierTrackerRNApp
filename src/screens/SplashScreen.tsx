import AsyncStorage from '@react-native-async-storage/async-storage'
import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { View, Text, Platform, Image, StatusBar } from 'react-native'
import PushNotification from 'react-native-push-notification'
import { initiateAllReminders, initiateSelectedReminders } from '../helpers/notificationHelpers'
import { getOrders } from '../helpers/ordersHelpers'
import store from '../store/store'

import RNBootSplash from "react-native-bootsplash";


enum ReminderFrequency {
    all = "all",
    none = "none",
    selected = "selected"
}

const SplashScreen = observer(() => {

    console.log("Splash Screen Visible !!")

    // fetch credentials from the Local Storage of the device
    const getCredentials = async () => {
        store.setTryAutoLogin()

        const credentials = await AsyncStorage.getItem('loginCredentials')
        const googleCredentials = await AsyncStorage.getItem('credentials')


        if (credentials) {
            store.setLoginCredentials(JSON.parse(credentials!))
            if (googleCredentials) {
                if (JSON.parse(googleCredentials).refresh_token !== "" || JSON.parse(googleCredentials).refresh_token !== undefined) {
                    store.setCredentials(JSON.parse(googleCredentials))
                } else {
                    const refToken = await AsyncStorage.getItem('refresh_token')
                    let newCreds = JSON.parse(googleCredentials!)
                    newCreds.refresh_token = refToken

                    store.setCredentials(newCreds)
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

            const init = async () => {
                // …do multiple sync or async tasks
                await getCredentials()
                await fetchSettings()
                await getOrders()

                if (store.orders.length > 0 && store.amazonOrders.length > 0)
                    switch (reminderFrequency) {
                        case ReminderFrequency.all:
                            console.log("ALL")
                            await initiateAllReminders()
                            break;
                        case ReminderFrequency.selected:
                            console.log("selected")
                            PushNotification.cancelAllLocalNotifications()
                            await initiateSelectedReminders()
                            break;
                        case ReminderFrequency.none:
                            console.log("NONE")
                            PushNotification.cancelAllLocalNotifications()
                            break;
                        default:
                            console.error("Invalid Case")
                    }
            };

            init()
                .then(() => {
                    RNBootSplash.hide()
                }).catch((err) => {
                    console.error(err)
                    RNBootSplash.hide()
                })
        }
        startUp(store.settings.reminder_frequency)
    }, [])


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#121212" }}>
            <StatusBar backgroundColor="#121212" barStyle="light-content" />
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Image source={require('../Assets/Icons/appicon.png')} style={{ width: 125, height: 125 }} />
            </View>
        </View>
    )
})

export default SplashScreen
