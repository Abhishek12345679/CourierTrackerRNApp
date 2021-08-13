import React from 'react'
import { View, Text, Switch } from 'react-native'


export interface switchGroupProps {
    height: string | number | undefined
    label: string;
    subLabel?: string;
    toggleStatus: boolean,
    onValueChange: (value: boolean) => void,
    bgColor: string
    disabled?: boolean | undefined
}

const SwitchGroup = (props: switchGroupProps) => {
    return (
        <View
            style={{ flexDirection: 'row', width: '100%', height: props.height, justifyContent: 'space-between', alignItems: 'center', paddingStart: 30, paddingEnd: 30, backgroundColor: props.bgColor }}>
            {props.subLabel ? <View style={{ flexDirection: 'column' }}>
                <Text style={{ color: '#fff', fontSize: 18, }}>{props.label}</Text>
                <Text style={{ color: '#fff', fontSize: 15, }}>{props.subLabel}</Text>
            </View> :
                <Text style={{ color: '#fff', fontSize: 18, }}>{props.label}</Text>
            }
            <Switch value={props.toggleStatus} onValueChange={props.onValueChange} disabled={props.disabled} />
        </View>
    )
}

export default SwitchGroup
