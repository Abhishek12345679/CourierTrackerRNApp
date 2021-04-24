import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Linking, FlatList, ActivityIndicator } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { sensitiveData } from '../../constants/sen_data';
import store from '../store/store';


type Order = {
    totalPrice: string;
    orderNumber: string;
    orderItems: [
        {
            productName: string;
            productImage: string;
            sellerName: string;
            deliveryCharges?: string;
            ETA: string;
            quantity: string;
            deliveryDiscount?: string;
            productPrice: string;
            productLink?: string;

        }
    ];
    totalDeliveryCharges?: string;
};


type Credentials = {
    access_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    expiry_date: number;
}

const MyntraOrdersScreen = () => {

    const [orders, setOrders] = useState<Order[]>()

    const getMyntraOrders = async (auth: Credentials) => {
        const FKResponse = await fetch(`${sensitiveData.baseUrl}/getMyntraOrderDetails?tokens=${JSON.stringify(auth)}`)
        const MyntraOrders = await FKResponse.json()

        console.log(JSON.stringify(MyntraOrders, null, 2))
        setOrders(MyntraOrders.MyntraOrders)
    }

    useEffect(() => {
        getMyntraOrders(store.googleCredentials)
    }, [])

    if (!!!orders) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        )
    }

    return (
        <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ justifyContent: 'center' }}
            key={(Math.random() * 10000).toString()}
            data={orders}
            renderItem={({ item, index }) => (
                <TouchableOpacity
                    style={{ width: '100%', height: 100, marginTop: 10, backgroundColor: 'pink', borderRadius: 10 }}
                    onPress={() => Linking.openURL(`myntra://www.myntra.com/my/item/details?storeOrderId=${item.orderNumber.split('-').join("")}`)}
                    key={index}
                >
                    <Text>{item.orderNumber}</Text>
                    <Text>{item.totalPrice}</Text>
                </TouchableOpacity>
            )} />
    )
}

export default MyntraOrdersScreen
