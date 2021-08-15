import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable, StatusBar, TouchableOpacity, Linking, ToastAndroid, Platform } from 'react-native'
import Image from 'react-native-ui-lib/image'
import store from '../../store/store'
// import { sensitiveData } from '../../../constants/sen_data'

import ImageColors from 'react-native-image-colors'
import Clipboard from '@react-native-clipboard/clipboard';
import { Feather } from '@expo/vector-icons'
// import Delivered from '../../components/Delivered'
import { callReminder, removeNotificationIdLocally } from '../../helpers/notificationHelpers'
import { NotificationInfo } from '../../../constants/Types/OrderTypes'


export const copyToClipboard = (orderNumber: string) => {
    Clipboard.setString(orderNumber);
    ToastAndroid.showWithGravity(
        `Copied Order Number\n${orderNumber}`,
        ToastAndroid.SHORT,
        ToastAndroid.TOP
    );
};

const OrderDetailsScreen = observer((props: any) => {

    const { item } = props.route.params
    const [primaryColor, setPrimaryColor] = useState('')
    const [reminder, setReminder] = useState(item.callReminder)

    // const [deliveryStatus, setDeliveryStatus] = useState(false)

    const extraData = [
        { label: 'Delivery Charges', data: item.deliveryCharges ? item.deliveryCharges : "NA" },
        { label: 'Delivery Discount', data: item.deliveryDiscount ? item.deliveryDiscount : "NA" },
        { label: 'Total Amount \n(Total Price of the Order)', data: item.totalPrice },
    ]



    const formatPrice = (price: string | number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(parseInt(price.toString()))

    }


    const extractColorsFromImage = async () => {

        const colors = await ImageColors.getColors(item.productImage, {
            fallback: '#121212',
            cache: false,
            key: 'unique_key',
        })

        if (colors.platform === 'android') {
            setPrimaryColor(colors.darkMuted!)
            console.log(colors.darkMuted!)
        } else {
            setPrimaryColor(colors.secondary!)
            console.log(colors)
        }
    }



    // const checkFlipkartDeliveryStatus = async (productName: string) => {
    //     try {

    //         const statusResponse = await fetch(`${sensitiveData.baseUrl}/checkFlipkartDeliveryStatus`, {
    //             method: "POST",
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ tokens: store.googleCredentials, productName: productName })
    //         })
    //         const delStat = await statusResponse.json()
    //         console.log(delStat)
    //         setDeliveryStatus(delStat)
    //     } catch (err) {
    //         console.error("error[checkFlipkartDeliveryStatus]: ", err)
    //     }
    // }


    // const checkMyntraDeliveryStatus = async (productName: string) => {
    //     try {
    //         const statusResponse = await fetch(`${sensitiveData.baseUrl}/checkMyntraDeliveryStatus`, {
    //             method: "POST",
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ tokens: store.googleCredentials, productName: productName })
    //         })
    //         const delStat = await statusResponse.json()
    //         console.log(delStat)
    //     } catch (err) {
    //         console.error("error[checkMyntraDeliveryStatus]: ", err)
    //     }

    //     // setDeliveryStatus(delStat)
    // }

    useEffect(() => {
        console.log(item.from)
        extractColorsFromImage()
        // if (item.from === "flipkart") {
        //     console.log(item.productName)
        //     checkFlipkartDeliveryStatus(item.productName)
        // } else if (item.from.toLowerCase() === "myntra") {
        //     console.log(item.productName)
        //     checkMyntraDeliveryStatus(item.productName)
        // }
    }, [item])



    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" backgroundColor="#121212" />
            <ScrollView style={{ flex: 1, backgroundColor: "#121212" }} contentContainerStyle={{ justifyContent: 'center', alignItems: "center" }}>
                <View style={{ width: '95%', height: 400, position: "relative", marginTop: 10 }}>
                    <Image
                        source={{ uri: item.productImage }}
                        style={{ width: '100%', height: 400, resizeMode: 'cover', borderRadius: 20, marginTop: 0 }}
                    />

                    <View style={{ backgroundColor: '#000', opacity: 0.5, width: '100%', height: 400, position: 'absolute', borderRadius: 20 }}></View>
                    <View style={{ position: 'absolute', bottom: 0, flexDirection: 'row', marginBottom: 10, width: '100%', justifyContent: "space-between", alignItems: 'flex-end', paddingEnd: 10 }}>
                        <Text style={{ color: "#fff", fontSize: 25, fontFamily: 'segoe-bold', width: '80%', paddingHorizontal: 20 }}>{item.productName.slice(0, 50)}...</Text>
                        {/**
                         * commented out for v1
                         * <Delivered bgColor={primaryColor} status={deliveryStatus} width="20%" /> */}

                    </View>
                    <Pressable
                        style={{ width: 50, height: 50, backgroundColor: '#ccc', position: 'absolute', marginTop: 10, marginStart: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
                        onPress={() => props.navigation.goBack()}
                        android_ripple={{ color: "#fff", borderless: false }}

                    >
                        <Ionicons name="arrow-back" size={24} color="#000" style={{ transform: [{ rotate: '-90deg' }] }} />
                    </Pressable>
                </View>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: "space-between", padding: 20, alignItems: 'center' }}>
                    <View>
                        <Text style={{ color: "#fff", marginStart: 5, fontSize: 13 }}>Order Number</Text>
                        <Text style={{ color: "#fff", marginStart: 5, fontSize: 22, fontFamily: "segoe-bold" }}>{item.orderNumber}</Text>
                    </View>
                    <TouchableOpacity onPress={() => { copyToClipboard(item.orderNumber) }} style={{ height: 30, width: 30, justifyContent: "center", alignItems: "center", backgroundColor: "#eaf0f0", borderRadius: 15 }}>
                        <Ionicons name="copy" size={22} color="#000" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity disabled={item.productLink === ""} onPress={() => Linking.openURL(item.productLink)} style={{ flexDirection: 'row', width: '90%', justifyContent: "space-between", padding: 20, alignItems: 'center', backgroundColor: "#222121", borderRadius: 10, marginBottom: 20 }}>
                    <Text style={{ color: "#fff", marginStart: 5, fontSize: 17, fontFamily: "segoe-bold" }}>{item.productLink === "" ? "Link not available" : "Go to the Product/Order"}</Text>
                    {item.productLink === "" ? <FontAwesome name="unlink" size={24} color="#fff" /> : <Feather name="link" size={24} color="#fff" />}
                </TouchableOpacity>

                <View style={{ width: '90%', backgroundColor: "#222121", borderRadius: 10 }}>
                    <View style={{ paddingTop: 20, paddingLeft: 20 }}>
                        <Text style={{ color: "#fff", marginStart: 5, fontSize: 13 }}>Seller Name</Text>
                        <Text style={{ color: "#fff", marginStart: 5, fontSize: 22, fontFamily: "segoe-bold" }}>{item.sellerName ? item.sellerName : "NA"}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 20, alignItems: 'center' }}>
                        <View>
                            <Text style={{ color: "#fff", marginStart: 5, fontSize: 13 }}>Arriving by</Text>
                            <Text style={{ color: "#fff", marginStart: 5, fontSize: 22, fontFamily: "segoe-bold" }}>{item.ETA}</Text>
                        </View>
                        <View>
                            <Text style={{ color: "#fff", marginStart: 5, fontSize: 13 }}> Price</Text>
                            <View>
                                <Text style={{ marginStart: 5, fontSize: 22, fontFamily: "segoe-bold", color: '#fff' }}>{formatPrice(item.productPrice)}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ width: "100%", justifyContent: "center", alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
                    <View style={{ borderRadius: 10, overflow: 'hidden', backgroundColor: "#202020ed", width: "92%", }}>
                        {extraData.map((data, idx) => (
                            <View
                                key={idx}
                                style={{ flexDirection: 'row', width: '100%', justifyContent: "space-between", padding: 20, alignItems: 'center', }}>
                                <Text style={{ color: "#fff", marginStart: 5, fontSize: 15, fontFamily: Platform.OS === "ios" ? "segoe-normal" : 'gotham-normal', }}>{data.label}</Text>
                                {<Text style={{ color: "#fff", marginStart: 5, fontFamily: 'segoe-bold', fontSize: 15 }}>{isNaN(parseInt(data.data)) ? data.data : formatPrice(data.data)}</Text>}
                            </View>
                        ))
                        }
                    </View>
                </View>
                <View style={{ flexDirection: 'row', width: '90%', justifyContent: "space-between", padding: 20, alignItems: 'center', backgroundColor: "#222121", borderRadius: 10, marginBottom: 20 }}>
                    {item.from.toLowerCase() === "flipkart" ?
                        <Image source={require('../../Assets/BrandLogos/flipkart.png')} style={{ height: 50, width: 50, marginEnd: 10 }} /> :
                        item.from.toLowerCase() === "ajio" ? <Image source={require('../../Assets/BrandLogos/ajio.png')} style={{ height: 50, width: 50, marginEnd: 10 }} /> : item.from.toLowerCase() === "myntra" ?
                            <Image source={require('../../Assets/BrandLogos/myntra.png')} style={{ height: 35, width: 50, marginEnd: 10 }} /> : <Text style={{ color: "#fff" }}>{item.from}</Text>}
                    <Text style={{ color: "#fff", marginStart: 5, fontSize: 17, fontFamily: 'gotham-bold' }}>This Order has been scraped from {item.from}.com</Text>
                </View>

            </ScrollView>
            <Pressable android_ripple={{ color: '#fff', borderless: false }}
                style={{ flexDirection: 'row', width: '100%', backgroundColor: primaryColor, height: 70, marginEnd: 30, elevation: 100, borderRadius: 0, alignItems: 'center', justifyContent: "center" }}
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
                        await store.toggleCallReminder(item.orderId, item.ETA, true)
                        callReminder(item.productImage, notificationInfo, item.orderNumber, item.ETA, item.from, item.productName)
                        setReminder(true)
                    } else {
                        await store.toggleCallReminder(item.orderId, item.ETA, false)
                        await removeNotificationIdLocally(item.orderId)//cancel notification
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
})

export default OrderDetailsScreen
