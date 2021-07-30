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
import { getAmazonOrders, getOrders } from '../../helpers/ordersHelpers';
import { getSnapshot } from 'mobx-state-tree';

const HomeScreen: React.FC = observer((props: any) => {

    const [gmailAccessStatus, setGmailAccessStatus] = useState(props.route.params.gmailAccess)
    const [isLoading, setIsLoading] = useState(false)
    const [fetchingOrders, setFetchingOrders] = useState(false)

    const [visible, setVisible] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)

    const isAndroid = (Platform.OS === "android")
    const [pfp, setPfp] = useState(store.userInfo.profilePicture)
    const [name, setName] = useState(store.userInfo.name)
    const [refreshing, setRefreshing] = useState<boolean>(false);

    let fromScreen = props.route.params.from

    enum orderType {
        amazon = "amazon",
    }

    const fetchUserInfo = async () => {
        const userInfo = await store.fetchUserInfo()
        if (userInfo !== undefined) {
            setPfp(userInfo.profilePicture)
            setName(userInfo.name)
        }
    }

    const onRefresh = useCallback(() => {
        console.log("refreshing...")
        setFetchingOrders(true);
        getOrders().then(() => {
            setFetchingOrders(false)
        }).catch((err) => {
            setFetchingOrders(false)
        })
    }, []);

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

    useFocusEffect(
        useCallback(() => {
            const screen = store.reRenderScreen
            if (screen === "settings") {
                const loadOrders = async () => {
                    setFetchingOrders(true)
                    await getOrders()
                    setFetchingOrders(false)
                }
                loadOrders()
            } else if (screen === "addOrder") {
                const loadOrders = async () => {
                    setFetchingOrders(true)
                    await getOrders()
                    setFetchingOrders(false)
                }
                loadOrders()
            } else if (screen === "auth") {
                const loadOrders = async () => {
                    const googleCreds = await AsyncStorage.getItem('credentials')
                    if (googleCreds !== null) {
                        setGmailAccessStatus(true)
                        const ordersInAsyncStorage = await AsyncStorage.getItem('orders')
                        const amazonOrdersInAsyncStorage = await AsyncStorage.getItem('amazonOrders')
                        if (ordersInAsyncStorage === "" || ordersInAsyncStorage === undefined || ordersInAsyncStorage === null) {
                            await getOrders()
                            await fetchUserInfo()

                        } else {
                            await store.saveOrders(JSON.parse(ordersInAsyncStorage!))
                            await store.saveAmazonOrders(JSON.parse(amazonOrdersInAsyncStorage!))
                        }
                    }
                }
                loadOrders()
            } else {
                //...
            }
            store.updateReRenderScreen(null)
        }, [store.reRenderScreen])
    )


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

    if (store.orders.length === 0 && !gmailAccessStatus) {
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
    }

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
                                data={getSnapshot(store.orders).slice().reverse()}
                                renderItem={renderOrderItem}
                                refreshing={store.settings.allow_fetching_new_orders ? fetchingOrders : false}
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
                                        refreshing={fetchingOrders}
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
                                data={getSnapshot(store.amazonOrders).slice().reverse()}
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
                                        refreshing={fetchingOrders}
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