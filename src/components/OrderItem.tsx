import React from 'react'
import { View, Text, Pressable, Linking, ListRenderItem } from 'react-native'
import { Image } from 'react-native-ui-lib'
import { Order } from '../../constants/Types/OrderTypes'

const OrderItem: ListRenderItem<Order> = ({ item, index }) => {
    return (
        <Pressable
            android_ripple={{ color: '#ccc', radius: 250, borderless: false }}
            style={{ flex: 1, flexDirection: 'row', height: 100, marginTop: 15, backgroundColor: '#745f81', borderRadius: 7, marginLeft: 10, marginRight: 10, justifyContent: 'space-between', alignItems: 'center' }}
            onPress={() => { }}
            key={index}
        >
            <Image source={{ uri: item.productImage }} style={{ height: 80, width: 80, marginStart: 8, borderRadius: 5, flex: 1 }} />
            <View style={{ flex: 4 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 5, color: '#fff', marginEnd: 10, marginStart: 10 }}>{item.productName}</Text>
                <View style={{ flexDirection: "row", alignItems: 'center' }}>
                    <View style={{ width: 75, height: 35, marginBottom: 5, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginStart: 10, marginTop: 5 }}>
                        <Text style={{ flexShrink: 1, color: '#fff', fontWeight: 'bold', fontSize: 15 }}>₹{item.productPrice.replace("b\x02(.", "")}</Text>
                    </View>
                    <Pressable android_ripple={{ color: '#ccc', radius: 250, borderless: false }}
                        style={{ flexDirection: 'row', width: 200, height: 35, backgroundColor: "#fff", marginEnd: 30, elevation: 100, borderRadius: 5, alignItems: 'center', justifyContent: "center", marginStart: 20 }}
                        onPress={() => { }}>
                        <Image source={require('../Assets/Icons/siri.png')} style={{ width: 25, height: 25, marginEnd: 10 }} />
                        <Text style={{ fontFamily: 'segoe-bold', fontSize: 15 }}>Add to Calendar</Text>
                    </Pressable>
                </View>
            </View>

        </Pressable>

    )
}

export default OrderItem
