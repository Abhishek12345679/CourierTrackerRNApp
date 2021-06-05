import React, { useEffect, useState } from 'react'
import { View, Text, Pressable, Linking, ListRenderItem, Platform, TouchableOpacity } from 'react-native'
import { Image, Dialog } from 'react-native-ui-lib'
import { Order } from '../../constants/Types/OrderTypes'

import * as Calendar from 'expo-calendar';
import { useNavigation } from '@react-navigation/native';
import store from '../store/store';
import { observer } from 'mobx-react';
import { sensitiveData } from '../../constants/sen_data';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export const getDefaultCalendarSource = async () => {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const defaultCalendars = calendars.filter(each => each.source.name === 'Default');
    return defaultCalendars[0].source;
}

export const createCalendar = async () => {
    const defaultCalendarSource =
        Platform.OS === 'ios'
            ? await getDefaultCalendarSource()
            : { isLocalAccount: true, name: 'Woosh' };
    const newCalendarID = await Calendar.createCalendarAsync({
        title: 'Expo Calendar',
        color: 'blue',
        entityType: Calendar.EntityTypes.EVENT,
        sourceId: defaultCalendarSource.id,
        source: defaultCalendarSource,
        name: 'internalCalendarName',
        ownerAccount: 'personal',
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
    return newCalendarID
}




const OrderItem: ListRenderItem<Order> = observer(({ item, index, openCalendarDialog }) => {
    const navigation = useNavigation()

    const [calendarId, setCalendarId] = useState('')
    const [hasBeenDelivered, setHasBeenDelivered] = useState(false)

    useEffect(() => {
        (async () => {
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status === 'granted') {
            }
        })();
    }, []);


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



    const addEventToCalendar = async () => {
        const id = await createCalendar()
        console.log("id: ", id)
        console.log('Date:', new Date(item.ETA))

        const event = await Calendar.createEventAsync(id, {
            title: item.productName,
            startDate: new Date((item.ETA)),
            endDate: new Date((item.ETA))
        })
        store.setCalendarEventId(event, item.orderId, Date.parse(item.ETA).toString())
        console.log(event)
        // Calendar.openEventInCalendar(event)
    }

    return (
        <Pressable
            android_ripple={{ color: '#ccc', radius: 250, borderless: false }}
            style={{
                flex: 1,
                flexDirection: 'row',
                height: 110,
                marginTop: 15,
                backgroundColor: '#202020ed',
                borderRadius: 7,
                marginLeft: 15,
                marginRight: 15,
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
            onPress={() => navigation.navigate('OrderDetailsScreen', {
                item: item
            })}
            key={index}
        >
            <Image
                source={{ uri: item.productImage }}
                style={{
                    height: 90,
                    width: 90,
                    marginStart: 8,
                    borderRadius: 5,
                    // flex: 1,
                    backgroundColor: "#fff",
                    overflow: 'hidden',
                }}
            // resizeMode="contain"
            />
            <View style={{ flex: 4 }}>
                <View style={{ flexDirection: 'row', width: '100%', marginTop: 10 }}>
                    <Text style={{
                        // fontWeight: 'bold',
                        fontFamily: 'gotham-normal',
                        marginBottom: 5,
                        color: '#fff',
                        marginEnd: 10,
                        marginStart: 10,
                        fontSize: 17,
                        width: '75%'
                    }}>
                        {item.productName.slice(0, 50)}{item.productName.length > 50 && "..."}
                    </Text>
                    <Pressable
                        android_ripple={{
                            color: '#000',
                            radius: 15,
                            borderless: false
                        }}
                        style={{
                            flexDirection: 'row',
                            width: 35,
                            height: 35,
                            backgroundColor: "#d8d6d6",
                            marginEnd: 0,
                            elevation: 1,
                            borderRadius: 18,
                            alignItems: 'center',
                            justifyContent: "center",
                            marginStart: 0
                        }}
                        onPress={addEventToCalendar}
                    >
                        {item.calendarEventId.length === 0 ?
                            (
                                <View
                                    style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#d8d6d6', justifyContent: 'center', alignItems: 'center', }}
                                >
                                    <MaterialCommunityIcons name="bell-ring-outline" size={24} />
                                </View>
                            ) :
                            (
                                <View
                                    style={{ width: 30, height: 30, borderRadius: 20, backgroundColor: '#d8d6d6', justifyContent: 'center', alignItems: 'center', }}
                                >
                                    <MaterialCommunityIcons name="bell-ring" size={24} />
                                </View>
                            )}

                    </Pressable>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 10,
                        marginTop: 5
                    }}>
                    <View style={{ width: 75, height: 35, marginBottom: 5, justifyContent: 'center', alignItems: 'flex-start', borderRadius: 5, marginTop: 5, marginStart: 5 }}>
                        <Text style={{ flexShrink: 1, color: '#d6d3d3', fontFamily: 'gotham-black', fontSize: 15 }}>
                            ₹{Math.trunc(parseInt(item.productPrice.trim())).toString()}.00
                        </Text>
                    </View>

                    {/* <Pressable
                        android_ripple={{
                            color: '#000',
                            radius: 250,
                            borderless: false
                        }}
                        style={{
                            flexDirection: 'row',
                            width: 175,
                            height: 35,
                            backgroundColor: "#fff",
                            marginEnd: 0,
                            elevation: 1,
                            borderRadius: 5,
                            alignItems: 'center',
                            justifyContent: "space-around",
                            marginStart: 0
                        }}
                        onPress={openCalendarDialog}>
                        {item.calendarEventId.length === 0 ? (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Image source={require('../Assets/Icons/calendar.png')} style={{ width: 25, height: 25, marginEnd: 10 }} />
                                <Text style={{ fontFamily: 'segoe-bold', fontSize: 15 }}>Add to Calendar</Text>
                            </View>
                        ) : (
                            <Text>
                                Added to Calendar
                            </Text>
                        )}

                    </Pressable> */}
                </View>
            </View>

        </Pressable>

    )
})

export default OrderItem
