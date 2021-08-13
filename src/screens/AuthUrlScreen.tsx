import React, { useEffect, useRef } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview';

import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../store/store';
import { observer } from 'mobx-react';

import database from '@react-native-firebase/database';
import { Order, AmazonOrder, OrderList as OrderListType, AmazonOrderList as AmazonOrderListType, Credentials } from '../../constants/Types/OrderTypes';
import { sensitiveData } from '../../constants/sen_data';
import { getOrders } from '../helpers/ordersHelpers';


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

    const loadOrders = async () => {
        const ordersInAsyncStorage = await AsyncStorage.getItem('orders')
        if (ordersInAsyncStorage === "" || ordersInAsyncStorage === undefined || ordersInAsyncStorage === null) {
            await getOrders()
            // reassign callreminder on re-signin
        } else {
            await store.saveOrders(JSON.parse(ordersInAsyncStorage!))
        }
    }

    const onMessage = async (data: any) => {

        const authData = data.nativeEvent.data
        console.log("from server: ", authData)
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
