import React, { useEffect, useState } from 'react'
import { View, FlatList, ListRenderItem, TouchableOpacity, ActivityIndicator, Text, RefreshControl } from 'react-native'

import store, { Credentials } from '../../store/store';
import { sensitiveData } from '../../../constants/sen_data';
import { observer } from 'mobx-react';
import GoogleSignInCard from '../../components/GoogleSignInCard';
import { Order, AmazonOrder, OrderList as OrderListType } from '../../../constants/Types/OrderTypes';
import OrderList from '../../components/OrderList';
import { Avatar, Incubator } from 'react-native-ui-lib';
import { Ionicons } from '@expo/vector-icons';

const { TextField } = Incubator

export const dateStringToMS = (dateString: string) => {
    // const month_long = ["January", "February", "March", "April", "May", "June", "July",
    //     "August", "September", "October", "November", "December"];
    const month_short = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const date = parseInt(dateString.substring(dateString.indexOf(',') + 2, dateString.indexOf('th')))

    const month = dateString.substring(dateString.indexOf('th') + 3, dateString.lastIndexOf(',')).trim()
    const month_index = month_short.findIndex((mon) => mon === month)

    const year = parseInt(dateString.substring(dateString.lastIndexOf(',') + 1))

    return new Date(year, month_index, date, 0, 0, 0, 0).getTime()
}

const HomeScreen: React.FC = observer((props: any) => {

    const [orders, setOrders] = useState<OrderListType[]>([])
    const [gmailAccessStatus, setGmailAccessStatus] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [refreshing, setRefreshing] = useState<boolean>(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getOrders().then(() => {
            setRefreshing(false)
        })

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

    const getOrders = async () => {

        const flipkartOrders = await getFlipkartOrders(store.googleCredentials)
        const myntraOrders = await getMyntraOrders(store.googleCredentials)
        const groupedOrders = groupOrders(flipkartOrders, myntraOrders)
        const sortedOrders = sortOrders(groupedOrders)

        // setOrders(sortedOrders)
        store.saveOrders(sortedOrders)
        console.log("sorted orders: ", JSON.stringify(store.orders, null, 4))
    }

    useEffect(() => {

        if (store.googleCredentials.refresh_token !== "") {
            console.log(store.googleCredentials)
            setGmailAccessStatus(true)
        }
        getOrders()
    }, [])


    const sortOrders = (groupedOrders: OrderListType[]) => {
        groupedOrders.sort((a: OrderListType, b: OrderListType) => {
            return parseInt(a.EstimatedDeliveryTime) - parseInt(b.EstimatedDeliveryTime)
        })
        return groupedOrders
    }


    const groupOrders = (flipkartOrders: Order[], myntraOrders: Order[]) => {
        const superArray: Order[] = [...flipkartOrders, ...myntraOrders]
        const groups = superArray.reduce((acc: any, order: Order) => {
            if (order.from === 'flipkart') {
                acc[Date.parse(order.ETA)] = acc[Date.parse(order.ETA)] ? acc[Date.parse(order.ETA)].concat(order) : [order]
            } else if (order.from === 'Myntra') {
                acc[dateStringToMS(order.ETA)] = acc[dateStringToMS(order.ETA)] ? acc[dateStringToMS(order.ETA)].concat(order) : [order]
            }
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
        // navigation={props.navigation}
        />
    )

    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (<TouchableOpacity style={{ marginEnd: 20 }} onPress={() => props.navigation.navigate('Settings')}
            >
                <Avatar
                    source={{ uri: "https://avatars.githubusercontent.com/u/24722640?v=4" }}
                    animate
                    imageStyle={{ borderColor: "#fff", borderWidth: 1 }} />
            </TouchableOpacity>)
        })
    }, []);

    if (store.orders.length === 0)
        return (
            <View style={{ flex: 1, backgroundColor: '#090c08', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        )


    return (
        <>
            {orders && <FlatList
                // stickyHeaderIndices={[0]}
                ListHeaderComponent={
                    !gmailAccessStatus ? <GoogleSignInCard onPress={getGoogleAccess} loading={isLoading} /> :
                        <View style={{ flexDirection: 'row', flex: 1, height: 60, justifyContent: 'space-between', alignItems: 'center', width: '95%', marginVertical: 20 }}>
                            <TextField
                                style={{ fontSize: 17, fontFamily: 'segoe-normal', width: '90%', color: "#fff" }}
                                containerStyle={{ height: 50, justifyContent: "center", borderRadius: 25, width: '85%', backgroundColor: "#fff" }}
                                fieldStyle={{ marginHorizontal: 20 }}
                                placeholderTextColor="#aaa"
                                placeholder="Type something..."

                                value={""}
                                onChangeText={() => { }}
                            />
                            <TouchableOpacity
                                style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => props.navigation.navigate('AddOrder')}>
                                <Ionicons size={30} name="md-add" />
                            </TouchableOpacity>
                        </View>
                }
                ListHeaderComponentStyle={{ justifyContent: 'center', alignItems: "center" }}
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, backgroundColor: '#090c08' }}
                contentContainerStyle={{ justifyContent: 'center' }}
                keyExtractor={item => item.EstimatedDeliveryTime}
                data={store.orders}
                renderItem={renderOrderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />}
        </>
    )
})

export default HomeScreen