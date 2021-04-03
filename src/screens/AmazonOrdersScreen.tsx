import React, { useState, useEffect } from 'react'
import { View, Text, Linking, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import { sensitiveData } from '../../constants/sen_data';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AmazonOrdersScreen = () => {

    type AmazonOrder = {
        totalPrice: string;
        orderNumber: string;
        ETA: string;
        delivery_address: string;
        invoiceLink: string;
        orderPreviewLink: string;
    };
    type Credentials = {
        access_token: string;
        refresh_token: string;
        scope: string;
        token_type: string;
        expiry_date: number;
    }

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

    return (
        <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ justifyContent: 'center' }}
            key={(Math.random() * 10000).toString()}
            data={amazonOrders}
            renderItem={({ item, index }) => (
                <TouchableOpacity
                    style={{ width: '100%', height: 100, marginTop: 10, backgroundColor: 'orange', borderRadius: 10 }}
                    onPress={() => Linking.openURL(`com.amazon.mobile.shopping://www.amazon.in/orders/${item.orderNumber}`)}
                    key={index}
                >
                    <Text>{item.orderNumber}</Text>
                    <Text>{item.ETA}</Text>
                    <Text>{item.totalPrice}</Text>
                    <Text>{item.delivery_address}</Text>
                </TouchableOpacity>
            )} />
    )
}

export default AmazonOrdersScreen
