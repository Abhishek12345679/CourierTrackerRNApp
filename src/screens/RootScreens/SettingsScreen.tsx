import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState } from 'react'
import { View, Text, ScrollView, Button } from 'react-native'
import { Switch } from 'react-native-ui-lib'
import SwitchGroup from '../../components/SwitchGroup'
import store from '../../store/store'

const SettingsScreen = () => {

    const logout = async () => {
        store.resetLoginCredentials()
        store.resetCredentials()
        store.removeOrders()
        await AsyncStorage.removeItem('loginCredentials')
        await AsyncStorage.removeItem('credentials')
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#121212", }}>
            <SwitchGroup label={"show delivered items"} toggleStatus={true} />
            <Button title="Logout" onPress={logout} />
        </ScrollView>
    )
}

export default SettingsScreen
