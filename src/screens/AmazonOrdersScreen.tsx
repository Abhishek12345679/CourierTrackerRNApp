import React, { useState, useEffect } from 'react'
import { View, Text, Linking, FlatList, ActivityIndicator, TouchableOpacity, ListRenderItem } from 'react-native'
import { sensitiveData } from '../../constants/sen_data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrderItem from '../components/OrderItem';



export type AmazonOrder = {
    totalPrice: string;
    orderNumber: string;
    ETA: string;
    delivery_address: string;
    invoiceLink: string;
    orderPreviewLink: string;
};
export type Credentials = {
    access_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    expiry_date: number;
}

const AmazonOrdersScreen = () => {


    const [auth, setAuth] = useState<Credentials>()
    const [amazonOrders, setAmazonOrders] = useState<AmazonOrder[]>()

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

    const getAmazonOrders = async (auth: Credentials) => {
        const AZResponse = await fetch(`${sensitiveData.baseUrl}/getAmazonOrderDetails?tokens=${JSON.stringify(auth)}`)
        const AmazonOrders = await AZResponse.json()

        console.log(JSON.stringify(AmazonOrders, null, 2))
        setAmazonOrders(AmazonOrders.amazonOrders)
    }

    useEffect(() => {
        getCredentials().then((creds) => {
            console.log("Creds: ", creds)
            // setAuth(creds as Credentials)
            getAmazonOrders(creds)
        }).catch((err) => { console.log(err) })
    }, [])

    if (!!!amazonOrders) {
        return (
            <View style={{ flex: 1 }}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        )
    }

    const renderOrderItem: ListRenderItem<AmazonOrder> = ({ item, index, separators }) => (
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
            data={amazonOrders}
            renderItem={renderOrderItem}
        />
    )
}

export default AmazonOrdersScreen
