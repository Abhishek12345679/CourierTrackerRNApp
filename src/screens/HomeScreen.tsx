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

        // console.log(JSON.stringify(AmazonOrders, null, 2))
        const sortedArray = sortOrders(AmazonOrders.amazonOrders)
        console.log(JSON.stringify(sortedArray, null, 2))
        setAmazonOrders(sortedArray.reverse())
    }

    useEffect(() => {
        // getAmazonOrders(store.googleCredentials)
        // console.log(store.loginCredentials)
    }, [])


    const sortOrders = (orders: AmazonOrder[]) => {
        var months = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        return orders.sort((a, b) =>
            months.indexOf(a.ETA.substring(a.ETA.indexOf(',') + 2, a.ETA.lastIndexOf(" ")))
            - months.indexOf(b.ETA.substring(b.ETA.indexOf(',') + 2, b.ETA.lastIndexOf(" ")))
        );
    }


    return (
        <ScrollView style={{ flex: 1, }}
            contentContainerStyle={{ flexGrow: 1 }}>
            {/* <View style={{ flex: 1, flexDirection: 'row' }}>
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
                                <View style={{ height: 100, marginTop: 10, backgroundColor: "red", marginHorizontal: 5 }}>
                                    <Text>{order.orderNumber}</Text>
                                    <Text>{order.ETA}</Text>
                                </View>
                            )
                        })



                    }
                    <Button title="logout" onPress={async () => {
                        try {
                            await AsyncStorage.removeItem('loginCredentials')
                            store.resetLoginCredentials()
                        } catch (err) {
                            console.error(err)
                        }

                    }} />
                </View> */}
            {/* </View> */}
            <Text>Home screen</Text>
        </ScrollView>
    )
})

export default HomeScreen


