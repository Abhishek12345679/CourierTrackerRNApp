import React, { useEffect, useState } from 'react'
import { View, Button, Text, ScrollView } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AmazonOrder } from './AmazonOrdersScreen';
import store, { Credentials } from '../store/store';
import { sensitiveData } from '../../constants/sen_data';
import DateIcon from '../components/DateIcon';
import { observer } from 'mobx-react';

const HomeScreen: React.FC = observer((props: any) => {

    const [amazonOrders, setAmazonOrders] = useState<AmazonOrder[]>()

    const getAmazonOrders = async (auth: Credentials) => {
        const AZResponse = await fetch(`${sensitiveData.baseUrl}/getAmazonOrderDetails?tokens=${JSON.stringify(auth)}`)
        const AmazonOrders = await AZResponse.json()

        console.log(JSON.stringify(AmazonOrders, null, 2))
        setAmazonOrders(AmazonOrders.amazonOrders)
    }

    useEffect(() => {
        // getAmazonOrders(store.googleCredentials)
        console.log(store)
    }, [])


    return (
        <ScrollView style={{ flex: 1, }}
            contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1, backgroundColor: "#121212", elevation: 10, alignItems: 'center' }}
                >

                    {amazonOrders?.map((order, idx) => {
                        return (
                            <DateIcon date={order.ETA} />
                        )
                    })}

                </View>

                <View style={{ flex: 4, }}>
                    {
                        amazonOrders?.map((order, idx) => {
                            return (
                                <View style={{ height: 100 }}>
                                    <Text>{order.orderNumber}</Text>
                                    <Text>{order.ETA}</Text>
                                </View>
                            )
                        })


                    }
                    <Button title="logout" onPress={async () => {
                        try {
                            await AsyncStorage.removeItem('credentials')
                            store.resetCredentials()
                            console.log("HS:", store.googleCredentials)
                        } catch (err) {
                            console.error(err)
                        }

                    }} />
                </View>
            </View>
        </ScrollView>
    )
})

export default HomeScreen


