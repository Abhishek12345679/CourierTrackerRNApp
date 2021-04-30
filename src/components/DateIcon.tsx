import React from 'react'
import { View, Text, Dimensions } from 'react-native'

const DateIcon = ({ date }: any) => {
    const Days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat']
    return (
        <View style={{
            backgroundColor: '#fff',
            width: Dimensions.get('window').width / 5 - 20,
            height: 65,
            borderRadius: 15,
            marginTop: 20,
            alignItems: "center",
            justifyContent: 'center'
        }}>
            <Text
                style={{
                    color: "#000",
                    fontWeight: 'bold',
                    fontSize: 20
                }}>
                {new Date(date).getDate()}
            </Text>
            <Text style={{ color: "red", fontWeight: 'bold' }} > {Days[new Date(date).getDay()]}</Text>
        </View>
    )
}

export default DateIcon
