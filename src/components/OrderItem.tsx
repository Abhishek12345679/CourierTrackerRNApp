import React, { useEffect, useState } from 'react'
import { View, Text, Pressable, Linking, ListRenderItem, Platform } from 'react-native'
import { Image } from 'react-native-ui-lib'
import { Order } from '../../constants/Types/OrderTypes'

import * as Calendar from 'expo-calendar';
import { dateStringToMS } from '../screens/RootScreens/HomeScreen';
import { useNavigation } from '@react-navigation/native';
import store from '../store/store';

const OrderItem: ListRenderItem<Order> = ({ item, index }) => {
    const navigation = useNavigation()

    const [calendarId, setCalendarId] = useState('')

    useEffect(() => {
        (async () => {
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status === 'granted') {
            }
        })();
    }, []);


    const getDefaultCalendarSource = async () => {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const defaultCalendars = calendars.filter(each => each.source.name === 'Default');
        return defaultCalendars[0].source;
    }

    const createCalendar = async () => {
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

    const addEventToCalendar = async () => {
        const id = await createCalendar()
        console.log("id: ", id)

        const event = await Calendar.createEventAsync(id, {
            title: item.productName,
            startDate: new Date(dateStringToMS(item.ETA)),// invalid when start date is in the past
            endDate: new Date(dateStringToMS(item.ETA))
        })
        store.setCalendarEventId(event, item.orderId, dateStringToMS(item.ETA).toString()) //fix for flipkart
        console.log(event)
        // Calendar.openEventInCalendar(event)
    }
    return (
        <Pressable
            android_ripple={{ color: '#ccc', radius: 250, borderless: false }}
            style={{ flex: 1, flexDirection: 'row', height: 110, marginTop: 15, backgroundColor: '#4d4a50', borderRadius: 7, marginLeft: 15, marginRight: 15, justifyContent: 'space-between', alignItems: 'center' }}
            onPress={() => navigation.navigate('OrderDetailsScreen', {
                item: item
            })}
            key={index}
        >
            <Image source={{ uri: item.productImage }} style={{ height: 80, width: 80, marginStart: 8, borderRadius: 5, flex: 1 }} />
            <View style={{ flex: 4 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 5, color: '#fff', marginEnd: 10, marginStart: 10 }}>{item.productName}</Text>
                <View style={{ flexDirection: "row", alignItems: 'center' }}>
                    <View style={{ width: 75, height: 35, marginBottom: 5, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginStart: 10, marginTop: 5 }}>
                        <Text style={{ flexShrink: 1, color: '#fff', fontWeight: 'bold', fontSize: 17 }}>₹{item.productPrice.replace("b\x02(.", "").trim()}</Text>
                    </View>
                    <Pressable android_ripple={{ color: '#000', radius: 250, borderless: false }}
                        style={{ flexDirection: 'row', width: 200, height: 35, backgroundColor: "#fff", marginEnd: 30, elevation: 100, borderRadius: 5, alignItems: 'center', justifyContent: "center", marginStart: 20 }}
                        onPress={addEventToCalendar}>
                        <Image source={require('../Assets/Icons/siri.png')} style={{ width: 25, height: 25, marginEnd: 10 }} />
                        <Text style={{ fontFamily: 'segoe-bold', fontSize: 15 }}>Add to Calendar</Text>

                    </Pressable>
                </View>
            </View>

        </Pressable>

    )
}

export default OrderItem
