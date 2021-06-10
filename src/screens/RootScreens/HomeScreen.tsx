import React, { useEffect, useState } from 'react'
import { View, FlatList, ListRenderItem, TouchableOpacity, ActivityIndicator, Text, RefreshControl, Platform, Image, StatusBar } from 'react-native'

import store, { Credentials, userInfoType } from '../../store/store';
import { sensitiveData } from '../../../constants/sen_data';
import { observer } from 'mobx-react';
import GoogleSignInCard from '../../components/GoogleSignInCard';
import { Order, AmazonOrder, OrderList as OrderListType } from '../../../constants/Types/OrderTypes';
import OrderList from '../../components/OrderList';
import { Avatar, Incubator } from 'react-native-ui-lib';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import { Modal, Card, Button, Datepicker } from '@ui-kitten/components'
import { HeaderTitle } from '@react-navigation/stack';

const { TextField } = Incubator

// import { useFocusEffect } from '@react-navigation/native';


const HomeScreen: React.FC = observer((props: any) => {

    // TODO: add loading spinner while the orders are being fetched
    // useFocusEffect(
    //     React.useCallback(() => {
    //         if (store.googleCredentials.refresh_token !== "") {
    //             console.log("logged in via google")
    //             // console.log("google Creds: ",store.googleCredentials)
    //             setGmailAccessStatus(true)
    //             getOrders()
    //         }
    //         //   return () => unsubscribe();
    //     }, [store.googleCredentials])
    // );

    useEffect(() => {
        if (store.googleCredentials.refresh_token !== "") {
            console.log("logged in via google")
            // console.log("google Creds: ",store.googleCredentials)
            setGmailAccessStatus(true)
            getOrders()
        }
    }, [])

    useEffect(() => { fetchUserInfo() }, [store.userInfo,])

    console.log(store.googleCredentials)
    const [orders, setOrders] = useState<OrderListType[]>([])
    const [gmailAccessStatus, setGmailAccessStatus] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [fetchingOrders, setFetchingOrders] = useState(false)

    const [visible, setVisible] = useState(false)
    const [date, setDate] = useState(new Date());

    const isAndroid = (Platform.OS === "android")
    const [pfp, setPfp] = useState(store.userInfo.profilePicture)
    const [name, setName] = useState(store.userInfo.name)


    const [refreshing, setRefreshing] = useState<boolean>(false);

    const onRefresh = React.useCallback(() => {
        // setRefreshing(true);
        // getOrders().then(() => {
        //     setRefreshing(false)
        // })

    }, []);




    const getAmazonOrders = async (auth: Credentials) => {
        const AZResponse = await fetch(`${sensitiveData.baseUrl}/getAmazonOrderDetails?tokens=${JSON.stringify(auth)}`)
        const AmazonOrders = await AZResponse.json()
    }

    const getFlipkartOrders = async (auth: Credentials) => {
        const FKResponse = await fetch(`${sensitiveData.baseUrl}/getFlipkartOrderDetails?tokens=${JSON.stringify(auth)}`)
        const FlipkartOrders = await FKResponse.json()
        return FlipkartOrders.flipkartOrders
    }
    const getMyntraOrders = async (auth: Credentials) => {
        const MResponse = await fetch(`${sensitiveData.baseUrl}/getMyntraOrderDetails?tokens=${JSON.stringify(auth)}`)
        const MyntraOrders = await MResponse.json()
        return MyntraOrders.myntraOrders
    }

    const getAjioOrders = async (auth: Credentials) => {
        const AResponse = await fetch(`${sensitiveData.baseUrl}/getAjioOrderDetails?tokens=${JSON.stringify(auth)}`)
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

    const getOrders = async () => {


        const flipkartOrders = await getFlipkartOrders(store.googleCredentials)
        const myntraOrders = await getMyntraOrders(store.googleCredentials)
        const ajioOrders = await getAjioOrders(store.googleCredentials)
        const groupedOrders = groupOrders(flipkartOrders, myntraOrders, ajioOrders)
        const sortedOrders = sortOrders(groupedOrders)

        // setOrders(sortedOrders)
        store.saveOrders(sortedOrders)
        setFetchingOrders(false)

        console.log("sorted orders: ", JSON.stringify(store.orders, null, 4))
    }


    const sortOrders = (groupedOrders: OrderListType[]) => {
        groupedOrders.sort((a: OrderListType, b: OrderListType) => {
            return parseInt(a.EstimatedDeliveryTime) - parseInt(b.EstimatedDeliveryTime)
        })
        return groupedOrders
    }


    const groupOrders = (flipkartOrders: Order[], myntraOrders: Order[], ajioOrders: Order[]) => {
        const superArray: Order[] = [...flipkartOrders, ...myntraOrders, ...ajioOrders]
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



    const renderOrderItem: ListRenderItem<OrderListType> = ({ item, index, separators }) => (
        <OrderList
            item={item}
            index={index}
            separators={separators}
            openCalendarDialog={() => { setVisible(true) }}
        // navigation={props.navigation}
        />
    )

    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                    {isAndroid && <TouchableOpacity
                        style={{ width: 30, height: 30, borderRadius: 20, backgroundColor: '#d8d6d6', justifyContent: 'center', alignItems: 'center', marginEnd: 20 }}
                        onPress={() => props.navigation.navigate('AddOrder')}>
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
                    </TouchableOpacity> : <HeaderTitle tintColor="#d6d3d3" style={{ fontFamily: "gotham-black", fontSize: 35 }}>AIO</HeaderTitle>}
                </View>
            ),
        })
    }, [store.userInfo, name, pfp]);

    // if (store.orders.length === 0)
    //     return (
    //         <View style={{ flex: 1, backgroundColor: '#090c08', justifyContent: 'center', alignItems: 'center' }}>
    //             {/* <ActivityIndicator size="large" color="#fff" /> */}
    //             <Text style={{ color: "#fff" }}>No Orders</Text>
    //         </View>
    //     )


    return (
        <View style={{ flex: 1, backgroundColor: '#121212' }}>
            <StatusBar barStyle="light-content" />
            <View style={{ flexDirection: 'row', height: 60, justifyContent: 'space-between', alignItems: 'center', width: '95%', marginVertical: 20, backgroundColor: '#121212' }}>
                <TextField
                    style={{ fontSize: 17, fontFamily: 'segoe-normal', width: '100%', color: "#fff" }}
                    containerStyle={{
                        height: 45,
                        justifyContent: "center",
                        borderRadius: 10,
                        width: '75%',
                        backgroundColor: "#faf4f45c",
                        marginStart: 25,
                        elevation: 1
                    }}
                    fieldStyle={{ marginHorizontal: 20 }}
                    placeholderTextColor="#aaa"
                    placeholder="Type something..."

                    value={""}
                    onChangeText={() => { }}
                />
                <TouchableOpacity
                    style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#e2e2e2', justifyContent: 'center', alignItems: 'center', marginEnd: 20 }}
                    onPress={() => { }}>
                    <MaterialIcons name="search" size={24} />
                </TouchableOpacity>
            </View>
            {
                !gmailAccessStatus && (<View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}><GoogleSignInCard onPress={getGoogleAccess} loading={isLoading} /></View>)
            }
            {store.orders.length > 0 ?
                <FlatList
                    showsVerticalScrollIndicator={false}
                    style={{ backgroundColor: '#121212' }}
                    contentContainerStyle={{ justifyContent: 'center', paddingBottom: 70 }}
                    keyExtractor={item => item.EstimatedDeliveryTime}
                    data={store.orders}
                    renderItem={renderOrderItem}
                    refreshing={refreshing}
                    onRefresh={() => { onRefresh }
                    }
                /> :
                <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
                    {/* <ActivityIndicator size="large" color="#fff" /> */}
                    <Text style={{ color: "#888787", fontFamily: 'gotham-black', fontSize: 20 }}>No Orders</Text>
                </View>
            }
            <Modal
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
            </Modal>
        </View>
    )
})

export default HomeScreen