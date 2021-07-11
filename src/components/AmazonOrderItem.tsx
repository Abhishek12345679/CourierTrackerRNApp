import React, { useState } from 'react'
import { View, Text, Pressable, Linking, ListRenderItem, Platform, TouchableOpacity } from 'react-native'
import { AmazonOrder } from '../../constants/Types/OrderTypes'

import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';


//BUG: Images from firebase storage not visible on OrderItem but visible in OrderDetailsScreen


const AmazonOrderItem: ListRenderItem<AmazonOrder> = observer(({ item, index }) => {
    const navigation = useNavigation()
    const [hasBeenDelivered, setHasBeenDelivered] = useState(false)

    return (
        <Pressable
            // disabled={true}
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
            onPress={() => navigation.navigate('AmazonOrderDetailsScreen', {
                item: item
            })}
            key={index}
        >
            <View style={{ flex: 1, marginLeft: 20 }}>
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
                        onPress={() => { }}
                    >
                        {!item.callReminder ?
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
                            ₹{item.totalPrice}
                        </Text>
                    </View>
                </View>
            </View>

        </Pressable >

    )
})

export default AmazonOrderItem
