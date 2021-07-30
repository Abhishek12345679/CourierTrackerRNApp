import React from 'react'
import { View, Text, Switch } from 'react-native'


export interface switchGroupProps {
    height: string | number | undefined
    label: string;
    toggleStatus: boolean,
    onValueChange: (value: boolean) => void,
    bgColor: string
    disabled?: boolean | undefined
}

const SwitchGroup = (props: switchGroupProps) => {
    return (
        <View
            style={{ flexDirection: 'row', width: '100%', height: props.height, justifyContent: 'space-between', alignItems: 'center', paddingStart: 30, paddingEnd: 30, backgroundColor: props.bgColor }}>
            <Text style={{ color: '#fff', fontSize: 18, }}>{props.label}</Text>
            <Switch value={props.toggleStatus} onValueChange={props.onValueChange} disabled={props.disabled} />
        </View>
    )
}

export default SwitchGroup
