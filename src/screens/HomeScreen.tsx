import React, { useState, useEffect } from 'react'
import { View, Text, Pressable, Image, ScrollView, TouchableOpacity, Linking, Button } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { sensitiveData } from '../../constants/sen_data';

import { FileSystem, Constants } from 'react-native-unimodules'

const uuid = require('react-native-uuid')

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

    type AmazonOrder = {
        totalPrice: string;
        orderNumber: string;
        ETA: string;
        delivery_address: string;
        invoiceLink: string
    };

    type Credentials = {
        access_token: string;
        refresh_token: string;
        scope: string;
        token_type: string;
        expiry_date: number;
    }

    const [auth, setAuth] = useState<Credentials>()
    const [orders, setOrders] = useState<Order[]>()
    const [amazonOrders, setAmazonOrders] = useState<[]>()


    const getCredentials = async () => {
        try {
            const creds = await AsyncStorage.getItem('credentials')
            console.log("saved creds: ", creds);
            return creds != null ? JSON.parse(creds!) : null
        } catch (e) {
            // read error
            console.log(e)
        }

        console.log('Done.')

    }

    // const downloadInvoices = (downloadLinks: string[]) => {
    //     console.log(downloadLinks)
    //     const links = downloadLinks.map((link, i) => (
    //         FileSystem.downloadAsync(
    //             link,
    //             FileSystem.documentDirectory + `${uuid.v4()}.pdf`
    //         ).then(({ uri }) => uri))
    //     )

    //     Promise.all(links).then((uriList) => {
    //         console.log(uriList)
    //         if (uriList) {
    //             uriList.map((uri, i) => {
    //                 console.log(uri)
    //                 FileSystem.uploadAsync(`${sensitiveData.baseUrl}/multipart-upload`, uri, {
    //                     httpMethod: "PATCH",
    //                     sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
    //                     uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    //                     fieldName: 'file',
    //                     mimeType: 'multipart/form-data'
    //                 }).then((res) => { console.log(res.status) })
    //             })
    //         }
    //     }).then(() => {
    //         console.log("success!")

    //     }).catch((err) => {
    //         console.log(err)
    //     })


    // }

    const getFlipkartOrders = async () => {
        const FKResponse = await fetch(`${sensitiveData.baseUrl}/getFlipkartOrderDetails?tokens=${JSON.stringify(auth)}`)
        const FlipkartOrders = await FKResponse.json()

        console.log(JSON.stringify(FlipkartOrders, null, 2))
        setOrders(FlipkartOrders.flipkartOrders)
    }

    const getAmazonOrders = async () => {
        const AZResponse = await fetch(`${sensitiveData.baseUrl}/getAmazonOrdersDetails?tokens=${JSON.stringify(auth)}`)
        const AmazonInvoices = await AZResponse.json()

        console.log(JSON.stringify(AmazonInvoices, null, 2))
        setAmazonOrders(AmazonInvoices.invoiceLinks)
    }

    useEffect(() => {
        getCredentials().then((creds) => {
            console.log("Creds: ", creds)
            setAuth(creds as Credentials)
        })

    }, [])

    return (
        <ScrollView style={{ flex: 1 }}>
            <Text style={{ color: "#000" }}>{Constants.deviceName!}</Text>
            <Text style={{ color: "#000" }} onPress={() => Linking.openURL('com.amazon.mobile.shopping://www.amazon.in/orders/407-7191539-6151544')}>Link</Text>

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

            <Pressable onPress={getAmazonOrders} android_ripple={{ color: '#ccc', borderless: false, }}
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

            <Button title="Logout" onPress={() => {
                AsyncStorage.removeItem('credentials')
            }} />

            {orders &&
                orders.map((order, i) => (
                    <View key={i}>
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
            {amazonOrders && amazonOrders?.map((order, i) => (
                <Text
                    key={i}
                    style={{ fontSize: 40 }}
                // onPress={() => Linking.openURL(`com.amazon.mobile.shopping://www.amazon.in/orders/${order.orderNumber}`)}
                // onPress={() => downloadInvoices(["http://www.africau.edu/images/default/sample.pdf", "http://www.africau.edu/images/default/sample.pdf", "http://www.africau.edu/images/default/sample.pdf"])}
                >
                    Link: {i + 1}
                </Text>
            ))
            }
        </ScrollView>
    )
}

export default HomeScreen


