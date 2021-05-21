import React from 'react'
import { View, Text } from 'react-native'
import { Switch } from 'react-native-ui-lib'


interface switchGroupProps {
    label: string;
    toggleStatus: boolean
}

const SwitchGroup = (props: switchGroupProps) => {

    return (
        <View
            style={{ flexDirection: 'row', width: '100%', height: 100, justifyContent: 'space-between', alignItems: 'center', paddingStart: 30, paddingEnd: 30 }}>
            <Text style={{ color: '#fff', fontSize: 18, }}>{props.label}</Text>
            <Switch value={props.toggleStatus} onValueChange={() => { }} />
        </View>
    )
}

export default SwitchGroup
