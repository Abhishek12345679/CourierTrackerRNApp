import React from 'react'
import { View, Text, ListRenderItem } from 'react-native'
import { Order, OrderList as OrderListType } from '../../constants/Types/OrderTypes'
import OrderItem from './OrderItem'

const OrderList: ListRenderItem<OrderListType> = ({ item, index, separators, openCalendarDialog, goToOverview }) => {
    const ETA = new Date(parseInt(item.EstimatedDeliveryTime)).toDateString()
    return (
        <View>
            <Text onPress={goToOverview} style={{ color: "#fff", fontFamily: 'segoe-bold', fontSize: 18, marginTop: 15, marginStart: 15 }}>{ETA}</Text>
            {item.orderItems.map((order, i) => (
                <OrderItem key={order.orderId} item={order} index={i} separators={separators} openCalendarDialog={openCalendarDialog} />
            ))}
        </View>
    )
}

export default OrderList
