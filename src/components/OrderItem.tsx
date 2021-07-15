import React, { useEffect, useState } from 'react'
import { View, Text, Pressable, Linking, ListRenderItem, Platform, TouchableOpacity, Image } from 'react-native'
// import { Image } from 'react-native-ui-lib'
import { Order } from '../../constants/Types/OrderTypes'

import { useNavigation } from '@react-navigation/native';
import store from '../store/store';
import { observer } from 'mobx-react';
import { sensitiveData } from '../../constants/sen_data';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';


//BUG: Images from firebase storage not visible on OrderItem but visible in OrderDetailsScreen

const OrderItem: ListRenderItem<Order> = observer(({ item, index }) => {
    console.log(item)
    const navigation = useNavigation()

    const [hasBeenDelivered, setHasBeenDelivered] = useState(false)


    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(parseInt(item.productPrice))



    const checkFkAndMyntraDeliveryStatus = async (pName: string, from: string) => {
        const statusResponse = await fetch(`${sensitiveData.baseUrl}/check${from}DeliveryStatus`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tokens: store.googleCredentials, productName: pName })
        })
        const delStat = await statusResponse.json()
        console.log(delStat.deliveryStatus)
        setHasBeenDelivered(delStat.deliveryStatus)
    }

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
                marginTop: 15,
                backgroundColor: '#202020ed',
                borderRadius: 7,
                marginLeft: 20,
                marginRight: 20,
                justifyContent: 'space-between',
                alignItems: 'center',

                //ios
                shadowRadius: 20,
                shadowColor: "#fff",
                shadowOpacity: 0.25,
                shadowOffset: {
                    height: 100,
                    width: 100
                },
                elevation: 1
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
                    marginStart: 8,
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
                        <Text style={{
                            fontFamily: 'gotham-normal',
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
                            await store.toggleCallReminder(item.orderId, item.ETA)
                        }}
                    >
                        <View
                            style={{
                                width: "70%",
                                borderRadius: 18,
                                alignItems: 'center',
                                justifyContent: "center",
                                height: 60,
                                backgroundColor: !item.callReminder ? "#424141" : "#239b56"
                            }}>
                            {!item.callReminder ?
                                (
                                    <MaterialCommunityIcons name="bell-ring-outline" size={24} color="#c0bdbd" />
                                ) :
                                (
                                    <MaterialCommunityIcons name="bell-ring" size={24} color="#000" />
                                )}
                        </View>

                    </Pressable>
                </View>
            </View>

        </Pressable>
    )
})

export default OrderItem
