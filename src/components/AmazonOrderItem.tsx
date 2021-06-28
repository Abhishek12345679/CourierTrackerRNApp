import React, { useEffect, useState } from 'react'
import { View, Text, Pressable, Linking, ListRenderItem, Platform, TouchableOpacity } from 'react-native'
import { Image, Dialog } from 'react-native-ui-lib'
import { AmazonOrder, Order } from '../../constants/Types/OrderTypes'

import * as Calendar from 'expo-calendar';
import { useNavigation } from '@react-navigation/native';
import store from '../store/store';
import { observer } from 'mobx-react';
import { sensitiveData } from '../../constants/sen_data';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';


//BUG: Images from firebase storage not visible on OrderItem but visible in OrderDetailsScreen

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



const AmazonOrderItem: ListRenderItem<AmazonOrder> = observer(({ item, index }) => {
    const navigation = useNavigation()

    const [calendarId, setCalendarId] = useState('')
    const [hasBeenDelivered, setHasBeenDelivered] = useState(false)

    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(parseInt(item.totalPrice))

    useEffect(() => {
        (async () => {
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status === 'granted') {
            }
        })();
    }, []);


    const addEventToCalendar = async () => {
        const id = await createCalendar()
        console.log("id: ", id)
        console.log('Date:', new Date(item.ETA))

        const event = await Calendar.createEventAsync(id, {
            title: item.orderNumber,
            startDate: new Date((item.ETA)),
            endDate: new Date((item.ETA))
        })

        // database()
        //     .ref(`/users/${store.loginCredentials.uid}/calendar_event_ids`)
        //     .set({

        //     })
        //     .then(() => console.log('Data set.'));

        store.setCalendarEventId(event, item.orderId, Date.parse(item.ETA).toString())
        // await AsyncStorage.setItem('orders', JSON.stringify(store.orders))
        // console.log(event)
        // Calendar.openEventInCalendar(event)
    }

    return (
        <Pressable
            disabled={true}
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
                // shadowRadius: 20,
                // shadowColor: "#fff",
                // shadowOpacity: 0.25,
                // shadowOffset: {
                //     height: 100,
                //     width: 100
                // },
                elevation: 1
            }}
            onPress={() => navigation.navigate('OrderDetailsScreen', {
                item: item
            })}
            key={index}
        >
            <Image
                source={{ uri: "" }}
                style={{
                    height: 80,
                    width: 80,
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
                        // fontFamily: 'gotham-normal',
                        marginBottom: 5,
                        color: '#cecece',
                        marginEnd: 10,
                        marginStart: 10,
                        fontSize: 17,
                        width: '75%'
                    }}>
                        {item.orderNumber.slice(0, 50)}{item.orderNumber.length > 50 && "..."}
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
                            // backgroundColor: "#d8d6d6",
                            elevation: 1,
                            borderRadius: 18,
                            alignItems: 'center',
                            justifyContent: "center",
                        }}
                        onPress={addEventToCalendar}
                    >
                        {item.calendarEventId.length === 0 ?
                            (
                                <View
                                    style={{ width: 56, height: 40, borderRadius: 12, backgroundColor: '#d8d6d6', justifyContent: 'center', alignItems: 'center', marginRight: 10, marginTop: 20 }}>
                                    <MaterialCommunityIcons name="bell-ring-outline" size={24} />
                                </View>

                            ) :
                            (
                                <View
                                    style={{ width: 30, height: 30, borderRadius: 20, backgroundColor: '#d8d6d6', justifyContent: 'center', alignItems: 'center', marginRight: 10, marginTop: 20 }}
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
                    <View style={{ height: 35, marginBottom: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginTop: 5, marginStart: 5, flexDirection: 'row' }}>
                        <Text style={{ flexShrink: 1, color: '#bfc4c1', fontFamily: 'gotham-black', fontSize: 20 }}>
                            {formattedPrice}
                        </Text>
                    </View>
                </View>
            </View>

        </Pressable>

    )
})

export default AmazonOrderItem
