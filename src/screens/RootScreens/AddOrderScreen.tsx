import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { Input } from '@ui-kitten/components'
import { Formik } from 'formik'
import React, { useEffect } from 'react'
import { useRef } from 'react'
import { View, Text, ScrollView, Image, Dimensions, Pressable } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-ui-lib'
import SettingsListItem from '../../components/SettingsListItem'
import SwitchGroup from '../../components/SwitchGroup'

import database from '@react-native-firebase/database';
import store from '../../store/store'

import * as Calendar from 'expo-calendar'
import { createCalendar } from '../../components/OrderItem'

const AddOrderScreen = ({ navigation }: any) => {

    const addToCalendarRef = useRef({})
    const formRef = useRef({})

    const addEventToCalendar = async (productName: string, ETA: string, orderId: string) => {
        const id = await createCalendar()
        // console.log("id: ", id)
        const event = await Calendar.createEventAsync(id, {
            title: productName,
            startDate: new Date(ETA),
            endDate: new Date(ETA)
        })
        store.setCalendarEventId(event, orderId, Date.parse(ETA).toString())
        return event
        // await AsyncStorage.setItem('orders', JSON.stringify(store.orders))
        // console.log(event)
        // Calendar.openEventInCalendar(event)
    }

    const stringToUUID = (str: string) => {
        if (str === undefined || !str.length)
            str = "" + Math.random() * new Date().getTime() + Math.random();

        let c = 0,
            r = "";

        for (let i = 0; i < str.length; i++)
            c = (c + (str.charCodeAt(i) * (i + 1) - 1)) & 0xfffffffffffff;

        str =
            str.substr(str.length / 2) + c.toString(16) + str.substr(0, str.length / 2);
        for (let i = 0, p = c + str.length; i < 32; i++) {
            if (i == 8 || i == 12 || i == 16 || i == 20) r += "-";

            c = p = str[(i ** i + p + 1) % str.length].charCodeAt(0) + p + i;
            if (i == 12) c = (c % 5) + 1;
            //1-5
            else if (i == 16) c = (c % 4) + 8;
            //8-B
            else c %= 16; //0-F

            r += c.toString(16);
        }
        return r;
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable
                    android_ripple={{ color: "#121212", radius: 20 }}
                    style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#d8d6d6', justifyContent: 'center', alignItems: 'center', marginEnd: 20 }}
                    onPress={async () => {
                        const addToCal = addToCalendarRef.current.values.add_to_calendar
                        const order = formRef.current.values
                        const orderId = stringToUUID(order.productName + order.orderNumber + order.quantity)

                        console.log(orderId)

                        let eventId = ""
                        if (addToCal) {
                            eventId = await addEventToCalendar(order.productName, order.ETA, orderId)
                        }
                        order.orderId = orderId
                        order.calendarEventId = eventId

                        database()
                            .ref(`/users/${store.loginCredentials.uid}/orders`)
                            .child(orderId)
                            .set(order)
                            .then(() => {
                                console.log('Data set.')
                                navigation.pop()
                            });
                    }}>
                    <MaterialIcons name="done" size={24} />
                </Pressable>
            ),
        })
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <KeyboardAwareScrollView
                style={{ backgroundColor: "#121212", flex: 1 }}>

                <Formik
                    initialValues={{
                        orderNumber: "",
                        productName: "",
                        productImage: "",
                        sellerName: "",
                        // deliveryCharges: "",
                        ETA: "",
                        quantity: "",
                        // deliveryDiscount: "",
                        productPrice: "",
                        productLink: "",
                        totalPrice: "",
                        from: "",
                        // calendarEventId: "",
                    }}
                    onSubmit={() => { }}
                    innerRef={formRef}
                >
                    {({ handleChange, handleSubmit, values, setFieldValue }) => (
                        <>
                            <View style={{ width: '100%', height: 400, position: 'relative', backgroundColor: "#121212" }}>
                                <Image
                                    source={{ uri: `https://img.freepik.com/free-vector/black-white-hypnotic-background-abstract-seamless-pattern-illustration_118124-3765.jpg?size=1024&ext=jpg` }}
                                    style={{ width: '100%', height: 400, resizeMode: 'cover', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginTop: 0, backgroundColor: "#121212" }}
                                />
                                <View style={{ backgroundColor: '#000', opacity: 0.35, width: '100%', height: 400, position: 'absolute' }}></View>
                                <Pressable
                                    android_ripple={{ color: "#fff", radius: 25, }}
                                    style={{
                                        width: 80,
                                        height: 40,
                                        borderRadius: 15,
                                        shadowColor: "#ccc",
                                        shadowOpacity: 0.25,
                                        shadowRadius: 20,
                                        position: 'absolute',
                                        bottom: 0,
                                        marginBottom: 10,
                                        marginEnd: 10,
                                        right: 0,
                                        backgroundColor: "#020100",
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                    <FontAwesome name="camera" size={20} color="#fff" />
                                </Pressable>

                            </View>
                            <Input
                                autoCorrect={false}
                                autoCapitalize="none"
                                label="Order Number / ID"
                                size="large"
                                style={{ fontSize: 17, fontWeight: 'bold', backgroundColor: "#8b8a8a2c", padding: 10 }}
                                textStyle={{ height: 30, color: '#bdb8b8' }}
                                placeholder="Enter the Order Number / ID"
                                value={values.orderNumber}
                                onChangeText={handleChange('orderNumber')}
                            />
                            <Input
                                autoCorrect={false}
                                autoCapitalize="none"
                                label="Product Name"
                                size="large"
                                style={{ fontSize: 17, fontWeight: 'bold', backgroundColor: "#8b8a8a2c", padding: 10 }}
                                textStyle={{ height: 30, color: '#bdb8b8' }}
                                placeholder="Enter the Product Name"
                                value={values.productName}
                                onChangeText={handleChange('productName')}
                            />
                            {/* <Input
                                autoCorrect={false}
                                autoCapitalize="none"
                                label="Estimated Delivery Time"
                                size="large"
                                style={{ fontSize: 17, fontWeight: 'bold', backgroundColor: "#8b8a8a2c", padding: 10 }}
                                textStyle={{ height: 30, color: '#bdb8b8' }}
                                placeholder="Enter the ETA"
                                value={values.ETA}
                                onChangeText={handleChange('ETA')}
                            /> */}



                            <Input
                                autoCorrect={false}
                                autoCapitalize="none"
                                label="Product Price"
                                size="large"
                                style={{ fontSize: 17, fontWeight: 'bold', backgroundColor: "#8b8a8a2c", padding: 10 }}
                                textStyle={{ height: 30, color: '#bdb8b8' }}
                                placeholder="Enter the Product Price"
                                value={values.productPrice}
                                onChangeText={handleChange('productPrice')}
                            />

                            <Input
                                autoCorrect={false}
                                autoCapitalize="none"
                                label="Seller Name"
                                size="large"
                                style={{ fontSize: 17, fontWeight: 'bold', backgroundColor: "#8b8a8a2c", padding: 10 }}
                                textStyle={{ height: 30, color: '#bdb8b8' }}
                                placeholder="Enter the seller name"
                                value={values.sellerName}
                                onChangeText={handleChange('sellerName')}
                            />
                            <Input
                                autoCorrect={false}
                                autoCapitalize="none"
                                label="Quantity"
                                size="large"
                                style={{ fontSize: 17, fontWeight: 'bold', backgroundColor: "#8b8a8a2c", padding: 10 }}
                                textStyle={{ height: 30, color: '#bdb8b8' }}
                                placeholder="Enter the quantity"
                                value={values.quantity}
                                onChangeText={handleChange('quantity')}
                            />
                            <Input
                                autoCorrect={false}
                                autoCapitalize="none"
                                label="From"
                                size="large"
                                style={{ fontSize: 17, fontWeight: 'bold', backgroundColor: "#8b8a8a2c", padding: 10 }}
                                textStyle={{ height: 30, color: '#bdb8b8' }}
                                placeholder="Enter the Site you bought it from."
                                value={values.from}
                                onChangeText={handleChange('from')}
                            />
                            <Input
                                autoCorrect={false}
                                autoCapitalize="none"
                                label="Product Link"
                                size="large"
                                style={{ fontSize: 17, fontWeight: 'bold', backgroundColor: "#8b8a8a2c", padding: 10 }}
                                textStyle={{ height: 30, color: '#bdb8b8' }}
                                placeholder="Paste the link of the product"
                                value={values.productLink}
                                onChangeText={handleChange('productLink')}
                            />
                            <Input
                                autoCorrect={false}
                                autoCapitalize="none"
                                label="Total Product Price"
                                size="large"
                                style={{ fontSize: 17, fontWeight: 'bold', backgroundColor: "#8b8a8a2c", padding: 10 }}
                                textStyle={{ height: 30, color: '#bdb8b8' }}
                                placeholder="Enter the Product Name"
                                value={values.totalPrice}
                                onChangeText={handleChange('totalPrice')}
                            />


                        </>
                    )}
                </Formik>
            </KeyboardAwareScrollView>
            {/* <View style={{ width: "100%", justifyContent: "center", alignItems: 'center', height: 70 }}>
                <View style={{ overflow: 'hidden', backgroundColor: "#8b8a8a2c", width: "100%" }}> */}
            <Formik
                initialValues={{
                    add_to_calendar: false
                }}
                onSubmit={() => { }}
                innerRef={addToCalendarRef}
            >
                {({ handleChange, handleSubmit, values, setFieldValue }) => (
                    <SwitchGroup
                        label="Add to Calendar"
                        toggleStatus={values.add_to_calendar}
                        onValueChange={(value: boolean) => setFieldValue('add_to_calendar', value)}
                        bgColor="#333333"
                        height={75}
                    />)}
            </Formik>

        </View>
    )
}

export default AddOrderScreen
