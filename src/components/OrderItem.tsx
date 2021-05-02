import React from 'react'
import { View, Text, Pressable, Linking, ListRenderItem } from 'react-native'
import { Avatar } from 'react-native-ui-lib'
import { AmazonOrder } from '../screens/AmazonOrdersScreen'
import { Order as FlipkartOrder } from '../screens/FlipkartOrdersScreen'

const OrderItem: ListRenderItem<FlipkartOrder | AmazonOrder> = ({ item, index }) => {
    return (
        <Pressable
            android_ripple={{ color: '#ccc', radius: 200, borderless: false }}
            style={{ flex: 1, flexDirection: 'row', height: 120, marginTop: 15, backgroundColor: '#000', borderRadius: 7, marginLeft: 20, marginRight: 20, justifyContent: 'space-around', alignItems: 'center' }}
            onPress={() => Linking.openURL(``)}
            key={index}
        >
            <Avatar size={75} animate />
            <View style={{ flex: 5, }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 5, color: '#fff' }}>#{item.orderNumber}</Text>
                {/* <Text style={{ marginBottom: 5 }}>Will reach you by {item.totalPrice}</Text> */}
                <View style={{ width: 65, height: 25, marginBottom: 5, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                    <Text style={{ flexShrink: 1, color: '#fff', fontWeight: 'bold' }}>₹{item.totalPrice}</Text>
                </View>
            </View>
        </Pressable>
    )
}

export default OrderItem
