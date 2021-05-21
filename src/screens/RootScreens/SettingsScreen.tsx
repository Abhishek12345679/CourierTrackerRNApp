import React, { useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Switch } from 'react-native-ui-lib'
import SwitchGroup from '../../components/SwitchGroup'

const SettingsScreen = () => {

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#000", }}>
            <SwitchGroup label={"show delivered items"} toggleStatus={true} />
        </ScrollView>
    )
}

export default SettingsScreen
