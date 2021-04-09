import React from 'react'
import { View, Text, Pressable, Linking, ListRenderItem } from 'react-native'
import { AmazonOrder } from '../screens/AmazonOrdersScreen'
import { Order } from '../screens/FlipkartOrdersScreen'

const OrderItem: ListRenderItem<AmazonOrder | Order> = ({ item, index }) => {
    return (
        <Pressable
            android_ripple={{ color: '#000000', radius: 400 }}
            style={{ flex: 1, flexDirection: 'row', height: 150, marginTop: 15, backgroundColor: 'white', borderRadius: 7, marginLeft: 20, marginRight: 20, justifyContent: 'center', alignItems: 'center' }}
            // onPress={() => Linking.openURL(`com.amazon.mobile.shopping://www.amazon.in/orders/${item.orderNumber}`)}
            key={index}
        >
            <View style={{ flex: 2, width: '15%', }}>
                <View style={{ width: 100, height: 100, backgroundColor: '#343a40', borderRadius: 50, marginLeft: 5 }}>

                </View>
            </View>
            <View style={{ flex: 5, }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>#{item.orderNumber}</Text>
                <Text style={{ marginBottom: 5 }}>Will reach you by {item.ETA}</Text>
                <View style={{ width: 65, height: 25, marginBottom: 5, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                    <Text style={{ flexShrink: 1, color: '#fff', fontWeight: 'bold' }}>₹{item.totalPrice}</Text>
                </View>
            </View>
        </Pressable>
    )
}

export default OrderItem
