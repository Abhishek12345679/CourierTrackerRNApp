import React from 'react'
import { View, Text, ListRenderItem } from 'react-native'
import { OrderList as OrderListType } from '../../constants/Types/OrderTypes'
import OrderItem from './OrderItem'

const OrderList: ListRenderItem<OrderListType> = ({ item, index, separators, goToOverview }) => {
    const ETA = new Date(parseInt(item.EstimatedDeliveryTime)).toDateString()
    return (
        <View style={{ marginBottom: 15 }}>
            <Text onPress={goToOverview} style={{ color: "#fff", fontFamily: 'segoe-bold', fontSize: 18, marginTop: 15, marginStart: 25 }}>{ETA}</Text>
            {item.orderItems && item.orderItems.map((order, i) => (
                <OrderItem
                    key={order.orderId}
                    item={order}
                    index={i}
                    separators={separators} />
            ))}
        </View>
    )
}

export default OrderList
