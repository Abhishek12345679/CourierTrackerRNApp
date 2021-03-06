import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { View, Text, Linking, StatusBar, ScrollView, Image, Pressable, TouchableOpacity, Platform, ActivityIndicator, ToastAndroid } from 'react-native'
import { sensitiveData } from '../../../constants/sen_data'
import { AmazonOrder, NotificationInfo } from '../../../constants/Types/OrderTypes'
import Delivered from '../../components/Delivered'
import { callReminder, removeNotificationIdLocally } from '../../helpers/notificationHelpers'
import store from '../../store/store'
import { copyToClipboard } from './OrderDetailsScreen'

const AmazonOrderDetailsScreen: React.FC = ({ route, navigation }: any) => {
    const item = route.params.item as AmazonOrder
    const [deliveryStatus, setDeliveryStatus] = useState(false)
    const [loading, setLoading] = useState(false)

    const [reminder, setReminder] = useState(item.callReminder)


    useEffect(() => {
        const checkAmazonDeliveryStatus = async () => {
            setLoading(true)
            const statusResponse = await fetch(`${sensitiveData.baseUrl}/checkAmazonDeliveryStatus?tokens=${JSON.stringify(store.googleCredentials)}&newer_than=${store.settings.orders_newer_than}`)
            const delStat = await statusResponse.json()
            console.log(delStat.deliveredOrders)

            delStat.deliveredOrders.map((orderNumber: string) => {
                if (orderNumber === item.orderNumber)
                    setDeliveryStatus(true)
            })
            setLoading(false)
        }
        checkAmazonDeliveryStatus()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" backgroundColor="#121212" />
            <ScrollView style={{ flex: 1, backgroundColor: "#121212" }} contentContainerStyle={{ justifyContent: 'center', alignItems: "center" }}>
                <View style={{ width: '95%', height: 400, position: "relative", marginTop: 10 }}>
                    <View style={{ backgroundColor: '#000', opacity: 0.5, width: '100%', height: 400, position: 'absolute', borderRadius: 20 }}></View>
                    <View style={{ position: 'absolute', bottom: 0, flexDirection: 'row', marginBottom: 10, width: '100%', justifyContent: "space-between", alignItems: 'flex-end', paddingEnd: 10 }}>
                        <Text style={{ color: "#fff", fontSize: 25, fontFamily: 'segoe-bold', width: '80%', paddingHorizontal: 20 }}>{item.orderContent}</Text>
                        {!loading ? <Delivered bgColor="#fff" textColor="#000" status={deliveryStatus} width="20%" /> : <ActivityIndicator size="small" color="#fff" />}
                    </View>
                    <Pressable
                        style={{ width: 50, height: 50, backgroundColor: '#ccc', position: 'absolute', marginTop: 10, marginStart: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
                        onPress={() => navigation.goBack()}
                        android_ripple={{ color: "#fff", borderless: false }}

                    >
                        <Ionicons name="arrow-back" size={24} color="#000" style={{ transform: [{ rotate: '-90deg' }] }} />
                    </Pressable>
                </View>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: "space-between", padding: 20, alignItems: 'center' }}>
                    <View>
                        <Text style={{ color: "#fff", marginStart: 5, fontFamily: 'gotham-black', fontSize: 13 }}>Order Number</Text>
                        <Text style={{ color: "#fff", marginStart: 5, fontSize: 22, }}>{item.orderNumber}</Text>
                    </View>
                    <TouchableOpacity onPress={() => { copyToClipboard(item.orderNumber) }} style={{ height: 30, width: 30, justifyContent: "center", alignItems: "center", backgroundColor: "#eaf0f0", borderRadius: 15 }}>
                        <Ionicons name="copy" size={22} color="#000" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity disabled={item.orderPreviewLink === ""} onPress={() => Linking.openURL(item.orderPreviewLink)} style={{ flexDirection: 'row', width: '90%', justifyContent: "space-between", padding: 20, alignItems: 'center', backgroundColor: "#222121", borderRadius: 10, marginBottom: 20 }}>
                    <Text style={{ color: "#fff", marginStart: 5, fontSize: 17, fontFamily: 'gotham-bold' }}>{item.orderPreviewLink === "" ? "Link not available" : "Go to the Product/Order"}</Text>
                    {item.orderPreviewLink === "" ? <FontAwesome name="unlink" size={24} color="#fff" /> : <Feather name="link" size={24} color="#fff" />}
                </TouchableOpacity>

                <View style={{ width: '90%', backgroundColor: "#222121", borderRadius: 10 }}>
                    <View style={{ paddingTop: 20, paddingLeft: 20 }}>
                        <Text style={{ color: "#fff", marginStart: 5, fontFamily: 'gotham-black', fontSize: 13 }}>Seller Name</Text>
                        <Text style={{ color: "#fff", marginStart: 5, fontSize: 22, }}>{"NA"}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 20, alignItems: 'center' }}>
                        <View>
                            <Text style={{ color: "#fff", marginStart: 5, fontFamily: 'gotham-black', fontSize: 13 }}>Arriving by</Text>
                            <Text style={{ color: "#fff", marginStart: 5, fontSize: 22, }}>{item.ETA}</Text>
                        </View>
                        <View>
                            <Text style={{ color: "#fff", marginStart: 5, fontFamily: 'gotham-black', fontSize: 13 }}> Price</Text>
                            <View>
                                <Text style={{ marginStart: 5, fontSize: 22, color: '#fff' }}>{(item.totalPrice)}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ width: "100%", justifyContent: "center", alignItems: 'center', marginTop: 20, marginBottom: 20, height: 135 }}>
                    <View style={{ borderRadius: 10, overflow: 'hidden', backgroundColor: "#202020ed", width: "92%", height: 125 }}>
                        <View style={{ width: '100%', justifyContent: "space-between", padding: 20 }}>
                            <Text style={{ color: "#fff", marginStart: 5, fontSize: 15, fontFamily: Platform.OS === "ios" ? "segoe-normal" : 'gotham-normal', }}>Delivery Address</Text>
                            <Text style={{ color: "#fff", marginStart: 5, fontFamily: 'segoe-bold', fontSize: 15, marginTop: 20, lineHeight: 20 }}>{(item.delivery_address as string).split(", ").join("\n")}</Text>
                        </View>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', width: '90%', justifyContent: "space-between", padding: 20, alignItems: 'center', backgroundColor: "#222121", borderRadius: 10, marginBottom: 20 }}>
                    <Image source={require('../../Assets/BrandLogos/amazon.png')} style={{ height: 25, width: 25, marginEnd: 20 }} />
                    <Text style={{ color: "#fff", marginStart: 5, fontSize: 17, fontFamily: 'gotham-bold' }}>This Order has been scraped from Amazon</Text>
                </View>

            </ScrollView>
            <Pressable
                android_ripple={{ color: '#fff', borderless: false }}
                style={{ flexDirection: 'row', width: '100%', backgroundColor: "#000", height: 70, marginEnd: 30, elevation: 100, borderRadius: 0, alignItems: 'center', justifyContent: "center" }}
                onPress={async () => {
                    if (new Date(item.ETA).getTime() <= new Date().getTime()) {
                        ToastAndroid.showWithGravityAndOffset("Reminders cannot be set on orders older than current date", 2000, ToastAndroid.TOP, 0, 200)
                        return
                    }
                    if (!item.callReminder) {
                        const notificationInfo: NotificationInfo = {
                            orderId: item.orderId,
                            notificationId: Math.trunc(Math.random() * 1000000)
                        }
                        await store.toggleAmazonCallReminder(item.orderId, item.ETA, true)
                        callReminder('', notificationInfo, item.orderNumber, item.ETA, 'amazon');
                        setReminder(true)
                    } else {
                        await store.toggleAmazonCallReminder(item.orderId, item.ETA, false)
                        await removeNotificationIdLocally(item.orderId) //cancel notification
                        setReminder(false)
                    }
                }}>

                {
                    !reminder ?
                        <View style={{ flexDirection: 'row', width: '100%', height: 70, elevation: 100, borderRadius: 0, alignItems: 'center', justifyContent: "center" }}>
                            <MaterialCommunityIcons name="bell-ring" size={24} color="#fff" style={{ marginEnd: 10 }} />
                            <Text style={{ fontFamily: 'segoe-bold', fontSize: 15, color: '#fff' }}>Add to Calendar</Text>
                        </View> :
                        <View style={{ flexDirection: 'row', width: '100%', height: 70, elevation: 100, borderRadius: 0, alignItems: 'center', justifyContent: "center" }}>
                            <Text style={{ fontFamily: 'segoe-bold', fontSize: 15, color: '#fff' }}>Added to Calendar</Text>
                        </View>
                }
            </Pressable>
        </View >
    )
}

export default AmazonOrderDetailsScreen
