import React, { useState } from 'react'
import { View, Text, Pressable, Linking, ListRenderItem, Platform, TouchableOpacity } from 'react-native'
import { AmazonOrder } from '../../constants/Types/OrderTypes'

import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import store from '../store/store';
import { callReminder } from '../helpers/notificationHelpers';


//BUG: Images from firebase storage not visible on OrderItem but visible in OrderDetailsScreen


const AmazonOrderItem: ListRenderItem<AmazonOrder> = observer(({ item, index }) => {
    const navigation = useNavigation()
    const [hasBeenDelivered, setHasBeenDelivered] = useState(false)

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
                            {item.orderNumber}
                        </Text>
                        <Text style={{ flexShrink: 1, color: '#bfc4c1', fontFamily: 'gotham-black', fontSize: 20 }}>
                            {item.totalPrice}
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
                            await store.toggleAmazonCallReminder(item.orderId, item.ETA)
                            callReminder('', item.orderId, item.orderNumber, item.ETA, 'amazon');


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
                                    <MaterialCommunityIcons name="bell-ring" size={24} color="#c0bdbd" />
                                )}
                        </View>

                    </Pressable>
                </View>
            </View>

        </Pressable>
    )
})

export default AmazonOrderItem
