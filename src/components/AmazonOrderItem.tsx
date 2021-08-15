import React from 'react'
import { View, Text, Pressable, ListRenderItem, Platform, ToastAndroid } from 'react-native'
import { AmazonOrder, NotificationInfo } from '../../constants/Types/OrderTypes'

import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import store from '../store/store';
import { callReminder, removeNotificationIdLocally } from '../helpers/notificationHelpers';


const AmazonOrderItem: ListRenderItem<AmazonOrder> = observer(({ item, index }) => {
    const navigation = useNavigation()

    return (
        <Pressable
            android_ripple={{ color: '#8b8a8a2c', borderless: false }}
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
                // shadowRadius: 20,
                // shadowColor: "#fff",
                // shadowOpacity: 0.25,
                // shadowOffset: {
                //     height: 100,
                //     width: 100
                // },
                // elevation: 1
            }}
            onPress={() => navigation.navigate('AmazonOrderDetailsScreen', {
                item: item
            })}
            key={index}
        >
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
                            {item.orderContent}
                        </Text>
                        <Text style={{ flexShrink: 1, color: '#bfc4c1', fontFamily: 'gotham-black', fontSize: 20 }}>
                            {item.totalPrice}
                        </Text>
                    </View>
                    <Pressable
                        android_ripple={{
                            color: '#000',
                            borderless: true
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
                            } else {
                                await store.toggleAmazonCallReminder(item.orderId, item.ETA, false)
                                await removeNotificationIdLocally(item.orderId) //cancel notification
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
                                    <MaterialCommunityIcons name="bell-ring-outline" size={24} color="#ffffff" />
                                ) :
                                (
                                    <MaterialCommunityIcons name="bell-ring" size={24} color="#ffffff" />
                                )}
                        </View>

                    </Pressable>
                </View>
            </View>

        </Pressable>
    )
})

export default AmazonOrderItem
