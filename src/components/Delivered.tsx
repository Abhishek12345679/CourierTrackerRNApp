import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'

interface DeliveredProps {
    bgColor: string;
    textColor: string;
    status: boolean;
    width: string;
}

const Delivered = (props: DeliveredProps) => {
    return (
        <View style={{ width: props.width, height: 45, borderRadius: 20, backgroundColor: props.bgColor, justifyContent: "center", alignItems: "center", elevation: 1 }}>
            <Text style={{ color: props.textColor }}>{props.status == true ? "Delivered" : "Not \nDelivered"}</Text>
        </View>
    )
}

export default Delivered
