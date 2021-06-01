import { Ionicons } from '@expo/vector-icons'
import { HeaderBackButton } from '@react-navigation/stack'
import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { View, Text, ScrollView, Pressable } from 'react-native'
import Image from 'react-native-ui-lib/image'
import { Order } from '../../../constants/Types/OrderTypes'
import { createCalendar } from '../../components/OrderItem'
import * as Calendar from 'expo-calendar'
import store from '../../store/store'

const OrderDetailsScreen = observer((props: any) => {
    const { item } = props.route.params
    useEffect(() => {
        props.navigation.setOptions({
            title: item.productName
        })
    }, []);

    const addEventToCalendar = async () => {
        const id = await createCalendar()
        // console.log("id: ", id)
        const event = await Calendar.createEventAsync(id, {
            title: item.productName,
            startDate: new Date(item.ETA),
            endDate: new Date(item.ETA)
        })
        store.setCalendarEventId(event, item.orderId, Date.parse(item.ETA).toString())
        // console.log(event)
        // Calendar.openEventInCalendar(event)
    }


    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={{ width: '100%', height: 400, position: "relative" }}>
                <Image
                    source={{ uri: item.productImage }}
                    style={{ width: '100%', height: 400, resizeMode: 'cover', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginTop: 0, }}
                />

                <View style={{ backgroundColor: '#000', opacity: 0.5, width: '100%', height: 400, position: 'absolute' }}></View>
                <Text style={{ color: "#fff", position: 'absolute', bottom: 0, fontSize: 30, fontFamily: 'segoe-bold', marginBottom: 10, marginStart: 10 }}>{item.productName}</Text>
            </View>
            <Pressable
                style={{ width: 50, height: 50, backgroundColor: '#ccc', position: 'absolute', marginTop: 10, marginStart: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
                onPress={() => props.navigation.goBack()}
                android_ripple={{ color: "#fff", radius: 25, }}

            >
                <Ionicons name="arrow-back" size={24} color="#000" />
            </Pressable>
            <View style={{ flexDirection: 'row', marginTop: 20, width: '100%', justifyContent: "space-between", paddingHorizontal: 10 }}>
                <View>
                    <Text style={{ color: "#fff", marginStart: 5, fontFamily: 'segoe-bold' }}>Order Number</Text>
                    <Text style={{ color: "#fff", marginStart: 5 }}>{item.orderNumber.slice(15)}...</Text>
                </View>
                <View>
                    <Text style={{ color: "#fff", marginStart: 10, fontFamily: 'segoe-bold' }}>Seller</Text>
                    <Text style={{ color: "#fff", marginStart: 10, width: 100 }}>{item.sellerName}</Text>
                </View>
                <View>
                    <Text style={{ color: "#fff", marginStart: 10, fontFamily: 'segoe-bold' }}>Arriving by</Text>
                    <Text style={{ color: "#fff", marginStart: 10 }}>{item.ETA}</Text>
                </View>
            </View>
            <View style={{ width: '100%', marginTop: 40, height: 100, paddingHorizontal: 10 }}>
                <View style={{ width: '100%', backgroundColor: '#fff', height: 100, borderRadius: 20, justifyContent: "space-between", flexDirection: 'row', alignItems: "center", paddingStart: 10 }}>
                    <View>
                        <Text style={{ color: "#000", marginStart: 10, fontFamily: 'segoe-normal', fontSize: 20 }}>Price</Text>
                        <Text style={{ color: "#000", marginStart: 10, fontFamily: 'segoe-bold', fontSize: 40 }}>₹{Math.trunc(parseInt(item.productPrice.trim())).toString()}</Text>
                    </View>
                    <Pressable android_ripple={{ color: '#fff', radius: 100, borderless: false }}
                        style={{ flexDirection: 'row', width: 200, height: 70, backgroundColor: "#000", marginEnd: 30, elevation: 100, borderRadius: 20, alignItems: 'center', justifyContent: "center", marginStart: 20 }}
                        onPress={addEventToCalendar}>
                        {item.calendarEventId.length === 0 ? <View style={{ flexDirection: 'row', width: 200, height: 70, backgroundColor: "#000", marginEnd: 30, elevation: 100, borderRadius: 20, alignItems: 'center', justifyContent: "center", marginStart: 20 }}>
                            <Image source={require('../../Assets/Icons/siri.png')} style={{ width: 25, height: 25, marginEnd: 10 }} />
                            <Text style={{ fontFamily: 'segoe-bold', fontSize: 15, color: '#fff' }}>Add to Calendar</Text>
                        </View> :
                            <View>
                                <Text style={{ color: "#fff" }}>Added to Calendar</Text>
                            </View>
                        }
                    </Pressable>
                </View>
            </View>
            {/* <Text style={{ color: "#fff", marginStart: 30, fontFamily: 'segoe-bold', fontSize: 20, marginTop: 20 }}>Order Breakdown</Text> */}

            {/* <View style={{ justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                    <Text style={{ color: "#fff", marginStart: 10, fontFamily: 'segoe-bold' }}>Product Price</Text>
                    <Text style={{ color: '#fff' }}>{item.productPrice.slice(0, item.productPrice.indexOf('+')).trim()}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: "#fff", marginStart: 10, fontFamily: 'segoe-bold' }}>Delivery Charges</Text>
                    <Text style={{ color: '#fff' }}>-{item.deliveryCharges.trim()}</Text>
                </View>
                <View style={{ height: 1, width: '100%', backgroundColor: '#fff', marginVertical: 10 }}></View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                     <Text style={{ color: "#fff", marginStart: 10, fontFamily: 'segoe-bold' }}>Total Price</Text>
                    <Text style={{ color: '#fff' }}>{item.totalPrice.trim()}</Text>
                </View>
            </View> */}
            <View style={{ justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 20 }}>
                <Text style={{ color: "#fff", marginStart: 10, fontFamily: 'segoe-bold' }}>This Product was ordered by you on {item.from} </Text>
                <Image source={require(`../../Assets/BrandLogos/flipkart.png`)} style={{ width: 100, height: 100 }} />
            </View>
        </ScrollView>
    )
})

export default OrderDetailsScreen
