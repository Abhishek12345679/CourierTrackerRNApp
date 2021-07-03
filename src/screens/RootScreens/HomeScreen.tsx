import React, { useEffect, useState, useCallback } from 'react'
import { View, FlatList, ListRenderItem, TouchableOpacity, ActivityIndicator, Text, RefreshControl, Platform, Image, StatusBar, InteractionManager } from 'react-native'
import store, { Credentials, userInfoType } from '../../store/store';
import { sensitiveData } from '../../../constants/sen_data';
import { observer } from 'mobx-react';
import GoogleSignInCard from '../../components/GoogleSignInCard';
import { Order, AmazonOrder, OrderList as OrderListType, AmazonOrderList as AmazonOrderListType } from '../../../constants/Types/OrderTypes';
import OrderList from '../../components/OrderList';
import { Avatar, Incubator } from 'react-native-ui-lib';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Modal, Card, Button, Datepicker, } from '@ui-kitten/components'
import { HeaderTitle } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { TextField } = Incubator
import database from '@react-native-firebase/database';
import { useFocusEffect } from '@react-navigation/native';

import SegmentedControl from '@react-native-segmented-control/segmented-control';
import AmazonOrderList from '../../components/AmazonOrderList'

const HomeScreen: React.FC = observer((props: any) => {

    const [searchText, setSearchText] = useState('')
    const [gmailAccessStatus, setGmailAccessStatus] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [fetchingOrders, setFetchingOrders] = useState(false)

    const [visible, setVisible] = useState(false)
    const [date, setDate] = useState(new Date());
    const [selectedIndex, setSelectedIndex] = useState(0)

    const isAndroid = (Platform.OS === "android")
    const [pfp, setPfp] = useState(store.userInfo.profilePicture)
    const [name, setName] = useState(store.userInfo.name)
    const [refreshing, setRefreshing] = useState<boolean>(false);


    // const [fromScreen, setFromScreen] = useState(props.route.params.from)

    useEffect(() => {
        fetchUserInfo()
        console.log("user info called")
    }, [store.userInfo])

    const onRefresh = React.useCallback(() => {
        console.log("refreshing...")
        setRefreshing(true);

        getOrders().then(() => {
            setRefreshing(false)
        })
    }, [store.settings]);

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

    const fetchUserInfo = async () => {
        const userInfo = await store.fetchUserInfo()
        if (userInfo !== undefined) {
            setPfp(userInfo.profilePicture)
            setName(userInfo.name)
        }
    }

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
        setFetchingOrders(true)

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
        setFetchingOrders(false)

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

    const renderOrderItem: ListRenderItem<OrderListType> = ({ item, index, separators }) => (
        <OrderList
            item={item}
            index={index}
            separators={separators}
            openCalendarDialog={() => { setVisible(true) }}
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
                        style={{ width: 30, height: 30, borderRadius: 20, backgroundColor: '#d8d6d6', justifyContent: 'center', alignItems: 'center', marginEnd: 20 }}
                        onPress={() => {

                            props.navigation.navigate('AddOrder')
                        }}>
                        {/* <Text>Add</Text> */}
                        <MaterialIcons name="add" size={24} />
                    </TouchableOpacity>}
                    <TouchableOpacity style={{ marginEnd: 20 }} onPress={() => props.navigation.navigate('Settings')}>
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
                        <View style={{ flexDirection: 'column' }}>
                            <HeaderTitle tintColor="#d6d3d3" style={{ fontFamily: "gotham-black", fontSize: 30, color: "#8abedf" }}>Order</HeaderTitle>
                            <HeaderTitle tintColor="#d6d3d3" style={{ fontFamily: "gotham-black", fontSize: 30, color: "#ec5a3c" }}>Gator</HeaderTitle>
                        </View>
                    }
                </View>
            ),
        })
    }, [store.userInfo, name, pfp]);

    // run when someone signs in to google 
    // useFocusEffect(
    //     useCallback(() => {
    //         if (fromScreen === "AuthUrlScreen") {
    //             const onStart = async () => {
    //                 console.log("signed in to google!!")
    //                 if (store.googleCredentials.refresh_token !== "") {
    //                     setGmailAccessStatus(true)
    //                     await fetchUserInfo()
    //                     const ordersInAsyncStorage = await AsyncStorage.getItem('orders')
    //                     if (ordersInAsyncStorage === "" || ordersInAsyncStorage === undefined || ordersInAsyncStorage === null) {
    //                         getOrders()
    //                     } else {
    //                         store.saveOrders(JSON.parse(ordersInAsyncStorage!))
    //                     }
    //                 } else {
    //                     setGmailAccessStatus(false)
    //                 }
    //                 setFromScreen("")
    //             }
    //             onStart()
    //         }
    //         else if (fromScreen === "AddOrderScreen") {
    //             console.log("from:", fromScreen)
    //             // const onNewItemsAdded = database()
    //             //     .ref(`/users/${store.loginCredentials.uid}/orders`)
    //             //     .on('value', (_snapshot) => {
    //             //         console.log("testtest")
    //             //         getOrders()
    //             //     })
    //             // return () => database().ref(`/users/${store.loginCredentials.uid}/orders`).off('value', onNewItemsAdded);
    //         }
    //     }, [fromScreen])
    // );

    if (store.orders.length === 0)
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

    return (
        <View style={{ flex: 1, backgroundColor: '#121212' }}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <View style={{ width: '100%', justifyContent: "center", alignItems: "center", height: 50, marginVertical: 15 }}>
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

            {!fetchingOrders ? selectedIndex === 0 ?
                <FlatList
                    // ListHeaderComponent={<Text style={{ color: "#fff", fontSize: 40, fontFamily: 'gotham-black', padding: 15 }}>Orders</Text>}
                    showsVerticalScrollIndicator={false}
                    style={{ backgroundColor: '#121212' }}
                    contentContainerStyle={{
                        justifyContent: 'center'
                    }}
                    keyExtractor={item => item.EstimatedDeliveryTime}
                    data={store.orders}
                    renderItem={renderOrderItem}
                    refreshing={store.settings.allow_fetching_new_orders ? refreshing : false}
                    onRefresh={() => {
                        store.settings.allow_fetching_new_orders && onRefresh()
                    }
                    }
                /> :
                <FlatList
                    // ListHeaderComponent={<Text style={{ color: "#fff", fontSize: 40, fontFamily: 'gotham-black', padding: 15 }}>Orders</Text>}
                    showsVerticalScrollIndicator={false}
                    style={{ backgroundColor: '#121212' }}
                    contentContainerStyle={{
                        justifyContent: 'center'
                    }}
                    keyExtractor={item => item.EstimatedDeliveryTime}
                    data={store.amazonOrders}
                    renderItem={renderAmazonOrderItem}
                    refreshing={store.settings.allow_fetching_new_orders ? refreshing : false}
                    onRefresh={() => {
                        store.settings.allow_fetching_new_orders && onRefresh()
                    }
                    }
                /> :
                <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            }
            {/* <Modal
                visible={visible}
                backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', }}
                onBackdropPress={() => setVisible(false)}>
                <Card disabled={true} style={{}}>
                    <Text style={{ fontFamily: 'segoe-bold', fontSize: 20 }}>Add this event to the calendar</Text>
                    <Datepicker

                        date={date}
                        onSelect={nextDate => setDate(nextDate)}
                    />
                    <Button style={{ backgroundColor: "#000" }} onPress={() => setVisible(false)}>
                        Submit
                    </Button>
                </Card>
            </Modal> */}
        </View>
    )
})

export default HomeScreen