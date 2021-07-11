import React, { useEffect, useState } from 'react'

import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { Datepicker, Input } from '@ui-kitten/components'
import { Formik } from 'formik'
import { useRef } from 'react'
import { View, Text, ScrollView, Image, Dimensions, Pressable, ActivityIndicator } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-ui-lib'
import SettingsListItem from '../../components/SettingsListItem'
import SwitchGroup from '../../components/SwitchGroup'

import database from '@react-native-firebase/database';
import store from '../../store/store'

import * as Calendar from 'expo-calendar'
import { createCalendar } from '../../components/OrderItem'

import storage from '@react-native-firebase/storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import Firebase from '@react-native-firebase/app'

const AddOrderScreen = ({ navigation }: any) => {

    const addToCalendarRef = useRef({})
    const formRef = useRef({})

    const [loading, setLoading] = useState(false)

    // TODO: one new manual order addition rerender the screen (useFocusEffect) or use the real times changes while fetching from rnfb-realtime-database
    const uploadImageAsync = (uri: string, fileName: string) => {
        setLoading(true);
        const ref = storage().ref(`${store.loginCredentials.uid}/productImages`).child(`${fileName}`)
        const uploadTask = ref.putFile(uri)

        return uploadTask.on(
            Firebase.storage.TaskEvent.STATE_CHANGED,
            (s) => {
                // var progress = (s.bytesTransferred / s.totalBytes) * 100;
                // console.log("Upload is " + progress + "% done");
                // switch (s.state) {
                //     case Firebase.storage.TaskState.PAUSED: // or 'paused'
                //         console.log("Upload is paused");
                //         break;
                //     case Firebase.storage.TaskState.RUNNING: // or 'running'
                //         console.log("Upload is running");
                //         break;
                // }
            },
            (error) => {
                console.log(error);
                setLoading(false)
                return;
            },
            () => {
                uploadTask.snapshot!.ref.getDownloadURL().then((downloadURL) => {
                    formRef.current.setFieldValue('productImage', downloadURL)
                    setLoading(false)
                });
            }
        );
    };

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

    const formatDate = (ETA: string): string => {
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        const date = (new Date(ETA).getDate()).toString()
        const month = months[new Date(ETA).getMonth()]
        const year = (new Date(ETA).getFullYear()).toString()

        const formattedDate = `${date} ${month} ${year}`
        return formattedDate
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable
                    android_ripple={{ color: "#121212", radius: 20 }}
                    style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#d8d6d6', justifyContent: 'center', alignItems: 'center', marginEnd: 20 }}
                    onPress={() => {
                        // navigation.navigate("HomeScreen", {
                        //     from: "AddOrderScreen"
                        // })

                        const onSubmit = async () => {

                            const callReminder = addToCalendarRef.current.values.callReminder
                            const order = formRef.current.values

                            const orderId = stringToUUID(order.productName + order.orderNumber + order.quantity)
                            const formattedDate = formatDate(order.ETA)

                            order.callReminder =  callReminder
                            order.orderId = orderId
                            order.ETA = formattedDate

                            database()
                                .ref(`/users/${store.loginCredentials.uid}/orders`)
                                .child(orderId)
                                .set(order)
                                .then(() => {
                                    console.log('Data set.')
                                    store.updateManualOrders()
                                    navigation.navigate("HomeScreen", {
                                        from: "AddOrderScreen"
                                    })
                                });
                        }
                        onSubmit()
                    }
                    }>
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
                        productImage: `https://img.freepik.com/free-vector/black-white-hypnotic-background-abstract-seamless-pattern-illustration_118124-3765.jpg?size=1024&ext=jpg`,
                        sellerName: "",
                        // deliveryCharges: "",
                        ETA: "",
                        quantity: "",
                        // deliveryDiscount: "",
                        productPrice: "",
                        productLink: "",
                        totalPrice: "",
                        from: "",
                    }}
                    onSubmit={() => { }}
                    innerRef={formRef}
                >
                    {({ handleChange, handleSubmit, values, setFieldValue }) => (
                        <>
                            <View style={{ width: '100%', height: 400, position: 'relative', backgroundColor: "#121212" }}>
                                {!loading ?
                                    <Image
                                        source={{ uri: values.productImage }}
                                        style={{ width: '100%', height: 400, resizeMode: 'cover', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginTop: 0, backgroundColor: "#121212" }}
                                    /> :
                                    (<View style={{
                                        width: '100%',
                                        height: 400,
                                        borderBottomLeftRadius: 20,
                                        borderBottomRightRadius: 20,
                                        marginTop: 0,
                                        backgroundColor: "#121212",
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <ActivityIndicator color="#fff" size="large" />
                                    </View>)
                                }
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
                                    }}
                                    onPress={async () => {
                                        launchCamera({
                                            mediaType: 'photo',
                                            quality: 0.6,
                                            cameraType: 'back',
                                            includeBase64: true,
                                            saveToPhotos: false,
                                        }, async (response) => {
                                            if (!response.didCancel) {
                                                if (response !== undefined) {
                                                    const imageUrl = response.assets[0].uri!
                                                    const fileName = response.assets[0].fileName!
                                                    uploadImageAsync(imageUrl, fileName)
                                                }

                                            }
                                        })
                                    }}
                                >
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

                            <Datepicker
                                placement="top"
                                label="Estimated Delivery Time"
                                placeholder="Select the estimated date of arrival (only one)"
                                controlStyle={{ backgroundColor: "#8b8a8a2c", }}
                                style={{ marginHorizontal: 10, marginVertical: 10 }}
                                size="large"
                                date={values.ETA}
                                onSelect={(date) => setFieldValue('ETA', date)} />

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

            <Formik
                initialValues={{
                    callReminder: false
                }}
                onSubmit={() => { }}
                innerRef={addToCalendarRef}
            >
                {({  values, setFieldValue }) => (
                    <SwitchGroup
                        label="Add to Calendar"
                        toggleStatus={values.callReminder}
                        onValueChange={(value: boolean) => setFieldValue('callReminder', value)}
                        bgColor="#333333"
                        height={75}
                    />)}
            </Formik>

        </View>
    )
}

export default AddOrderScreen
