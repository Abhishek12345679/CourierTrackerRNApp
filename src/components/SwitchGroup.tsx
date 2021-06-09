import React from 'react'
import { View, Text, Switch } from 'react-native'


export interface switchGroupProps {
    label: string;
    toggleStatus: boolean,
    onValueChange: (value: boolean) => void
}

const SwitchGroup = (props: switchGroupProps) => {

    return (
        <View
            style={{ flexDirection: 'row', width: '100%', height: 100, justifyContent: 'space-between', alignItems: 'center', paddingStart: 30, paddingEnd: 30 }}>
            <Text style={{ color: '#fff', fontSize: 18, }}>{props.label}</Text>
            <Switch value={props.toggleStatus} onValueChange={props.onValueChange} />
        </View>
    )
}

export default SwitchGroup
