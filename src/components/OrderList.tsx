import React from 'react'
import { View, Text, ListRenderItem } from 'react-native'
import { Order, OrderList as OrderListType } from '../../constants/Types/OrderTypes'
import OrderItem from './OrderItem'

const OrderList: ListRenderItem<OrderListType> = ({ item, index, separators }) => {
    const ETA = new Date(parseInt(item.EstimatedDeliveryTime)).toDateString()
    return (
        <View>
            <Text style={{ color: "#fff", fontFamily: 'segoe-bold', fontSize: 18, marginTop: 15, marginStart: 15 }}>{ETA}</Text>
            {item.orderItems.map((order, i) => (
                <OrderItem item={order} index={i} separators={separators} />
            ))}
        </View>
    )
}

export default OrderList
