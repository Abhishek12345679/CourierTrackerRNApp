import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, ListRenderItem } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { sensitiveData } from '../../constants/sen_data';
import OrderItem from '../components/OrderItem';
import store from '../store/store';


export type Order = {
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


export type Credentials = {
    access_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    expiry_date: number;
}

const FlipkartOrdersScreen = () => {

    const [orders, setOrders] = useState<Order[]>()


    const getFlipkartOrders = async (auth: Credentials) => {
        const FKResponse = await fetch(`${sensitiveData.baseUrl}/getFlipkartOrderDetails?tokens=${JSON.stringify(auth)}`)
        const FlipkartOrders = await FKResponse.json()
        console.log("Flipkart", JSON.stringify(FlipkartOrders, null, 2))
        setOrders(FlipkartOrders.flipkartOrders)

    }

    useEffect(() => {
        getFlipkartOrders(store.googleCredentials)
    }, [])

    if (!!!orders) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        )
    }


    const renderOrderItem: ListRenderItem<Order> = ({ item, index, separators }) => (
        <OrderItem
            item={item}
            index={index}
            separators={separators}
        />
    )


    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{ justifyContent: 'center' }}
            key={(Math.random() * 10000).toString()}
            data={orders}
            renderItem={renderOrderItem}
        />
    )
}

export default FlipkartOrdersScreen
