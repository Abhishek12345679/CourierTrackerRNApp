import React, { useState } from 'react'
import { View, Text, Pressable, Image, ScrollView, TouchableOpacity, Linking } from 'react-native'

const HomeScreen: React.FC = (props: any) => {

    type Order = {
        totalPrice: string;
        orderNumber: string;
        orderItems: [
            {
                productName: string;
                productImage: string;
                sellerName: string;
                deliveryCharges: string;
                ETA: string;
                quantity: string;
                deliveryDiscount: string;
                productPrice: string;
                productLink: string;
            }
        ];
    };

    const auth: string = props.route.params.auth
    // console.log(JSON.parse(auth))

    const quotes = '&#34;'
    const quotesPattern = new RegExp(quotes, 'g')

    const tokens = auth.replace(quotesPattern, "\"")
    // const tokenObject = JSON.parse(correctedString)

    const [orders, setOrders] = useState<[Order]>()
    const [amazonInvoices, setAmazonInvoices] = useState<[]>()

    const getFlipkartOrders = async () => {
        const FKResponse = await fetch(`https://ff900f4cc352.ngrok.io/getFlipkartOrderDetails?tokens=${tokens}`)
        const FlipkartOrders = await FKResponse.json()

        console.log(JSON.stringify(FlipkartOrders, null, 2))
        setOrders(FlipkartOrders.flipkartOrders)
    }

    const getAmazonInvoices = async () => {
        /** 
         *  check the keep me signed in check box
         * check the box where it says do not ask for OTP on this device from now on
        */



        const AZResponse = await fetch(`https://ff900f4cc352.ngrok.io/getAmazonInvoiceLink?tokens=${tokens}`)
        const AmazonInvoices = await AZResponse.json()

        console.log(JSON.stringify(AmazonInvoices, null, 2))
        setAmazonInvoices(AmazonInvoices.invoiceLinks)
    }

    return (
        <ScrollView style={{ flex: 1 }}>
            <Pressable onPress={getFlipkartOrders} android_ripple={{ color: '#ccc', borderless: false, }}
                style={{
                    backgroundColor: 'black',
                    borderRadius: 10,
                    width: 200,
                    height: 70,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginStart: 10
                }}>
                <Text style={{ color: "#fff" }}>Get Flipkart Orders</Text>
            </Pressable>

            <Pressable onPress={getAmazonInvoices} android_ripple={{ color: '#ccc', borderless: false, }}
                style={{
                    backgroundColor: 'black',
                    borderRadius: 10,
                    width: 200,
                    height: 70,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginStart: 10
                }}>
                <Text style={{ color: "#fff" }}>Get Amazon Invoices</Text>
            </Pressable>

            {orders &&
                orders.map((order, i) => (
                    <View>
                        <Text>{order.totalPrice}</Text>
                        <Text>{order.orderNumber}</Text>

                        {
                            order.orderItems.map((item, i) => (
                                <View style={{ height: 200, width: '100%' }}>
                                    <Text>{item.productName}</Text>
                                    <TouchableOpacity
                                        style={{ height: 100, width: 100 }}
                                        onPress={() => Linking.openURL(item.productLink)}
                                    >
                                        <Image source={{ uri: item.productImage }} style={{ height: 100, width: 100 }} />
                                    </TouchableOpacity>

                                </View>
                            ))
                        }
                    </View>
                ))
            }
            {amazonInvoices && amazonInvoices?.map((invoices, i) => (
                <Text style={{ fontSize: 40 }} onPress={() => Linking.openURL(invoices)}>Link: {i + 1}</Text>
            ))

            }
        </ScrollView>
    )
}

export default HomeScreen


