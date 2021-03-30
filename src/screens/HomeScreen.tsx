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

    type Credentials = {
        access_token: string;
        refresh_token: string;
        scope: string;
        token_type: string;
        expiry_date: number;
    }

    const [auth, setAuth] = useState<Credentials>()
    // const quotes = '&#34;'
    // const quotesPattern = new RegExp(quotes, 'g')
    // const tokens = auth.replace(quotesPattern, "\"")

    const [orders, setOrders] = useState<Order[]>()
    const [amazonInvoices, setAmazonInvoices] = useState<[]>()


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

    const downloadInvoices = (downloadLink: string) => {
        // FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'invoices/', { intermediates: true });
        FileSystem.downloadAsync(
            downloadLink,
            FileSystem.documentDirectory + `${uuid.v4()}.pdf`
        )
            .then(({ uri }) => {
                // const formdata = new FormData();
                // formdata.append("file", uri);
                // console.log('Finished downloading to ', uri);
                // fetch(`${sensitiveData.baseUrl}/multipart-upload`, {
                //     method: 'PATCH',
                //     // headers: {
                //     //     'Accept': 'multipart/form-data',
                //     //     'Content-Type': 'multipart/form-data'
                //     // },
                //     body: formdata,

                // }).then(response => response.text())
                //     .then(result => console.log(result))
                //     .catch(error => console.log('error', error));
                FileSystem.uploadAsync(`${sensitiveData.baseUrl}/multipart-upload`, uri, {
                    httpMethod: "PATCH",
                    sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
                    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                    fieldName: 'file',
                    mimeType: 'multipart/form-data'
                }).then((res) => { res.status }).then((data) => console.log(data))

            })
            .catch(error => {
                console.error(error);
            });

    }

    const getFlipkartOrders = async () => {
        const FKResponse = await fetch(`${sensitiveData.baseUrl}/getFlipkartOrderDetails?tokens=${JSON.stringify(auth)}`)
        const FlipkartOrders = await FKResponse.json()

        console.log(JSON.stringify(FlipkartOrders, null, 2))
        setOrders(FlipkartOrders.flipkartOrders)
    }

    const getAmazonInvoices = async () => {
        /** 
         *  check the keep me signed in check box
         * check the box where it says do not ask for OTP on this device from now on
        */
        const AZResponse = await fetch(`${sensitiveData.baseUrl}/getAmazonInvoiceLink?tokens=${JSON.stringify(auth)}`)
        const AmazonInvoices = await AZResponse.json()

        console.log(JSON.stringify(AmazonInvoices, null, 2))
        setAmazonInvoices(AmazonInvoices.invoiceLinks)
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
            {amazonInvoices && amazonInvoices?.map((invoices, i) => (
                <Text
                    key={i}
                    style={{ fontSize: 40 }}
                    // onPress={() => Linking.openURL(decodeURIComponent(invoices))}
                    onPress={() => { downloadInvoices(invoices) }}
                >
                    Link: {i + 1}
                </Text>
            ))

            }
        </ScrollView>
    )
}

export default HomeScreen


