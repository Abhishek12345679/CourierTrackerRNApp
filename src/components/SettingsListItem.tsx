import React from 'react'
import { View } from 'react-native'
import SwitchGroup from './SwitchGroup'

import { switchGroupProps } from './SwitchGroup'


const SettingsListItem = (props: switchGroupProps) => {
    return (
        <View style={{
            flex: 1,
            flexDirection: 'row',
            height: 60,
            backgroundColor: '#202020ed',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: 5,
            width: "100%"
        }}>
            <SwitchGroup
                disabled={props.disabled}
                label={props.label}
                subLabel={props.subLabel}
                toggleStatus={props.toggleStatus}
                onValueChange={props.onValueChange}
                bgColor="#ffffff00"
                height={100}
            />
        </View>
    )
}

export default SettingsListItem
