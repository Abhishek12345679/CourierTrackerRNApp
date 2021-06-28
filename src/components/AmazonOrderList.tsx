import React from 'react'
import { View, Text, ListRenderItem } from 'react-native'
import { AmazonOrderList as AmazonOrderListType } from '../../constants/Types/OrderTypes'
import AmazonOrderItem from './AmazonOrderItem'

const AmazonOrderList: ListRenderItem<AmazonOrderListType> = ({ item, index, separators, goToOverview }) => {
    const ETA = new Date(parseInt(item.EstimatedDeliveryTime)).toDateString()
    return (
        <View>
            <Text onPress={goToOverview} style={{ color: "#fff", fontFamily: 'segoe-bold', fontSize: 18, marginTop: 15, marginStart: 15 }}>{ETA}</Text>
            {item.orderItems && item.orderItems.map((order, i) => (
                <AmazonOrderItem
                    key={order.orderId}
                    item={order}
                    index={i}
                    separators={separators}
                />
            ))}
        </View>
    )
}

export default AmazonOrderList
