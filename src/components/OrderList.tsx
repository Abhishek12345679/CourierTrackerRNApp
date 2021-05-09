import React from 'react'
import { View, Text, ListRenderItem } from 'react-native'
import { Avatar } from 'react-native-ui-lib'
import { AmazonOrder } from '../screens/AmazonOrdersScreen'
import { Order as FlipkartOrder } from '../../constants/Types/OrderTypes'
import OrderItem from './OrderItem'

const OrderList: ListRenderItem<FlipkartOrder> = ({ item, index }) => {
    return (
        // <View style={{ borderWidth: 1, borderColor: "#000" }}>
        //     {/* <Text>{item.orderNumber}</Text>
        //     <Text>{item.totalPrice}</Text> */}
        //     {
        //         item.orderItems.map((item: any, index: number) => (
        //             <View style={{ flexDirection: "row" }}>
        //                 <Avatar size={55} source={{ uri: item.productImage }} />
        //                 <View>
        //                     <Text>Name:{item.productName}</Text>
        //                     <Text>{item.ETA}</Text>
        //                 </View>
        //             </View>
        //         ))
        //     }
        // </View>
        <View></View>
    )
}

export default OrderList
