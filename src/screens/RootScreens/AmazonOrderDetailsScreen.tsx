import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { View, Text, Linking, StatusBar, ScrollView, Image, Pressable, TouchableOpacity } from 'react-native'
import { sensitiveData } from '../../../constants/sen_data'
import Delivered from '../../components/Delivered'
import store from '../../store/store'
import { copyToClipboard } from './OrderDetailsScreen'

const AmazonOrderDetailsScreen: React.FC = ({ route, navigation }) => {
    const item = route.params.item
    console.log(item)

    const [deliveryStatus, setDeliveryStatus] = useState(false)

    useEffect(() => {
        const checkAmazonDeliveryStatus = async () => {
            const statusResponse = await fetch(`${sensitiveData.baseUrl}/checkAmazonDeliveryStatus?tokens=${JSON.stringify(store.googleCredentials)}&newer_than=${store.settings.orders_newer_than}`)
            const delStat = await statusResponse.json()
            // console.log(delStat.deliveredOrders)

            delStat.deliveredOrders.map((orderNumber: string) => {
                if (orderNumber === item.orderNumber)
                    setDeliveryStatus(true)
            })
        }
        checkAmazonDeliveryStatus()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" backgroundColor="#121212" />
            <ScrollView style={{ flex: 1, backgroundColor: "#121212" }} contentContainerStyle={{ justifyContent: 'center', alignItems: "center" }}>
                <View style={{ width: '95%', height: 400, position: "relative", marginTop: 10 }}>
                    <Image
                        source={{ uri: "https://image.shutterstock.com/image-photo/businessman-holding-paper-say-no-260nw-105617738.jpg" }}
                        style={{ width: '100%', height: 400, resizeMode: 'cover', borderRadius: 20, marginTop: 0, backgroundColor: '#000' }}
                    />

                    <View style={{ backgroundColor: '#000', opacity: 0.5, width: '100%', height: 400, position: 'absolute', borderRadius: 20 }}></View>
                    <View style={{ position: 'absolute', bottom: 0, flexDirection: 'row', marginBottom: 10, width: '100%', justifyContent: "space-between", alignItems: 'flex-end', paddingEnd: 10 }}>
                        <Text style={{ color: "#fff", fontSize: 25, fontFamily: 'gotham-bold', width: '80%', paddingHorizontal: 20 }}>{item.orderNumber}</Text>
                        <Delivered bgColor="#000" status={deliveryStatus} width="20%" />
                    </View>
                    <Pressable
                        style={{ width: 50, height: 50, backgroundColor: '#ccc', position: 'absolute', marginTop: 10, marginStart: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
                        onPress={() => navigation.goBack()}
                        android_ripple={{ color: "#fff", radius: 25, }}

                    >
                        <Ionicons name="arrow-back" size={24} color="#000" style={{ transform: [{ rotate: '-90deg' }] }} />
                    </Pressable>
                </View>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: "space-between", padding: 20, alignItems: 'center' }}>
                    <View>
                        <Text style={{ color: "#fff", marginStart: 5, fontFamily: 'gotham-block', fontSize: 13 }}>Order Number</Text>
                        <Text style={{ color: "#fff", marginStart: 5, fontSize: 22, fontFamily: "gotham-bold" }}>{item.orderNumber}</Text>
                    </View>
                    <TouchableOpacity onPress={() => { copyToClipboard(item.orderNumber) }} style={{ height: 30, width: 30, justifyContent: "center", alignItems: "center", backgroundColor: "#eaf0f0", borderRadius: 15 }}>
                        <Ionicons name="copy" size={22} color="#000" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity disabled={item.productLink === ""} onPress={() => Linking.openURL(item.orderPreviewLink)} style={{ flexDirection: 'row', width: '90%', justifyContent: "space-between", padding: 20, alignItems: 'center', backgroundColor: "#222121", borderRadius: 10, marginBottom: 20 }}>
                    <Text style={{ color: "#fff", marginStart: 5, fontSize: 17, fontFamily: "gotham-bold" }}>{item.productLink === "" ? "Link not available" : "Go to the Product/Order"}</Text>
                    {item.productLink === "" ? <FontAwesome name="unlink" size={24} color="#fff" /> : <Feather name="link" size={24} color="#fff" />}
                </TouchableOpacity>

                <View style={{ width: '90%', backgroundColor: "#222121", borderRadius: 10 }}>
                    <View style={{ paddingTop: 20, paddingLeft: 20 }}>
                        <Text style={{ color: "#fff", marginStart: 5, fontFamily: 'gotham-block', fontSize: 13 }}>Seller Name</Text>
                        <Text style={{ color: "#fff", marginStart: 5, fontSize: 22, fontFamily: "gotham-bold" }}>{item.sellerName ? item.sellerName : "NA"}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 20, alignItems: 'center' }}>
                        <View>
                            <Text style={{ color: "#fff", marginStart: 5, fontFamily: 'gotham-block', fontSize: 13 }}>Arriving by</Text>
                            <Text style={{ color: "#fff", marginStart: 5, fontSize: 22, fontFamily: "gotham-bold" }}>{item.ETA}</Text>
                        </View>
                        <View>
                            <Text style={{ color: "#fff", marginStart: 5, fontFamily: 'gotham-block', fontSize: 13 }}> Price</Text>
                            <View>
                                <Text style={{ marginStart: 5, fontSize: 22, fontFamily: "gotham-bold", color: '#fff' }}>{(item.totalPrice)}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ width: "100%", justifyContent: "center", alignItems: 'center', marginTop: 20, marginBottom: 20, height: 150 }}>
                    <View style={{ borderRadius: 10, overflow: 'hidden', backgroundColor: "#202020ed", width: "92%", height: 150 }}>
                        <View style={{ width: '100%', justifyContent: "space-between", padding: 20 }}>
                            <Text style={{ color: "#fff", marginStart: 5, fontSize: 15, fontFamily: "gotham-normal" }}>Delivery Address</Text>
                            <Text style={{ color: "#fff", marginStart: 5, fontFamily: 'gotham-bold', fontSize: 15, marginTop: 20, lineHeight: 20 }}>{(item.delivery_address as string).split(", ").join("\n")}</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>
            <Pressable android_ripple={{ color: '#fff', radius: 100, borderless: false }}
                style={{ flexDirection: 'row', width: '100%', backgroundColor: "#000", height: 70, marginEnd: 30, elevation: 100, borderRadius: 0, alignItems: 'center', justifyContent: "center" }}
                onPress={
                    async () => {
                        await store.toggleAmazonCallReminder(item.orderId, item.ETA)
                    }
                }>

                {
                    !item.callReminder ?
                        <View style={{ flexDirection: 'row', width: '100%', height: 70, elevation: 100, borderRadius: 0, alignItems: 'center', justifyContent: "center" }}>
                            {/* <Image source={require('../../Assets/Icons/siri.png')} style={{ width: 25, height: 25, marginEnd: 10 }} /> */}
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
