import AsyncStorage from '@react-native-async-storage/async-storage'
import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { View, Text, Image } from 'react-native'
import store from '../store/store'

const SplashScreen = observer(() => {
    // fetch credentials from the Local Storage of the device
    const getCredentials = async () => {
        console.log('splash screen')
        const credentials = await AsyncStorage.getItem('loginCredentials')
        console.log(credentials)

        store.setCredentials(JSON.parse(credentials!))
        store.setTryAutoLogin()
        console.log('Credentials: ', credentials)

    }

    useEffect(() => {
        getCredentials()
    }, [])

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../../src/Assets/Images/smartphone.png')} style={{ width: 200, height: 200, marginVertical: 20 }} />
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Courier Trackerssss</Text>
        </View>
    )
})

export default SplashScreen
