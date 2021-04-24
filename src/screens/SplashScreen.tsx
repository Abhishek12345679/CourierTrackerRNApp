import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import store from '../store/store'

const SplashScreen = () => {
    // fetch credentials from the Local Storage of the device
    const getCredentials = async () => {
        console.log('splash screen')
        const credentials = await AsyncStorage.getItem('credentials')
        const refresh_token = await AsyncStorage.getItem('refresh_token')

        console.log(credentials)

        if (credentials && refresh_token) {
            JSON.parse(credentials).refresh_token = refresh_token
            store.setCredentials(JSON.parse(credentials))
            store.setTryAutoLogin()
            console.log('Credentials: ', credentials)
        } else {
            store.setTryAutoLogin()
            console.log('Credentials: ', credentials)
        }
    }

    useEffect(() => {
        getCredentials()
    }, [])

    return (
        <View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Courier Trackerss</Text>
        </View>
    )
}

export default SplashScreen
