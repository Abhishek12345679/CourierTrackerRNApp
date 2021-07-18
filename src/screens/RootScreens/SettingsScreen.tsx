import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Input, Styles, Modal, Card, Button } from '@ui-kitten/components'
import { Formik } from 'formik'
import { observer } from 'mobx-react'
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, ScrollView, Pressable, TouchableOpacity, StatusBar, TextInput, ActivityIndicator, StyleSheet } from 'react-native'
import { Avatar, Switch } from 'react-native-ui-lib'
import GoogleSignInCard from '../../components/GoogleSignInCard'
import GoogleSignOutCard from '../../components/GoogleSignOutCard'
import SettingsListItem from '../../components/SettingsListItem'
import SwitchGroup from '../../components/SwitchGroup'
import store from '../../store/store'

import { Picker } from '@react-native-picker/picker';

export type reminderFrequency = "all" | "selected" | "none"

const SettingsScreen: React.FC = observer((props: any) => {
    const [signingOut, setSigningOut] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [visible, setVisible] = useState(false)
    const [editNewerThan, setEditNewerThan] = useState(false)

    const logout = async () => {
        store.resetLoginCredentials()
        store.resetCredentials()
        store.removeOrders()
        store.removeAmazonOrders()
        store.removeUserInfo()

        await AsyncStorage.removeItem('loginCredentials')
        await AsyncStorage.removeItem('credentials')
        await AsyncStorage.removeItem('orders')
        await AsyncStorage.removeItem('amazonOrders')
    }


    const signOutFromGoogle = async () => {
        setSigningOut(true)
        store.resetCredentials()
        store.removeOrders()
        store.removeUserInfo()
        await AsyncStorage.removeItem('orders')
        await AsyncStorage.removeItem('amazonOrders')
        await AsyncStorage.removeItem('credentials')
        setTimeout(() => {
            setSigningOut(false)
        }, 5000)

    }

    const switches = [
        { label: "Remind me for all orders" },
        { label: "allow fetching new orders" },
        { label: "dark mode" },
        { label: "show archived orders" },
    ]
    const miscButtons = [
        {
            label: "privacy policy",
            onPress: () => {
                props.navigation.navigate("PrivacyPolicyScreen")
            }
        },
        { label: "open source licenses", onPress: () => { props.navigation.navigate("OpenSourceLicensesScreen") } },
    ]

    const switchesRef = useRef()


    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#d8d6d6', justifyContent: 'center', alignItems: 'center', marginEnd: 20 }}
                    onPress={() => {
                        store.updateSettings(switchesRef.current.values)
                        // console.log(store.settings)
                        props.navigation.navigate("HomeScreen", {
                            from: "SettingsScreen"
                        })

                    }}>
                    <MaterialIcons name="done" size={24} />
                </TouchableOpacity>
            ),
        })
    }, [])

    const Item = (props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined, borderColor: string, onPress: () => void, height: number, style?: any }) => (
        <TouchableOpacity
            onPress={props.onPress}
            // android_ripple={{ color: '#8b8a8a2c', radius: 100, borderless: false }}
            style={{
                ...{
                    flex: 1,
                    flexDirection: 'row',
                    height: props.height,
                    marginTop: 15,
                    backgroundColor: '#202020ed',
                    borderRadius: 7,
                    marginLeft: 15,
                    marginRight: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20
                }, ...props.style
            }}>
            {props.children}
        </TouchableOpacity>
    )


    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#121212", }}>
            <StatusBar barStyle="light-content" />
            <Pressable
                android_ripple={{ color: '#8b8a8a2c', radius: 250, borderless: false }}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    height: 110,
                    marginTop: 15,
                    backgroundColor: '#202020ed',
                    borderRadius: 7,
                    marginLeft: 15,
                    marginRight: 15,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    padding: 20
                }}
            >
                <TouchableOpacity style={{ marginEnd: 20 }}>
                    <Avatar
                        size={80}
                        source={{ uri: store.userInfo.profilePicture }}
                        animate
                        imageStyle={{ shadowColor: '#fff', shadowOffset: { width: 10, height: 10 }, shadowOpacity: 0.9, shadowRadius: 50 }}
                    />
                </TouchableOpacity>
                <View>
                    <Text style={{ color: "#fff", fontFamily: 'gotham-black', fontSize: 20, marginBottom: 10 }}>{store.userInfo.name}</Text>
                    <Text style={{ color: "#fff", fontSize: 15 }}>{store.loginCredentials.email}</Text>
                </View>
            </Pressable>

            {store.googleCredentials.refresh_token !== "" &&
                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <GoogleSignOutCard
                        onPress={signOutFromGoogle}
                        loading={signingOut}
                    />
                </View>
            }
            <View style={{ width: "100%", justifyContent: "center", alignItems: 'center', marginTop: 20 }}>
                <View style={{ borderRadius: 10, overflow: 'hidden', backgroundColor: "#202020ed", width: "92%", }}>
                    <Formik
                        initialValues={{
                            orders_newer_than: store.settings.orders_newer_than,
                            // show_delivered_items: store.settings.show_delivered_items,
                            reminder_frequency: store.settings.reminder_frequency,
                            allow_fetching_new_orders: store.settings.allow_fetching_new_orders,
                            dark_mode: store.settings.dark_mode,
                            // show_archived_items: store.settings.show_archived_items,
                        }}
                        onSubmit={() => { }}
                        innerRef={switchesRef}
                    >
                        {({ handleChange, handleSubmit, values, setFieldValue }) => (
                            <>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    height: 60,
                                    // marginTop: 15,
                                    backgroundColor: '#202020ed',
                                    // borderRadius: 7,
                                    // marginHorizontal: 20,
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    padding: 5,
                                    width: "100%"
                                }}>
                                    <View
                                        style={{ flexDirection: 'row', width: '100%', height: 100, justifyContent: 'space-between', alignItems: 'center', paddingStart: 30, paddingEnd: 30 }}>
                                        <Text style={{ color: '#fff', fontSize: 18 }}>show orders newer than</Text>
                                        {/* <Switch value={props.toggleStatus} onValueChange={props.onValueChange} /> */}
                                        <TouchableOpacity
                                            onPress={() => setEditNewerThan(true)}
                                            style={{ backgroundColor: "#4d4b4b", borderRadius: 5, borderWidth: 0, width: 60, height: 30, alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <Text style={{ color: "#fff", fontSize: 15, fontFamily: 'gotham-bold' }}>{values.orders_newer_than}d</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 35 }}>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>When to remind?</Text>
                                        <Text style={{ color: '#fff', fontSize: 15, }}>{values.reminder_frequency}</Text>
                                    </View>
                                    <Picker
                                        dropdownIconColor="#fff"
                                        style={{ width: 50 }}
                                        mode="dropdown"
                                        selectedValue={values.reminder_frequency}
                                        onValueChange={(itemValue, itemIndex) =>
                                            setFieldValue('reminder_frequency', itemValue)
                                        }>
                                        <Picker.Item label="All" value="all" />
                                        <Picker.Item label="Selected" value="selected" />
                                        <Picker.Item label="None" value="none" />
                                    </Picker>
                                </View>

                                <SettingsListItem bgColor="#ffffff00" height={70} label={switches[1].label} toggleStatus={values.allow_fetching_new_orders} onValueChange={(value: boolean) => setFieldValue('allow_fetching_new_orders', value)} />
                                <SettingsListItem disabled={true} bgColor="#ffffff00" height={70} label={switches[2].label} toggleStatus={values.dark_mode} onValueChange={(value: boolean) => setFieldValue('dark_mode', value)} />
                                {/* <SettingsListItem bgColor="#ffffff00" height={70} label={switches[3].label} toggleStatus={values.show_archived_items} onValueChange={(value: boolean) => setFieldValue('show_archived_items', value)} /> */}
                                <Modal
                                    visible={editNewerThan}
                                    backdropStyle={{ backgroundColor: 'rgba(46, 49, 49, 0.4)', }}
                                    onBackdropPress={() => setEditNewerThan(false)}
                                    style={{ width: "80%", height: 150, marginTop: 20 }}
                                >
                                    <Card
                                        style={{
                                            flex: 1,
                                            height: 150,
                                            borderWidth: 0,
                                            justifyContent: "space-evenly",
                                            backgroundColor: '#111111',
                                            elevation: 1
                                        }}
                                    >
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, borderWidth: 0 }}>
                                            <Text
                                                style={{ fontFamily: 'gotham-bold', fontSize: 15, color: '#fff' }}>
                                                Display Orders Newer Than
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                width: '100%',
                                                height: 100,
                                                alignItems: 'center',
                                                justifyContent: 'space-evenly',
                                                borderWidth: 0
                                            }}>
                                            <Input
                                                keyboardType="numeric"
                                                maxLength={2}

                                                value={values.orders_newer_than}
                                                onChangeText={(value) => {
                                                    const regex = /^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/;
                                                    if (!value || regex.test(value.toString())) {
                                                        if (parseInt(value) > 0 || value === undefined || value === "") {
                                                            setFieldValue("orders_newer_than", value);
                                                        }
                                                    }
                                                }}

                                                textStyle={{ width: 40, height: 20, color: "#fff", fontSize: 20, }}
                                                style={{ backgroundColor: "#4d4b4b", borderRadius: 0, borderWidth: 0, marginTop: 20, marginBottom: 20, width: '65%' }}
                                                accessoryRight={() => (
                                                    <Text style={{ color: "#fff" }}>days</Text>
                                                )}
                                            />
                                            <Button
                                                appearance="filled"
                                                onPress={() => {
                                                    setEditNewerThan(false)
                                                }}

                                                style={{ height: 30, borderWidth: 0, backgroundColor: '#239b56', width: '25%' }}>
                                                {evaProps => <Text {...evaProps} style={{ color: '#fff' }}>Save</Text>}
                                            </Button>
                                        </View>
                                    </Card>
                                </Modal>
                            </>
                        )}
                    </Formik>
                </View>
            </View>
            <View style={{ width: "100%", justifyContent: "center", alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
                <View style={{ borderRadius: 10, overflow: 'hidden', backgroundColor: "#202020ed", width: "92%", }}>
                    {
                        miscButtons.map((btn, index) => (
                            <Item
                                key={index}
                                style={{ justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: 0, marginBottom: 0 }}
                                onPress={btn.onPress}
                                height={60}
                                borderColor="transparent">
                                <Text style={{ color: '#fff', fontSize: 18, marginLeft: 0 }}>{btn.label}</Text>
                            </Item>
                        ))
                    }
                </View>
            </View>
            <Item
                height={70}
                onPress={() => {
                    setVisible(true)
                }}
                borderColor="transparent">
                <Text style={{ color: "#fff", fontSize: 15, fontFamily: 'segoe-bold' }}>logout</Text>
            </Item>
            <Modal
                visible={visible}
                backdropStyle={{ backgroundColor: 'rgba(46, 49, 49, 0.4)', }}
                // onBackdropPress={() => setVisible(false)}
                style={{ width: "80%", height: 150, marginTop: 20 }}
            >
                <Card
                    style={{
                        flex: 1,
                        height: 100,
                        borderWidth: 0,
                        justifyContent: "space-evenly",
                        backgroundColor: '#111111',
                        elevation: 1
                    }}
                >
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, borderWidth: 0 }}>
                        <Text
                            style={{ fontFamily: 'gotham-bold', fontSize: 15, color: '#fff' }}>
                            Are you sure you want to log out?
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            height: 100,
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            borderWidth: 0
                        }}>
                        <Button
                            appearance="filled"
                            onPress={logout}
                            style={{ width: 120, height: 50, borderWidth: 0 }}>Logout</Button>
                        <Button
                            appearance='outline'
                            onPress={() => setVisible(false)}
                            style={{ width: 120, height: 50, borderWidth: 0 }}>Cancel</Button>
                    </View>
                </Card>
            </Modal>
        </ScrollView >
    )
})


export default SettingsScreen
