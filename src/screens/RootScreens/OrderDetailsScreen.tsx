import { Ionicons } from '@expo/vector-icons'
import { HeaderBackButton } from '@react-navigation/stack'
import React, { useEffect } from 'react'
import { View, Text, ScrollView, Pressable } from 'react-native'
import Image from 'react-native-ui-lib/image'
import { Order } from '../../../constants/Types/OrderTypes'

const OrderDetailsScreen = (props: any) => {
    const { item } = props.route.params
    useEffect(() => {
        props.navigation.setOptions({
            title: item.productName
        })
    }, []);

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={{ width: '100%', height: 400, position: "relative" }}>
                <Image
                    source={{ uri: item.productImage }}
                    style={{ width: '100%', height: 400, resizeMode: 'cover', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginTop: 0, }}
                />

                <View style={{ backgroundColor: '#000', opacity: 0.5, width: '100%', height: 400, position: 'absolute' }}></View>
                <Text style={{ color: "#fff", position: 'absolute', bottom: 0, fontSize: 30, fontFamily: 'segoe-bold', marginBottom: 10, marginStart: 10 }}>{item.productName}</Text>
            </View>
            <Pressable
                style={{ width: 50, height: 50, backgroundColor: '#ccc', position: 'absolute', marginTop: 10, marginStart: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
                onPress={() => props.navigation.goBack()}
                android_ripple={{ color: "#fff", radius: 25, }}

            >
                <Ionicons name="arrow-back" size={24} color="#000" />
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
        </ScrollView>
    )
}

export default OrderDetailsScreen
