import React, { useState } from 'react'
import { View, Text, Pressable, ListRenderItem, Platform, Image } from 'react-native'
import { NotificationInfo, Order } from '../../constants/Types/OrderTypes'

import { useNavigation } from '@react-navigation/native';
import store from '../store/store';
import { observer } from 'mobx-react';
import { sensitiveData } from '../../constants/sen_data';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { callReminder, removeNotificationIdLocally } from '../helpers/notificationHelpers';

const OrderItem: ListRenderItem<Order> = observer(({ item, index }) => {
    console.log(item)
    const navigation = useNavigation()
    // const [hasBeenDelivered, setHasBeenDelivered] = useState(false)

    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(parseInt(item.productPrice))

    // const checkFkAndMyntraDeliveryStatus = async (pName: string, from: string) => {
    //     const statusResponse = await fetch(`${sensitiveData.baseUrl}/check${from}DeliveryStatus`, {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ tokens: store.googleCredentials, productName: pName })
    //     })
    //     const delStat = await statusResponse.json()
    //     console.log(delStat.deliveryStatus)
    //     // setHasBeenDelivered(delStat.deliveryStatus)
    // }

    // useEffect(() => {
    //     const capitalize = (s: string): string => s && s[0].toUpperCase() + s.slice(1)
    //     item && checkFkAndMyntraDeliveryStatus(item.productName, capitalize(item.from))
    // }, [item])

    return (
        <Pressable
            android_ripple={{ color: '#8b8a8a2c', radius: 250, borderless: false }}
            style={{
                flex: 1,
                flexDirection: 'row',
                height: 110,
                marginTop: 7.50,
                backgroundColor: '#202020ed',
                borderRadius: 7,
                marginLeft: 20,
                marginRight: 20,
                justifyContent: 'space-between',
                alignItems: 'center',

                //ios
                // shadowRadius: 10,
                // shadowColor: "#202020ed",
                // shadowOpacity: 0.2,
                // shadowOffset: {
                //     height: 10,
                //     width: 10
                // },
                // elevation: 1
            }}
            onPress={() => navigation.navigate('OrderDetailsScreen', {
                item: item
            })}
            key={index}
        >
            <Image
                source={{ uri: item.productImage }}
                style={{
                    height: 80,
                    width: 80,
                    marginStart: 15,
                    borderRadius: 5,
                    // flex: 1,
                    backgroundColor: "#000",
                    overflow: 'hidden',
                }}
            // resizeMode="contain"
            />
            <View style={{ flex: 4 }}>
                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                    <View style={{ paddingHorizontal: 20, width: '65%' }}>
                        <Text
                            style={{
                                fontFamily: Platform.OS === "ios" ? "segoe-normal" : 'gotham-normal',
                                marginBottom: 5,
                                color: '#cecece',
                                fontSize: 17,
                                width: '100%'
                            }}>
                            {item.productName.slice(0, 50)}{item.productName.length > 50 && "..."}
                        </Text>
                        <Text style={{ flexShrink: 1, color: '#bfc4c1', fontFamily: 'gotham-black', fontSize: 20 }}>
                            {formattedPrice}
                        </Text>
                    </View>
                    <Pressable
                        android_ripple={{
                            color: '#000',
                            radius: 15,
                            borderless: false
                        }}
                        style={{
                            flexDirection: 'row',
                            width: '35%',
                            // height: 35,
                            // backgroundColor: "#d8d6d6",
                            alignItems: 'flex-end',
                            justifyContent: "center",
                        }}
                        onPress={async () => {
                            if (!item.callReminder) {
                                const notificationInfo: NotificationInfo = {
                                    orderId: item.orderId,
                                    notificationId: Math.trunc(Math.random() * 1000000)
                                }
                                await store.toggleCallReminder(item.orderId, item.ETA, true)
                                console.log("called")
                                callReminder(item.productImage, notificationInfo, item.orderNumber, item.ETA, item.from, item.productName)
                            } else {
                                await store.toggleCallReminder(item.orderId, item.ETA, false)
                                await removeNotificationIdLocally(item.orderId) // test
                            }
                        }}
                    >
                        <View
                            style={{
                                width: "70%",
                                borderRadius: 18,
                                alignItems: 'center',
                                justifyContent: "center",
                                height: 60,
                                backgroundColor: !item.callReminder ? "#424141" : "#11b302"
                            }}>
                            {!item.callReminder ?
                                (
                                    <MaterialCommunityIcons name="bell-ring-outline" size={24} color="#fff" />
                                ) :
                                (
                                    <MaterialCommunityIcons name="bell-ring" size={24} color="#fff" />
                                )}
                        </View>

                    </Pressable>
                </View>
            </View>
        </Pressable>
    )
})

export default OrderItem
