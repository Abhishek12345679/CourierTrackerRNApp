import React, { useEffect, useState } from 'react'
import { View, Button, Text, ScrollView, FlatList, ListRenderItem } from 'react-native'

import store, { Credentials } from '../store/store';
import { sensitiveData } from '../../constants/sen_data';
import { observer } from 'mobx-react';
import GoogleSignInCard from '../components/GoogleSignInCard';
import { Order, AmazonOrder } from '../../constants/Types/OrderTypes';
import OrderItem from '../components/OrderItem';
import OrderList from '../components/OrderList';

const HomeScreen: React.FC = observer((props: any) => {

    const [amazonOrders, setAmazonOrders] = useState<AmazonOrder[]>([])
    const [flipkartOrders, setFlipkartOrders] = useState<Order[]>([])
    const [myntraOrders, setMyntraOrders] = useState<Order[]>([])
    const [ajioOrders, setAjioOrders] = useState<Order[]>([])
    const [gmailAccessStatus, setGmailAccessStatus] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const getAmazonOrders = async (auth: Credentials) => {
        const AZResponse = await fetch(`${sensitiveData.baseUrl}/getAmazonOrderDetails?tokens=${JSON.stringify(auth)}`)
        const AmazonOrders = await AZResponse.json()
        setAmazonOrders(AmazonOrders)
    }

    const getFlipkartOrders = async (auth: Credentials) => {
        const FKResponse = await fetch(`${sensitiveData.baseUrl}/getFlipkartOrderDetails?tokens=${JSON.stringify(auth)}`)
        const FlipkartOrders = await FKResponse.json()
        console.log(JSON.stringify(FlipkartOrders, null, 2))
        setFlipkartOrders(FlipkartOrders.flipkartOrders)
    }
    const getMyntraOrders = async (auth: Credentials) => {
        const MResponse = await fetch(`${sensitiveData.baseUrl}/getMyntraOrderDetails?tokens=${JSON.stringify(auth)}`)
        const MyntraOrders = await MResponse.json()
        setMyntraOrders(MyntraOrders)
    }

    const getAjioOrders = async (auth: Credentials) => {
        const AResponse = await fetch(`${sensitiveData.baseUrl}/getAjioOrderDetails?tokens=${JSON.stringify(auth)}`)
        const AjioOrders = await AResponse.json()
        setAjioOrders(AjioOrders)
    }



    const getGoogleAccess = async () => {
        setIsLoading(true)
        const response = await fetch(`${sensitiveData.baseUrl}/authorize`)
        const data = await response.json()
        setIsLoading(false)
        props.navigation.navigate('AuthUrlScreen', {
            url: decodeURIComponent(data.url)
        })
    }


    useEffect(() => {
        // getAmazonOrders(store.googleCredentials)
        getFlipkartOrders(store.googleCredentials)
        console.log(store.googleCredentials)

        if (store.googleCredentials.refresh_token !== "") {
            setGmailAccessStatus(true)
        }
    }, [])


    // const sortOrders = (orders: FlipkartOrder[] | MyntraOrder[]) => {
    //     var months = ["January", "February", "March", "April", "May", "June",
    //         "July", "August", "September", "October", "November", "December"];
    //     return orders.sort((a, b) =>
    //         months.indexOf(a.ETA.substring(a.ETA.indexOf(',') + 2, a.ETA.lastIndexOf(" ")))
    //         - months.indexOf(b.ETA.substring(b.ETA.indexOf(',') + 2, b.ETA.lastIndexOf(" ")))
    //     );
    // }


    const renderOrderItem: ListRenderItem<Order> = ({ item, index, separators }) => (
        <OrderItem
            item={item}
            index={index}
            separators={separators}
        />
    )

    return (
        <ScrollView style={{ backgroundColor: '#25172e' }}>
            {!gmailAccessStatus && <GoogleSignInCard onPress={getGoogleAccess} loading={isLoading} />}
            <FlatList
                // ListHeaderComponent={
                //     <View>
                //         <Text style={{ fontFamily: "segoe-bold", fontSize: 40, marginTop: 10, marginStart: 10, color: "#fff" }}>Orders</Text>
                //     </View>
                // }
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, marginTop: 20 }}
                contentContainerStyle={{ justifyContent: 'center' }}
                key={(Math.random() * 10000).toString()}
                data={flipkartOrders}
                renderItem={renderOrderItem}
            />
        </ScrollView>
    )
})

export default HomeScreen


