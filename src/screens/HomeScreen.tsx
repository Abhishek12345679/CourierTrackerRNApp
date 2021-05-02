import React, { useEffect, useState } from 'react'
import { View, Button, Text, ScrollView, FlatList, ListRenderItem } from 'react-native'

import { AmazonOrder } from './AmazonOrdersScreen';
import store, { Credentials } from '../store/store';
import { sensitiveData } from '../../constants/sen_data';
import { observer } from 'mobx-react';
import GoogleSignInCard from '../components/GoogleSignInCard';
import { Order as FlipkartOrder } from './FlipkartOrdersScreen';
import { Order as MyntraOrder } from './MyntraOrdersScreen';
import OrderItem from '../components/OrderItem';
import OrderList from '../components/OrderList';

const HomeScreen: React.FC = observer((props: any) => {

    const [amazonOrders, setAmazonOrders] = useState<AmazonOrder[]>([])
    const [flipkartOrders, setFlipkartOrders] = useState<FlipkartOrder[]>([])
    const [myntraOrders, setMyntraOrders] = useState<MyntraOrder[]>([])
    const [ajioOrders, setAjioOrders] = useState<MyntraOrder[]>([])
    const [gmailAccessStatus, setGmailAccessStatus] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const getAmazonOrders = async (auth: Credentials) => {
        const AZResponse = await fetch(`${sensitiveData.baseUrl}/getAmazonOrderDetails?tokens=${JSON.stringify(auth)}`)
        const AmazonOrders = await AZResponse.json()

        // const sortedArray = sortOrders(AmazonOrders.amazonOrders)
        // console.log(JSON.stringify(sortedArray, null, 2))
        setAmazonOrders(AmazonOrders)
    }

    const getFlipkartOrders = async (auth: Credentials) => {
        const FKResponse = await fetch(`${sensitiveData.baseUrl}/getFlipkartOrderDetails?tokens=${JSON.stringify(auth)}`)
        const FlipkartOrders = await FKResponse.json()

        // const sortedArray = sortOrders(FlipkartOrders.flipkartOrders)
        console.log(JSON.stringify(FlipkartOrders.flipkartOrders, null, 2))
        setFlipkartOrders(FlipkartOrders.flipkartOrders)
    }
    const getMyntraOrders = async (auth: Credentials) => {
        const MResponse = await fetch(`${sensitiveData.baseUrl}/getMyntraOrderDetails?tokens=${JSON.stringify(auth)}`)
        const MyntraOrders = await MResponse.json()

        // const sortedArray = sortOrders(FlipkartOrders.flipkartOrders)
        // console.log(JSON.stringify(sortedArray, null, 2))
        setMyntraOrders(MyntraOrders)
    }

    const getAjioOrders = async (auth: Credentials) => {
        const AResponse = await fetch(`${sensitiveData.baseUrl}/getAjioOrderDetails?tokens=${JSON.stringify(auth)}`)
        const AjioOrders = await AResponse.json()

        // const sortedArray = sortOrders(FlipkartOrders.flipkartOrders)
        // console.log(JSON.stringify(sortedArray, null, 2))
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


    const sortOrders = (orders: AmazonOrder[]) => {
        var months = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        return orders.sort((a, b) =>
            months.indexOf(a.ETA.substring(a.ETA.indexOf(',') + 2, a.ETA.lastIndexOf(" ")))
            - months.indexOf(b.ETA.substring(b.ETA.indexOf(',') + 2, b.ETA.lastIndexOf(" ")))
        );
    }

    const renderOrderItem: ListRenderItem<FlipkartOrder> = ({ item, index, separators }) => (
        <OrderList
            item={item}
            index={index}
            separators={separators}
        />
    )



    return (
        <ScrollView style={{}}
            contentContainerStyle={{}}>
            {!gmailAccessStatus && <GoogleSignInCard onPress={getGoogleAccess} loading={isLoading} />}
            <FlatList
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
                contentContainerStyle={{ justifyContent: 'center' }}
                key={(Math.random() * 10000).toString()}
                data={flipkartOrders}
                renderItem={renderOrderItem}
            />
        </ScrollView>
    )
})

export default HomeScreen


