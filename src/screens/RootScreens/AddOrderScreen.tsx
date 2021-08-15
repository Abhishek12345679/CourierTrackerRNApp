import React, { useEffect, useState } from 'react'

import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Button, Card, Datepicker, Input, Modal } from '@ui-kitten/components'
import { Formik } from 'formik'
import { useRef } from 'react'
import { View, Text, ScrollView, Image, Dimensions, Pressable, ActivityIndicator } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-ui-lib'
import SwitchGroup from '../../components/SwitchGroup'

import database from '@react-native-firebase/database';
import store from '../../store/store'
import * as yup from 'yup'

import storage from '@react-native-firebase/storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import Firebase from '@react-native-firebase/app'
import { NotificationInfo, Order } from '../../../constants/Types/OrderTypes'
import { callReminder } from '../../helpers/notificationHelpers'

const AddOrderScreen = ({ navigation }: any) => {

    const addToCalendarRef = useRef({})
    const formRef = useRef({})

    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false)

    const ValidationSchema = yup.object().shape({
        orderNumber: yup
            .string()
            .matches(/^[a-zA-Z0-9-]*$/, "invalid ordernumber")
            .required('Order Number is required'),
        productName: yup
            .string()
            .required('Product Name is required'),
        productLink: yup.string().url('Not an URL').required('Enter Product Link'),
        ETA: yup.string().required('Enter ETA'),
        productPrice: yup.string().matches(/^\d*.\d*$/, "not a valid price").required('Enter Product Price'),
        sellerName: yup.string().notRequired(),
        quantity: yup.string().matches(/^\d{1,2}$/, "Not a valid quantity").required("Enter Quantity"),
        from: yup.string().notRequired(),
        totalPrice: yup.string().matches(/^\d*.\d*$/, "Not a valid price").required("Enter Total Order Price")
    })

    const uploadImageAsync = (uri: string, fileName: string) => {
        setLoading(true);
        const ref = storage().ref(`${store.loginCredentials.uid}/productImages`).child(`${fileName}`)
        const uploadTask = ref.putFile(uri)

        return uploadTask.on(
            Firebase.storage.TaskEvent.STATE_CHANGED,
            (s) => { },
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
                    disabled={!formRef.current.isValid}
                    android_ripple={{ color: "#121212", borderless: false }}
                    style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#d8d6d6', justifyContent: 'center', alignItems: 'center', marginEnd: 20 }}
                    onPress={() => {
                        const onSubmit = async () => {
                            let callReminderVal: boolean = addToCalendarRef.current.values.callReminder
                            const order: Order = formRef.current.values

                            const orderId = stringToUUID(order.productName + order.orderNumber + order.quantity)
                            const formattedDate = formatDate(order.ETA)

                            // order.callReminder = callReminder
                            order.orderId = orderId
                            order.ETA = formattedDate

                            if (callReminderVal) {
                                const notificationInfo: NotificationInfo = {
                                    orderId: orderId,
                                    notificationId: Math.trunc(Math.random() * 1000000)
                                }
                                await store.toggleCallReminder(orderId, formattedDate, true)
                                callReminder(order.productImage, notificationInfo, order.orderNumber, order.ETA, order.from, order.productName)
                            }

                            database()
                                .ref(`/users/${store.loginCredentials.uid}/orders`)
                                .child(orderId)
                                .set(order)
                                .then(() => {
                                    console.log('Data set.')
                                    store.updateManualOrders()
                                    store.updateReRenderScreen("settings")
                                    navigation.goBack()
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

    const imageOptions = {
        mediaType: 'photo',
        quality: 0.6,
        cameraType: 'back',
        saveToPhotos: false,
    }

    const launchDeviceCamera = async () => {
        setVisible(false)

        launchCamera(imageOptions as any, async (response) => {
            if (!response.didCancel) {
                if (response !== undefined) {
                    const imageUrl = response.assets[0].uri!
                    const fileName = response.assets[0].fileName!
                    uploadImageAsync(imageUrl, fileName)
                }

            }
        })
    }

    const launchDeviceGallery = async () => {
        setVisible(false)
        launchImageLibrary(imageOptions as any, async (response) => {
            if (!response.didCancel) {
                if (response !== undefined) {
                    console.log(response)
                    const imageUrl = response.assets[0].uri!
                    const fileName = response.assets[0].fileName!
                    uploadImageAsync(imageUrl, fileName)
                }

            }
        })
    }


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
                        quantity: "1",
                        // deliveryDiscount: "",
                        productPrice: "",
                        productLink: "",
                        totalPrice: "",
                        from: "",
                    }}
                    onSubmit={() => { }}
                    innerRef={formRef}
                    validationSchema={ValidationSchema}
                >
                    {({ handleChange, handleSubmit, handleBlur, values, setFieldValue, errors, touched }) => (
                        <>
                            <View style={{ width: '100%', height: 400, position: 'relative', backgroundColor: "#121212" }}>
                                {!loading ?
                                    values.productImage.length > 0 ?
                                        <Image
                                            source={{ uri: values.productImage }}
                                            style={{ width: '100%', height: 400, resizeMode: 'cover', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginTop: 0, backgroundColor: "#121212" }}
                                        /> :
                                        <View
                                            style={{ width: '100%', height: 400, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, backgroundColor: "#121212", justifyContent: 'center', alignItems: "center" }}>
                                            <Image source={require('../../Assets/Icons/upload.png')} style={{ width: 150, height: 150, marginStart: 15 }} />
                                            <Text style={{ color: '#fff', fontSize: 20, fontWeight: "bold" }}>No Product Image</Text>
                                            <Text style={{ color: '#fff' }}>No Product Image</Text>
                                        </View>
                                    :
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
                                {values.productImage.length > 0 && <View style={{ backgroundColor: '#000', opacity: 0.35, width: '100%', height: 400, position: 'absolute' }}></View>}
                                <Pressable
                                    android_ripple={{ color: "#fff", borderless: false }}
                                    style={{
                                        width: 80,
                                        height: 50,
                                        borderRadius: 15,
                                        shadowColor: "#ccc",
                                        shadowOpacity: 0.25,
                                        shadowRadius: 20,
                                        position: 'absolute',
                                        bottom: 0,
                                        marginBottom: 10,
                                        marginEnd: 10,
                                        right: 0,
                                        backgroundColor: values.productImage.length > 0 ? "#000" : "#fff",
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        elevation: 1
                                    }}
                                    onPress={() => {
                                        setVisible(true)
                                    }}
                                >
                                    <FontAwesome name="camera" size={20} color={values.productImage.length > 0 ? "#fff" : "#000"} />
                                </Pressable>

                                <Modal
                                    visible={visible}
                                    backdropStyle={{ backgroundColor: 'rgba(46, 49, 49, 0.4)', }}
                                    onBackdropPress={() => setVisible(false)}
                                    style={{ width: "70%", height: 200, marginTop: 20 }}
                                >
                                    <Card
                                        style={{
                                            flex: 1,
                                            height: 200,
                                            borderWidth: 0,
                                            justifyContent: "space-evenly",
                                            backgroundColor: '#242323',
                                            elevation: 1,
                                            borderRadius: 10
                                        }}
                                    >
                                        <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                            <Text
                                                style={{ fontFamily: 'gotham-bold', fontSize: 15, color: '#fff' }}>
                                                Launch Camera or Browse Gallery
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                // flexDirection: 'row',
                                                width: '100%',
                                                height: 150,
                                                alignItems: 'center',
                                                justifyContent: 'space-around',
                                                borderWidth: 0
                                            }}>
                                            <Button
                                                appearance="filled"
                                                onPress={launchDeviceCamera}
                                                style={{ width: '80%', height: 50, borderWidth: 0, backgroundColor: "#13c801" }}
                                                accessoryLeft={() => (<FontAwesome name="camera" size={24} color="#fff" />)}>
                                                Camera
                                            </Button>
                                            <Button
                                                appearance='filled'
                                                onPress={launchDeviceGallery}
                                                accessoryLeft={() => (<Ionicons name="image" size={24} color="#fff" />)}
                                                style={{ width: '80%', height: 50, borderWidth: 0, backgroundColor: "#13c801" }}>
                                                Gallery
                                            </Button>

                                        </View>
                                    </Card>
                                </Modal>

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
                                onBlur={handleBlur('orderNumber')}
                            />
                            {(errors.orderNumber && touched.orderNumber) &&
                                <Text style={{ fontSize: 12, color: '#13c801', marginStart: 15, fontWeight: 'normal' }}>{errors.orderNumber}</Text>
                            }
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
                                onBlur={handleBlur('productName')}

                            />
                            {(errors.productName && touched.productName) &&
                                <Text style={{ fontSize: 12, color: '#13c801', marginStart: 15, fontWeight: 'bold' }}>{errors.productName}</Text>
                            }
                            <Datepicker
                                placement="top"
                                label="Estimated Delivery Time"
                                placeholder="Select the estimated date of arrival (only one)"
                                controlStyle={{ backgroundColor: "#8b8a8a2c", }}
                                style={{ marginHorizontal: 10, marginVertical: 10 }}
                                size="large"
                                date={values.ETA}
                                onSelect={(date) => setFieldValue('ETA', date)}
                                onBlur={() => handleBlur('ETA')}
                            />
                            {(errors.ETA && touched.ETA) &&
                                <Text style={{ fontSize: 12, color: '#13c801', marginStart: 15, fontWeight: 'bold' }}>{errors.ETA}</Text>
                            }

                            <Input
                                autoCorrect={false}
                                autoCapitalize="none"
                                label="Product Price"
                                size="large"
                                keyboardType="numeric"
                                style={{ fontSize: 17, fontWeight: 'bold', backgroundColor: "#8b8a8a2c", padding: 10 }}
                                textStyle={{ height: 30, color: '#bdb8b8' }}
                                placeholder="Enter the Product Price"
                                value={values.productPrice}
                                onChangeText={handleChange('productPrice')}
                                onBlur={handleBlur('productPrice')}
                            />
                            {(errors.productPrice && touched.productPrice) &&
                                <Text style={{ fontSize: 12, color: '#13c801', marginStart: 15, fontWeight: 'bold' }}>{errors.productPrice}</Text>
                            }

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
                                onBlur={handleBlur('sellerName')}
                            />
                            {(errors.sellerName && touched.sellerName) &&
                                <Text style={{ fontSize: 12, color: '#13c801', marginStart: 15, fontWeight: 'bold' }}>{errors.sellerName}</Text>
                            }
                            <Input
                                onBlur={() => {
                                    setFieldValue('totalPrice', (parseInt(values.quantity) * parseFloat(values.productPrice)).toString())
                                    handleBlur('quantity')
                                }}
                                autoCorrect={false}
                                autoCapitalize="none"
                                label="Quantity"
                                keyboardType="numeric"
                                maxLength={1}
                                size="large"
                                style={{ fontSize: 17, fontWeight: 'bold', backgroundColor: "#8b8a8a2c", padding: 10 }}
                                textStyle={{ height: 30, color: '#bdb8b8' }}
                                placeholder="Enter the quantity"
                                value={values.quantity}
                                onChangeText={handleChange('quantity')}

                            />
                            {(errors.quantity && touched.quantity) &&
                                <Text style={{ fontSize: 12, color: '#13c801', marginStart: 15, fontWeight: 'bold' }}>{errors.quantity}</Text>
                            }
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
                                onBlur={handleBlur('from')}
                            />
                            {(errors.from && touched.from) &&
                                <Text style={{ fontSize: 12, color: '#13c801', marginStart: 15, fontWeight: 'bold' }}>{errors.from}</Text>
                            }
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
                                keyboardType='url'
                                onBlur={handleBlur('productLink')}
                            />
                            {(errors.productLink && touched.productLink) &&
                                <Text style={{ fontSize: 12, color: '#13c801', marginStart: 15, fontWeight: 'bold' }}>{errors.productLink}</Text>
                            }
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
                                keyboardType="numeric"
                                returnKeyType="done"
                            />
                            {(errors.totalPrice && touched.totalPrice) &&
                                <Text style={{ fontSize: 12, color: '#13c801', marginStart: 15, fontWeight: 'bold' }}>{errors.totalPrice}</Text>
                            }
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
                {({ values, setFieldValue }) => (
                    <SwitchGroup
                        label="Add to Calendar"
                        toggleStatus={values.callReminder}
                        onValueChange={(value: boolean) => setFieldValue('callReminder', value)}
                        bgColor="#119605"
                        height={75}
                    />)}
            </Formik>

        </View>
    )
}

export default AddOrderScreen
