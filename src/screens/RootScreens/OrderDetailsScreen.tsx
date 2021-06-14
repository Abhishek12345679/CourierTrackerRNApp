import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable, StatusBar } from 'react-native'
import Image from 'react-native-ui-lib/image'
import { Order } from '../../../constants/Types/OrderTypes'
import { createCalendar } from '../../components/OrderItem'
import * as Calendar from 'expo-calendar'
import store from '../../store/store'
import { sensitiveData } from '../../../constants/sen_data'

import ImageColors from 'react-native-image-colors'
import AsyncStorage from '@react-native-async-storage/async-storage'

const OrderDetailsScreen = observer((props: any) => {
    const { item } = props.route.params
    const [primaryColor, setPrimaryColor] = useState('')
    const [secondaryColor, setSecondaryColor] = useState('')

    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(parseInt(item.productPrice))


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

    const removeEventFromCalendar = async (eventid: string) => {
        await Calendar.deleteEventAsync(eventid)
        //update orders by setting calendarEventId to ""
        console.log("Item deleted")

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
    }


    // useEffect(() => {
    //     props.navigation.setOptions({
    //         title: item.productName
    //     })
    // }, []);

    useEffect(() => {
        extractColorsFromImage()
        if (item.from === "flipkart") {
            console.log(item.productName)
            checkFlipkartDeliveryStatus(item.productName)
        }
    }, [item])

    const addEventToCalendar = async () => {
        const id = await createCalendar()
        // console.log("id: ", id)
        const event = await Calendar.createEventAsync(id, {
            title: item.productName,
            startDate: new Date(item.ETA),
            endDate: new Date(item.ETA)
        })
        store.setCalendarEventId(event, item.orderId, Date.parse(item.ETA).toString())
        // await AsyncStorage.setItem('orders', JSON.stringify(store.orders))
        // console.log(event)
        // Calendar.openEventInCalendar(event)
    }


    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" />
            <ScrollView style={{ flex: 1, backgroundColor: "#121212" }}>
                <View style={{ width: '100%', height: 400, position: "relative" }}>
                    <Image
                        source={{ uri: item.productImage }}
                        style={{ width: '100%', height: 400, resizeMode: 'cover', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginTop: 0, backgroundColor: "#121212" }}
                    />

                    <View style={{ backgroundColor: '#000', opacity: 0.5, width: '100%', height: 400, position: 'absolute' }}></View>
                    <Text style={{ color: "#fff", position: 'absolute', bottom: 0, fontSize: 30, fontFamily: 'segoe-bold', marginBottom: 10, marginStart: 10 }}>{item.productName}</Text>
                </View>
                <Pressable
                    style={{ width: 50, height: 50, backgroundColor: '#ccc', position: 'absolute', marginTop: 10, marginStart: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
                    onPress={() => props.navigation.goBack()}
                    android_ripple={{ color: "#fff", radius: 25, }}

                >
                    <Ionicons name="arrow-back" size={24} color="#000" style={{ transform: [{ rotate: '-90deg' }] }} />
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
                <View>
                    <Text style={{ color: "#ccc", padding: 20 }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tristique mauris nec velit auctor finibus. Etiam ante neque, dictum ac scelerisque vel, tristique vitae dolor. Praesent tellus libero, tempus et vehicula ut, commodo in arcu. Aenean nec magna malesuada, efficitur sapien porttitor, consequat orci. Donec et urna nisl. Nam venenatis, sapien at consectetur fermentum, lacus ipsum molestie sapien, non malesuada sapien urna in quam. Cras et tortor ut enim porta vehicula sed et est. Sed nec dui ut sapien viverra dictum ac non augue. Integer nec aliquam nunc. Nunc tellus metus, tincidunt sed congue eu, luctus id est. Morbi eu lacus lacus. Donec accumsan volutpat varius. Ut laoreet non lectus nec bibendum. Nulla sollicitudin lacus ut neque consequat commodo. Phasellus venenatis sem non mauris mattis, sit amet efficitur urna mollis. Nullam enim justo, feugiat nec lacus quis, ultrices tristique sem.

                        Cras pulvinar nunc eget erat commodo, nec rutrum est euismod. Nullam rhoncus ultrices pulvinar. Fusce ornare ex a nibh euismod iaculis. Nam in placerat quam. Quisque ac magna purus. Proin tempor, velit ac semper rhoncus, nulla urna aliquet neque, commodo sagittis sem ligula quis est. Duis sed massa eu nisi faucibus dignissim. Fusce at tristique nisi, at fermentum erat. Praesent tempor lacinia nisi, sit amet porta lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque eu feugiat tellus.

                        Mauris elementum sapien eu sem iaculis, sed tempus velit volutpat. Nunc id blandit augue, sed semper magna. Nam luctus sollicitudin diam, vitae sagittis lacus rhoncus sit amet. Curabitur blandit porta leo. Quisque ultricies dui purus, in pellentesque nunc rhoncus ut. Nulla imperdiet nec dolor quis condimentum. Duis purus diam, varius eget felis et, sollicitudin aliquet leo. In erat orci, ultrices vel iaculis et, laoreet sed magna. Integer eget felis sit amet purus pretium fermentum. Morbi tempor lacinia lacus non convallis. Nulla in malesuada justo. Nam ultrices, magna sit amet porta consectetur, enim urna congue ante, rutrum venenatis nisi enim rutrum elit. Nullam quam tortor, condimentum non rutrum id, ullamcorper eu ligula. Sed laoreet mattis neque, eu interdum ligula molestie et.

                        Nulla id convallis libero. Integer et tellus in metus suscipit suscipit. Mauris diam magna, iaculis imperdiet scelerisque et, ullamcorper non lacus. Sed quis commodo orci. Pellentesque id ex nunc. In porttitor tristique neque at lobortis. Mauris leo eros, euismod a blandit vitae, convallis a velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vulputate, enim sed molestie pulvinar, nibh arcu posuere ipsum, vitae facilisis nulla arcu in lectus. Mauris nibh odio, facilisis eget cursus non, consequat ut massa. In accumsan sem in diam semper imperdiet. Praesent pellentesque erat sit amet eleifend blandit. Aliquam tincidunt leo id tellus eleifend euismod.

                        Praesent nec dolor libero. Duis sit amet auctor purus, eget aliquam augue. Donec consequat nisl eu sagittis gravida. Aliquam euismod, justo ut facilisis ultrices, est elit lobortis tellus, vestibulum lacinia mi nisi a nibh. Morbi interdum commodo justo, ut imperdiet sapien convallis in. Phasellus convallis, quam sed volutpat ullamcorper, turpis massa scelerisque dolor, non ullamcorper ligula erat a arcu. Aenean vel est sapien. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce sed feugiat nisi. Nam scelerisque orci vel est finibus, sit amet varius ex imperdiet. Nulla lobortis, leo ac tincidunt volutpat, diam nulla congue lacus, efficitur dictum ex enim eu purus. Integer tristique lacus sit amet gravida posuere. Quisque blandit felis vitae lobortis ullamcorpe
                    </Text>
                </View>

            </ScrollView>
            <Pressable android_ripple={{ color: '#fff', radius: 100, borderless: false }}
                style={{ flexDirection: 'row', width: '100%', backgroundColor: primaryColor, height: 70, marginEnd: 30, elevation: 100, borderRadius: 0, alignItems: 'center', justifyContent: "center" }}
                onPress={item.calendarEventId.length === 0 ? addEventToCalendar : () => removeEventFromCalendar(item.calendarEventId)}>

                {
                    item.calendarEventId.length === 0 ?
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
})

export default OrderDetailsScreen
