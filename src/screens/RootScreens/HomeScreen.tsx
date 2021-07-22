import React, { useEffect, useState, useCallback } from 'react'
import { View, FlatList, ListRenderItem, TouchableOpacity, ActivityIndicator, Text, RefreshControl, Platform, Image, StatusBar, InteractionManager, ScrollView, Alert } from 'react-native'
import store, { Credentials, userInfoType } from '../../store/store';
import { sensitiveData } from '../../../constants/sen_data';
import { observer } from 'mobx-react';
import GoogleSignInCard from '../../components/GoogleSignInCard';
import { Order, AmazonOrder, OrderList as OrderListType, AmazonOrderList as AmazonOrderListType } from '../../../constants/Types/OrderTypes';
import OrderList from '../../components/OrderList';
import { Avatar, Incubator } from 'react-native-ui-lib';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Modal } from '@ui-kitten/components'
import { HeaderTitle } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { TextField } = Incubator

import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';

import { useFocusEffect } from '@react-navigation/native';

import SegmentedControl from '@react-native-segmented-control/segmented-control';
import AmazonOrderList from '../../components/AmazonOrderList'
import PushNotification from "react-native-push-notification";
import { Button } from 'react-native';
import { parse } from 'react-native-svg';

const HomeScreen: React.FC = observer((props: any) => {

    // const getManualOrders = async () => {
    //     const orders = await AsyncStorage.getItem('orders')
    //     console.log(orders)
    // }
    // getManualOrders()


    const [gmailAccessStatus, setGmailAccessStatus] = useState(props.route.params.gmailAccess)
    const [isLoading, setIsLoading] = useState(false)
    const [fetchingOrders, setFetchingOrders] = useState(false)

    const [visible, setVisible] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)

    const isAndroid = (Platform.OS === "android")
    const [pfp, setPfp] = useState(store.userInfo.profilePicture)
    const [name, setName] = useState(store.userInfo.name)
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [forceRefresh, setForceRefresh] = useState(0)

    let fromScreen = props.route.params.from

    enum orderType {
        amazon = "amazon",
    }

    useEffect(() => {
        const fetchInfo = async () => {
            fetchUserInfo()
        }
        fetchInfo()
    }, [])

    const onRefresh = React.useCallback(() => {
        console.log("refreshing...")
        setRefreshing(true);
        getOrders().then(() => {
            setRefreshing(false)
        }).catch((err) => {
            setRefreshing(false)
        })
    }, []);

    const getAmazonOrders = async (auth: Credentials) => {
        const AZResponse = await fetch(`${sensitiveData.baseUrl}/getAmazonOrderDetails?tokens=${JSON.stringify(auth)}&newer_than=${store.settings.orders_newer_than}`)
        const AmazonOrders = await AZResponse.json()
        // console.log(JSON.stringify(AmazonOrders.amazonOrders, null, 2))
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


    const fetchUserInfo = async () => {
        const userInfo = await store.fetchUserInfo()
        if (userInfo !== undefined) {
            setPfp(userInfo.profilePicture)
            setName(userInfo.name)
        }
    }

    const fetchManualOrders = async (): Promise<Order[] | unknown[]> => {
        let emptyOrders: Order[] = [];
        return await database().ref(`/users/${store.loginCredentials.uid}/orders`)
            .once('value')
            .then((snapshot) => {
                const orders = snapshot.val()
                console.log(orders)
                if (orders === null) {
                    return emptyOrders
                }
                const newOrders = Object.entries(orders).map(([_, value]) => value)
                return newOrders
            });
    }

    const getOrders = async () => {

        setFetchingOrders(true)
        try {

            const flipkartOrders = await getFlipkartOrders(store.googleCredentials)
            const myntraOrders = await getMyntraOrders(store.googleCredentials)
            const ajioOrders = await getAjioOrders(store.googleCredentials)
            const amazonOrders = await getAmazonOrders(store.googleCredentials)

            const manualOrders = await fetchManualOrders()

            const groupedOrders = await groupOrders(flipkartOrders, myntraOrders, ajioOrders, manualOrders as Order[])
            const sortedOrders = sortOrders(groupedOrders!)

            const groupedAmazonOrders = await groupAmazonOrders(amazonOrders)
            const sortedAmazonOrders = sortAmazonOrders(groupedAmazonOrders)

            await store.saveOrders(sortedOrders)
            await store.saveOrdersLocally(sortedOrders)
            await store.saveAmazonOrders(sortedAmazonOrders)
            await store.saveAmazonOrdersLocally(sortedAmazonOrders)

            setTimeout(() => {
                fromScreen = ""
                setFetchingOrders(false)
            }, 5000)
        } catch (err) {
            console.error(err)
            setFetchingOrders(false)
        }
    }


    const sortOrders = (groupedOrders: OrderListType[]) => {
        groupedOrders.sort((a: OrderListType, b: OrderListType) => {
            return parseInt(a.EstimatedDeliveryTime) - parseInt(b.EstimatedDeliveryTime)
        })
        return groupedOrders
    }

    const groupOrders = async (flipkartOrders: Order[], myntraOrders: Order[], ajioOrders: Order[], manualOrders: Order[]) => {
        try {

            let superArray: Order[] = []
            superArray = [...flipkartOrders, ...myntraOrders, ...ajioOrders, ...manualOrders]

            let orders = await AsyncStorage.getItem('orders')
            if (orders) {
                const parsedOrders = JSON.parse(orders)
                const newOrders: Order[] = parsedOrders.reduce((orderList: Order[], items: OrderListType) => [...orderList, ...items.orderItems], [])

                newOrders.forEach((localItem) => {
                    superArray.forEach((item) => {
                        console.log(item.orderId, localItem)
                        if (item.orderId === localItem.orderId) {
                            console.log("matched")
                            item.callReminder = localItem.callReminder
                        }
                    })
                })
            }

            const groups = superArray.reduce((acc: any, order: Order) => {
                acc[Date.parse(order.ETA)] = acc[Date.parse(order.ETA)] ? acc[Date.parse(order.ETA)].concat(order) : [order]
                return acc
            }, {})

            const newOrderList: OrderListType[] = Object.entries(groups).map(([k, v]) => ({
                EstimatedDeliveryTime: k,
                orderItems: v as Order[]
            }))
            return newOrderList
        } catch (err) {
            console.error(err)
        }
    }

    const groupAmazonOrders = async (amazonOrders: AmazonOrder[]) => {

        let orders = await AsyncStorage.getItem('amazonOrders')
        if (orders) {
            const parsedOrders = JSON.parse(orders)
            const newOrders: Order[] = parsedOrders.reduce((orderList: AmazonOrder[], items: AmazonOrderListType) => [...orderList, ...items.orderItems], [])

            newOrders.forEach((localItem) => {
                amazonOrders.forEach((item) => {
                    if (item.orderId === localItem.orderId) {
                        item.callReminder = localItem.callReminder
                    }
                })
            })
        }

        const groups = amazonOrders.reduce((acc: any, order: AmazonOrder) => {
            acc[Date.parse(order.ETA)] = acc[Date.parse(order.ETA)] ? acc[Date.parse(order.ETA)].concat(order) : [order]
            return acc
        }, {})

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

    const renderOrderItem: ListRenderItem<OrderListType> = ({ item, index, separators }) => (
        <OrderList
            item={item}
            index={index}
            separators={separators}
            goToOverview={() => props.navigation.navigate("ETAOverview", {
                ETAList: store.orders.map((data) => data.EstimatedDeliveryTime)
            })}
        // navigation={props.navigation}
        />
    )
    const renderAmazonOrderItem: ListRenderItem<AmazonOrderListType> = ({ item, index, separators }) => (
        <AmazonOrderList
            item={item}
            index={index}
            separators={separators}
            goToOverview={() => props.navigation.navigate("ETAOverview", {
                ETAList: store.orders.map((data) => data.EstimatedDeliveryTime)
            })}
        // navigation={props.navigation}
        />
    )

    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                    {isAndroid && <TouchableOpacity
                        style={{ width: 30, height: 30, borderRadius: 20, backgroundColor: '#d8d6d6', justifyContent: 'center', alignItems: 'center', marginEnd: 20, shadowColor: '#da1d1d', elevation: 50 }}
                        onPress={() => {
                            props.navigation.navigate('AddOrder')
                        }}>
                        {/* <Text>Add</Text> */}
                        <MaterialIcons name="add" size={24} />
                    </TouchableOpacity>}
                    <TouchableOpacity style={{ marginEnd: 20, }} onPress={() => props.navigation.navigate('Settings')}>
                        <Avatar
                            size={isAndroid ? 50 : 40}
                            source={{ uri: store.userInfo.profilePicture }}
                            animate
                            imageStyle={{ shadowColor: '#fff', shadowOffset: { width: 10, height: 10 }, shadowOpacity: 0.9, shadowRadius: 50 }}
                        />
                    </TouchableOpacity>
                </View>
            ),
            headerLeft: () => (
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                    {!isAndroid ? <TouchableOpacity
                        style={{ width: 30, height: 30, borderRadius: 20, backgroundColor: '#d8d6d6', justifyContent: 'center', alignItems: 'center', marginEnd: 20 }}
                        onPress={() => props.navigation.navigate('AddOrder')}>
                        <MaterialIcons name="add" size={24} />
                    </TouchableOpacity> :
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            {/* <Image source={require('../../Assets/Icons/appicon.png')} style={{ width: 40, height: 40 }} /> */}
                            <HeaderTitle tintColor="#d6d3d3" style={{ fontFamily: "gotham-black", fontSize: 40, color: "#ffffff", marginStart: 10 }}>{`Orders`}</HeaderTitle>
                        </View>
                    }
                </View>
            ),
        })
    }, [name, pfp]);

    //check gmail status after logging out (every time, screen is in focus) but mainly bc i had to check the status after logging out [HACKY]
    useFocusEffect(
        useCallback(() => {
            const checkGmailAccessStatus = async () => {
                console.log("checking status...")
                const googleCreds = await AsyncStorage.getItem('credentials')
                if (googleCreds === "" || googleCreds == null) {
                    setGmailAccessStatus(false)
                } else {
                    setGmailAccessStatus(true)
                    await fetchUserInfo()
                }
            }
            checkGmailAccessStatus()
        }, [fromScreen])
    )


    // re-fetch all orders when adding new manual order
    // useFocusEffect(
    //     useCallback(() => {
    //         if (fromScreen === "AddOrderScreen" || fromScreen === "SettingsScreen") {
    //             const loadOrders = async () => {
    //                 console.log("from: ", fromScreen)
    //                 // fromScreen = "";
    //                 await getOrders()
    //             }
    //             loadOrders()
    //         }
    //     }, [fromScreen])
    // )

    //runs only once when the screen is loaded/rendered [HACKY]
    useEffect(() => {
        const loadOrders = async () => {
            const googleCreds = await AsyncStorage.getItem('credentials')
            if (googleCreds !== null) {
                setGmailAccessStatus(true)
                const ordersInAsyncStorage = await AsyncStorage.getItem('orders')
                const amazonOrdersInAsyncStorage = await AsyncStorage.getItem('amazonOrders')
                if (ordersInAsyncStorage === "" || ordersInAsyncStorage === undefined || ordersInAsyncStorage === null) {
                    await getOrders()
                    await fetchUserInfo()
                    // await initiateNotifications()

                } else {
                    await store.saveOrders(JSON.parse(ordersInAsyncStorage!))
                    await store.saveAmazonOrders(JSON.parse(amazonOrdersInAsyncStorage!))
                    // await initiateNotifications()
                }
            }
        }
        loadOrders()
    }, [])

    const getGoogleAccess = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${sensitiveData.baseUrl}/authorize`)
            const data = await response.json()
            setIsLoading(false)
            props.navigation.navigate('AuthUrlScreen', {
                url: decodeURIComponent(data.url)
            })
        } catch (err) {
            console.error(err)
            setIsLoading(false)
        }
    }


    if (store.orders.length === 0 && !gmailAccessStatus)

        return (
            <View style={{ flex: 1, backgroundColor: '#121212' }}>
                {
                    !gmailAccessStatus && (<View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}><GoogleSignInCard onPress={getGoogleAccess} loading={isLoading} /></View>)
                }
                <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: "#fff" }}>No Orders</Text>
                </View>
            </View>
        )

    console.log(gmailAccessStatus)
    return (
        <View style={{ flex: 1, backgroundColor: '#121212' }}>
            <StatusBar barStyle="light-content" />
            <View style={{ width: '100%', justifyContent: "center", alignItems: "center", height: 50, marginVertical: 20 }}>
                <SegmentedControl
                    style={{ width: '85%', height: 40 }}
                    appearance="dark"
                    values={['Other Products', 'Amazon Orders']}
                    selectedIndex={selectedIndex}
                    onChange={async (event) => {
                        setSelectedIndex(event.nativeEvent.selectedSegmentIndex)
                        const amazonOrders = await AsyncStorage.getItem('amazonOrders')
                        if (amazonOrders === "" || amazonOrders === undefined || amazonOrders === null) {
                            await getAmazonOrders(store.googleCredentials)
                        } else {
                            store.saveAmazonOrders(JSON.parse(amazonOrders!))
                        }
                    }}
                />
            </View>

            {
                selectedIndex === 0 ?
                    fetchingOrders ?
                        <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#fff" />
                        </View> :
                        store.orders.length > 0 ?
                            <FlatList

                                // ListHeaderComponent={<Button title="notify me" onPress={callNotification} />}
                                showsVerticalScrollIndicator={false}
                                style={{ backgroundColor: '#121212' }}
                                contentContainerStyle={{
                                    justifyContent: 'center'
                                }}
                                keyExtractor={item => item.EstimatedDeliveryTime}
                                data={store.orders.slice().reverse()}
                                renderItem={renderOrderItem}
                                refreshing={store.settings.allow_fetching_new_orders ? refreshing : false}
                                onRefresh={() => {
                                    store.settings.allow_fetching_new_orders && onRefresh()
                                }
                                }
                            /> :
                            <ScrollView
                                contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                                style={{ flex: 1, backgroundColor: '#121212' }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                    />}
                            >
                                <Text style={{ color: "#fff" }}>Kaalo Badal chaaye ko jasto :3</Text>
                            </ScrollView>
                    :
                    fetchingOrders ?
                        <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#fff" />
                        </View> :
                        store.amazonOrders.length > 0 ?
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                style={{ backgroundColor: '#121212' }}
                                contentContainerStyle={{
                                    justifyContent: 'center'
                                }}
                                keyExtractor={item => item.EstimatedDeliveryTime}
                                data={store.amazonOrders.slice().reverse()}
                                renderItem={renderAmazonOrderItem}
                                refreshing={store.settings.allow_fetching_new_orders ? refreshing : false}
                                onRefresh={() => {
                                    store.settings.allow_fetching_new_orders && onRefresh()
                                }
                                }
                            /> :
                            <ScrollView
                                contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                                style={{ flex: 1, backgroundColor: '#121212' }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                    />}
                            >
                                <Text style={{ color: "#fff" }}>Kaalo Badal chaaye ko jasto :3</Text>
                            </ScrollView>

            }
        </View>
    )
})

export default HomeScreen