import AsyncStorage from '@react-native-async-storage/async-storage'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import { View, Text, Image } from 'react-native'
import { sensitiveData } from '../../constants/sen_data'
import { Credentials, Order, OrderList as OrderListType } from '../../constants/Types/OrderTypes'
import store from '../store/store'

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

    useEffect(() => {
        getCredentials()
    }, [])

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#121212" }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 80, color: '#a5a2a2', fontFamily: 'gotham-black' }}>AIO</Text>
                <Text style={{ fontSize: 15, color: '#8b8888', fontFamily: 'gotham-normal' }}>All in One </Text>
            </View>
            <Text style={{ fontSize: 15, color: '#a39e9e', fontFamily: 'gotham-normal', marginBottom: 10 }}>Made with Love in 🇳🇪 </Text>
        </View>
    )
})

export default SplashScreen
