import React, { useEffect, useRef } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview';

import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../store/store';
import { observer } from 'mobx-react';

import database from '@react-native-firebase/database';
import { Order, AmazonOrder, OrderList as OrderListType, AmazonOrderList as AmazonOrderListType, Credentials } from '../../constants/Types/OrderTypes';
import { sensitiveData } from '../../constants/sen_data';


const AuthUrlScreen = observer((props: any) => {
    const url = props.route.params.url
    const webviewRef = useRef(null);

    const quotes = '&#34;'
    const quotesPattern = new RegExp(quotes, 'g')

    const setCredentials = async (credentials: string) => {
        try {
            let tokens = JSON.parse(credentials.replace(quotesPattern, "\""))
            console.log(tokens)
            const refresh_token = tokens.refresh_token as string
            console.log("refresh token // from google servers", refresh_token)
            if (refresh_token !== undefined) {
                /** This block of code executes during the first ever login via google only 
                 *  and thus contains the refresh_token.
                */
                console.log("refresh token present")
                await database()
                    .ref(`/users/${store.loginCredentials.uid}`)
                    .set({ refresh_token: refresh_token })
                console.log('Data set.');

                await AsyncStorage.setItem('credentials', JSON.stringify(tokens))
                store.setCredentials(tokens)
            } else {
                /** This block of code executes during the subsequent logins via google  
                *  and thus does not contains the refresh_token.
               */
                console.log("refresh token not present")

                const userData = await database()
                    .ref(`/users/${store.loginCredentials.uid}`)
                    .once('value')

                const { refresh_token } = userData.val()

                console.log("rtoken: ", refresh_token)
                tokens.refresh_token = refresh_token
                await AsyncStorage.setItem('credentials', JSON.stringify(tokens))
                store.setCredentials(tokens)
            }

        } catch (e) {
            console.log("Error: ", e)
        }
        console.log('Saved Refresh Token!')
    }



    //..

    const getAmazonOrders = async (auth: Credentials) => {
        const AZResponse = await fetch(`${sensitiveData.baseUrl}/getAmazonOrderDetails?tokens=${JSON.stringify(auth)}&newer_than=${store.settings.orders_newer_than}`)
        const AmazonOrders = await AZResponse.json()
        console.log(JSON.stringify(AmazonOrders.amazonOrders, null, 2))
        return AmazonOrders.amazonOrders
    }

    const getFlipkartOrders = async (auth: Credentials) => {
        const FKResponse = await fetch(`${sensitiveData.baseUrl}/getFlipkartOrderDetails?tokens=${JSON.stringify(auth)}&newer_than=${store.settings.orders_newer_than}`)
        const FlipkartOrders = await FKResponse.json()
        return FlipkartOrders.flipkartOrders
    }
    const getMyntraOrders = async (auth: Credentials) => {
        const MResponse = await fetch(`${sensitiveData.baseUrl}/getMyntraOrderDetails?tokens=${JSON.stringify(auth)}&newer_than=${store.settings.orders_newer_than}`)
        const MyntraOrders = await MResponse.json()
        return MyntraOrders.myntraOrders
    }

    const getAjioOrders = async (auth: Credentials) => {
        const AResponse = await fetch(`${sensitiveData.baseUrl}/getAjioOrderDetails?tokens=${JSON.stringify(auth)}&newer_than=${store.settings.orders_newer_than}`)
        const AjioOrders = await AResponse.json()
        return AjioOrders.ajioOrders
    }

    // const fetchUserInfo = async () => {
    //     const userInfo = await store.fetchUserInfo()
    //     if (userInfo !== undefined) {
    //         setPfp(userInfo.profilePicture)
    //         setName(userInfo.name)
    //     }
    // }

    const fetchManualOrders = async (): Promise<Order[] | unknown[]> => {
        return await database().ref(`/users/${store.loginCredentials.uid}/orders`)
            .once('value')
            .then((snapshot) => {
                const orders = snapshot.val()
                const newOrders = Object.entries(orders).map(([_, value]) => value)
                return newOrders
            });
    }

    const getOrders = async () => {
        // setFetchingOrders(true)

        const flipkartOrders = await getFlipkartOrders(store.googleCredentials)
        const myntraOrders = await getMyntraOrders(store.googleCredentials)
        const ajioOrders = await getAjioOrders(store.googleCredentials)
        const amazonOrders = await getAmazonOrders(store.googleCredentials)

        const manualOrders = await fetchManualOrders()

        const groupedOrders = groupOrders(flipkartOrders, myntraOrders, ajioOrders, manualOrders as Order[])
        const sortedOrders = sortOrders(groupedOrders)

        const groupedAmazonOrders = groupAmazonOrders(amazonOrders)
        const sortedAmazonOrders = sortAmazonOrders(groupedAmazonOrders)

        store.saveOrders(sortedOrders)
        await store.saveOrdersLocally(sortedOrders)
        store.saveAmazonOrders(sortedAmazonOrders)
        await store.saveAmazonOrdersLocally(sortedAmazonOrders)
        // setFetchingOrders(false)

        // console.log("sorted orders: ", JSON.stringify(store.orders, null, 4))
        // console.log("sorted orders: ", JSON.stringify(store.amazonOrders, null, 4))
    }


    const sortOrders = (groupedOrders: OrderListType[]) => {
        groupedOrders.sort((a: OrderListType, b: OrderListType) => {
            return parseInt(a.EstimatedDeliveryTime) - parseInt(b.EstimatedDeliveryTime)
        })
        return groupedOrders
    }


    const groupOrders = (flipkartOrders: Order[], myntraOrders: Order[], ajioOrders: Order[], manualOrders: Order[]) => {
        // console.log("manual orders: ", manualOrders)
        let superArray = []
        superArray = [...flipkartOrders, ...myntraOrders, ...ajioOrders, ...manualOrders]
        const groups = superArray.reduce((acc: any, order: Order) => {
            acc[Date.parse(order.ETA)] = acc[Date.parse(order.ETA)] ? acc[Date.parse(order.ETA)].concat(order) : [order]
            return acc
        }, {})

        // console.log(JSON.stringify(groups, null, 4))

        const newOrderList: OrderListType[] = Object.entries(groups).map(([k, v]) => ({
            EstimatedDeliveryTime: k,
            orderItems: v as Order[]
        }))
        return newOrderList
    }

    const groupAmazonOrders = (amazonOrders: AmazonOrder[]) => {
        const groups = amazonOrders.reduce((acc: any, order: AmazonOrder) => {
            acc[Date.parse(order.ETA)] = acc[Date.parse(order.ETA)] ? acc[Date.parse(order.ETA)].concat(order) : [order]
            return acc
        }, {})

        // console.log(JSON.stringify(groups, null, 4))

        const newOrderList: AmazonOrderListType[] = Object.entries(groups).map(([k, v]) => ({
            EstimatedDeliveryTime: k,
            orderItems: v as AmazonOrder[]
        }))
        return newOrderList
    }

    const sortAmazonOrders = (groupedOrders: AmazonOrderListType[]) => {
        groupedOrders.sort((a: AmazonOrderListType, b: AmazonOrderListType) => {
            return parseInt(a.EstimatedDeliveryTime) - parseInt(b.EstimatedDeliveryTime)
        })
        return groupedOrders
    }


    const loadOrders = async () => {
        const ordersInAsyncStorage = await AsyncStorage.getItem('orders')
        if (ordersInAsyncStorage === "" || ordersInAsyncStorage === undefined || ordersInAsyncStorage === null) {
            getOrders()
        } else {
            store.saveOrders(JSON.parse(ordersInAsyncStorage!))
        }
    }

    const onMessage = async (data: any) => {

        const authData = data.nativeEvent.data
        // console.log("from server: ", authData)
        try {
            await setCredentials(authData)
            await loadOrders()
            props.navigation.navigate("HomeScreen", {
                gmailAccess: true
            })
        } catch (e) {
            console.log("Credentials not saved!: ", e)
        }

    }


    function LoadingIndicatorView() {
        return (
            <ActivityIndicator
                color="#009b88"
                size="large"
                style={{
                    flex: 1,
                    justifyContent: "center",
                }}
            />
        )
    }

    return (
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
            <WebView
                ref={webviewRef}
                source={{ uri: url }}
                userAgent={"Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.1 Mobile/15E148 Safari/604.1"}
                onMessage={onMessage}
                renderLoading={LoadingIndicatorView}
                startInLoadingState={true}
            />
        </View>
    )
})

export default AuthUrlScreen
