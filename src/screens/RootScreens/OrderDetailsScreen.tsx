import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable, StatusBar, TouchableOpacity, Linking, ToastAndroid, Platform } from 'react-native'
import Image from 'react-native-ui-lib/image'
import store from '../../store/store'
import { sensitiveData } from '../../../constants/sen_data'

import ImageColors from 'react-native-image-colors'
import Clipboard from '@react-native-clipboard/clipboard';
import { Feather } from '@expo/vector-icons'
import Delivered from '../../components/Delivered'
import { callReminder } from '../../helpers/notificationHelpers'
import PushNotification from 'react-native-push-notification'

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
    // const [secondaryColor, setSecondaryColor] = useState('')
    const [deliveryStatus, setDeliveryStatus] = useState(false)

    const extraData = [
        // { label: 'Seller Name', data: item.sellerName },
        { label: 'Delivery Charges', data: item.deliveryCharges ? item.deliveryCharges : "NA" },
        { label: 'Delivery Discount', data: item.deliveryDiscount ? item.deliveryDiscount : "NA" },
        { label: 'Total Amount \n(Total Price of the Order)', data: item.totalPrice },
        // { label: 'Product Link', data: item.productLink },
        // { label: 'Ordered from', data: item.from },
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



    const checkFlipkartDeliveryStatus = async (productName: string) => {
        const statusResponse = await fetch(`${sensitiveData.baseUrl}/checkFlipkartDeliveryStatus`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tokens: store.googleCredentials, productName: productName })
        })
        const delStat = await statusResponse.json()
        console.log(delStat)
        setDeliveryStatus(delStat)
    }


    const checkMyntraDeliveryStatus = async (productName: string) => {
        const statusResponse = await fetch(`${sensitiveData.baseUrl}/checkMyntraDeliveryStatus`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tokens: store.googleCredentials, productName: productName })
        })
        const delStat = await statusResponse.json()
        console.log(delStat)
        // setDeliveryStatus(delStat)
    }

    useEffect(() => {
        console.log(item.from)
        extractColorsFromImage()
        if (item.from === "flipkart") {
            console.log(item.productName)
            checkFlipkartDeliveryStatus(item.productName)
        } else if (item.from.toLowerCase() === "myntra") {
            console.log(item.productName)
            checkMyntraDeliveryStatus(item.productName)
        }
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
                        <Delivered bgColor={primaryColor} status={deliveryStatus} width="20%" />
                    </View>
                    <Pressable
                        style={{ width: 50, height: 50, backgroundColor: '#ccc', position: 'absolute', marginTop: 10, marginStart: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
                        onPress={() => props.navigation.goBack()}
                        android_ripple={{ color: "#fff", radius: 25, }}

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
                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: "space-between", padding: 20, alignItems: 'center', }}>
                                <Text style={{ color: "#fff", marginStart: 5, fontSize: 15, fontFamily: Platform.OS === "ios" ? "segoe-normal" : 'gotham-normal', }}>{data.label}</Text>
                                {<Text style={{ color: "#fff", marginStart: 5, fontFamily: 'segoe-bold', fontSize: 15 }}>{isNaN(parseInt(data.data)) ? data.data : formatPrice(data.data)}</Text>}
                            </View>
                        ))
                        }
                    </View>
                </View>

            </ScrollView>
            <Pressable android_ripple={{ color: '#fff', radius: 100, borderless: false }}
                style={{ flexDirection: 'row', width: '100%', backgroundColor: primaryColor, height: 70, marginEnd: 30, elevation: 100, borderRadius: 0, alignItems: 'center', justifyContent: "center" }}
                onPress={async () => {
                    if (item.reminder_frequency === "none") {
                        await store.toggleCallReminder(item.orderId, item.ETA, "selected")
                        callReminder(item.productImage, item.orderId, item.orderNumber, item.ETA, item.from, item.productName)
                    } else {
                        await store.toggleCallReminder(item.orderId, item.ETA, "none")
                        PushNotification.cancelLocalNotifications({ id: item.orderId }) //cancel notification
                    }
                }}>

                {
                    item.reminder_frequency === "none" ?
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
