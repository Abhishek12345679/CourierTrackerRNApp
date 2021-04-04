import React, { useState, useEffect } from 'react'
import { View, Text, Pressable, Image, ScrollView, TouchableOpacity, Linking, Button, FlatList } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { sensitiveData } from '../../constants/sen_data';

const uuid = require('react-native-uuid')

const FlipkartOrdersScreen = () => {

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

    const [orders, setOrders] = useState<Order[]>()


    const getCredentials = async () => {
        try {
            const creds = await AsyncStorage.getItem('credentials')
            console.log("saved creds: ", creds);
            return creds != null ? JSON.parse(creds!) : null
        } catch (e) {
            console.log(e)
        }

        console.log('Done.')

    }

    const getFlipkartOrders = async (auth: Credentials) => {
        const FKResponse = await fetch(`${sensitiveData.baseUrl}/getFlipkartOrderDetails?tokens=${JSON.stringify(auth)}`)
        const FlipkartOrders = await FKResponse.json()

        console.log(JSON.stringify(FlipkartOrders, null, 2))
        setOrders(FlipkartOrders.flipkartOrders)
    }


    useEffect(() => {
        getCredentials().then((creds) => {
            console.log("Creds: ", creds)
            try {
                getFlipkartOrders(creds)
            } catch (err) {
                console.log(err)
            }
        })
    }, [])

    return (
        <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ justifyContent: 'center' }}
            key={(Math.random() * 10000).toString()}
            data={orders}
            renderItem={({ item, index }) => (
                <TouchableOpacity
                    style={{ width: '100%', height: 100, marginTop: 10, backgroundColor: 'yellow', borderRadius: 10 }}
                    // onPress={() => Linking.openURL(`com.amazon.mobile.shopping://www.amazon.in/orders/${item.orderNumber}`)}
                    key={index}
                >
                    <Text>{item.orderNumber}</Text>
                    <Text>{item.totalPrice}</Text>
                </TouchableOpacity>
            )} />
    )
}

export default FlipkartOrdersScreen
