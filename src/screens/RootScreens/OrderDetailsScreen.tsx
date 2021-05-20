import React, { useEffect } from 'react'
import { View, Text, ScrollView } from 'react-native'
import Image from 'react-native-ui-lib/image'
import { Order } from '../../../constants/Types/OrderTypes'

const OrderDetailsScreen = (props: any) => {
    const { item } = props.route.params
    useEffect(() => {
        props.navigation.setOptions({
            title: item.productName
        })
    }, []);

    return (
        <ScrollView style={{ flex: 1 }}>
            {/* <Text>{item.orderNumber}</Text> */}
            <Image source={{ uri: item.productImage }} style={{ width: '100%', height: 400, resizeMode: 'cover' }} />
            {/* <Text style={{ color: '#fff', fontSize: 25, fontFamily: 'segoe-bold', marginTop: 20 }}>Arriving by {item.ETA}</Text> */}
        </ScrollView>
    )
}

export default OrderDetailsScreen
