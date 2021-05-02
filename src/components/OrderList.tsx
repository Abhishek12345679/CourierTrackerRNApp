import React from 'react'
import { View, Text, ListRenderItem } from 'react-native'
import { AmazonOrder } from '../screens/AmazonOrdersScreen'
import { Order as FlipkartOrder } from '../screens/FlipkartOrdersScreen'

const OrderList: ListRenderItem<FlipkartOrder> = ({ item, index }) => {
    return (
        <View style={{ borderWidth: 1, borderColor: "#000" }}>
            <Text>{item.orderNumber}</Text>
            <Text>{item.totalPrice}</Text>
            {
                item.orderItems.map((item: any, index: number) => (
                    <View>
                        <Text>Name:{item.productName}</Text>
                        <Text>{item.ETA}</Text>
                    </View>
                ))
            }
        </View>
    )
}

export default OrderList
