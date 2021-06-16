import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Input } from '@ui-kitten/components'
import { Formik } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, ScrollView, Button, Pressable, TouchableOpacity, StatusBar, TextInput, ActivityIndicator } from 'react-native'
import { Avatar, Switch } from 'react-native-ui-lib'
import GoogleSignInCard from '../../components/GoogleSignInCard'
import GoogleSignOutCard from '../../components/GoogleSignOutCard'
import SettingsListItem from '../../components/SettingsListItem'
import SwitchGroup from '../../components/SwitchGroup'
import store from '../../store/store'

const SettingsScreen = ({ navigation }: any) => {

    const [signingOut, setSigningOut] = useState(false)

    const logout = async () => {
        store.resetLoginCredentials()
        store.resetCredentials()
        store.removeOrders()
        await AsyncStorage.removeItem('loginCredentials')
        await AsyncStorage.removeItem('credentials')
    }


    const signOutFromGoogle = async () => {
        setSigningOut(true)
        store.resetCredentials()
        store.removeOrders()
        await AsyncStorage.removeItem('orders')
        await AsyncStorage.removeItem('credentials')
        setTimeout(() => {
            setSigningOut(false)
        }, 5000)

    }

    const switches = [
        { label: "show delivered items" },
        { label: "allow fetching new orders" },
        { label: "dark mode" },
        { label: "show archived orders" },
    ]

    const switchesRef = useRef()


    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#d8d6d6', justifyContent: 'center', alignItems: 'center', marginEnd: 20 }}
                    onPress={() => {
                        // console.log(switchesRef.current.values)
                        store.updateSettings(switchesRef.current.values)
                        navigation.pop()
                    }}>
                    <MaterialIcons name="done" size={24} />
                </TouchableOpacity>
            ),
        })
    }, [])

    const Item = (props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined, borderColor: string, onPress: () => void }) => (
        <Pressable

            onPress={props.onPress}
            android_ripple={{ color: '#8b8a8a2c', radius: 250, borderless: false }}
            style={{
                flex: 1,
                flexDirection: 'row',
                height: 75,
                marginTop: 15,
                backgroundColor: '#202020ed',
                borderWidth: 1,
                borderColor: props.borderColor,
                borderRadius: 7,
                marginLeft: 15,
                marginRight: 15,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20
            }}>
            {props.children}
        </Pressable>
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

            {store.googleCredentials.access_token !== "" && <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <GoogleSignOutCard
                    onPress={signOutFromGoogle}
                    loading={signingOut}
                />
            </View>}
            <View style={{ width: "100%", justifyContent: "center", alignItems: 'center', marginTop: 20 }}>
                <View style={{ borderRadius: 10, overflow: 'hidden', backgroundColor: "#202020ed", width: "92%", }}>
                    <Formik
                        initialValues={{
                            orders_newer_than: store.settings.orders_newer_than,
                            show_delivered_items: store.settings.show_delivered_items,
                            allow_fetching_new_orders: store.settings.allow_fetching_new_orders,
                            dark_mode: store.settings.dark_mode,
                            show_archived_items: store.settings.show_archived_items,
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
                                        <Input
                                            keyboardType="numeric"
                                            maxLength={2}
                                            value={values.orders_newer_than + " d"}
                                            onChangeText={(value) => {
                                                const regex = /^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/;
                                                if (!value || regex.test(value.toString())) {
                                                    if (parseInt(value) >= 0) {
                                                        setFieldValue("orders_newer_than", value);
                                                    }
                                                }
                                            }}

                                            textStyle={{ width: 40, height: 20, color: "#fff", fontSize: 18 }}
                                            style={{ marginLeft: 20, backgroundColor: "#4d4b4b", borderRadius: 10, borderWidth: 0, }}
                                            accessoryRight={() => (
                                                <View style={{ width: 20, height: 20, marginRight: 0, justifyContent: "center", alignItems: 'center' }}>
                                                    <AntDesign name="caretup" size={14} color="#fff" onPress={() => {
                                                        if (parseInt(values.orders_newer_than) + 7 < 100) {
                                                            setFieldValue('orders_newer_than', (parseInt(values.orders_newer_than) + 7).toString())
                                                        }
                                                    }} />
                                                    <AntDesign name="caretdown" size={14} color="#fff" onPress={() => {
                                                        if (parseInt(values.orders_newer_than) - 7 > 0) {
                                                            setFieldValue('orders_newer_than', (parseInt(values.orders_newer_than) - 7).toString())

                                                        }
                                                    }} />
                                                </View>
                                            )}
                                        />
                                    </View>
                                </View>
                                <SettingsListItem bgColor="#ffffff00" height={70} label={switches[0].label} toggleStatus={values.show_delivered_items} onValueChange={(value: boolean) => setFieldValue('show_delivered_items', value)} />
                                <SettingsListItem bgColor="#ffffff00" height={70} label={switches[1].label} toggleStatus={values.allow_fetching_new_orders} onValueChange={(value: boolean) => setFieldValue('allow_fetching_new_orders', value)} />
                                <SettingsListItem bgColor="#ffffff00" height={70} label={switches[2].label} toggleStatus={values.dark_mode} onValueChange={(value: boolean) => setFieldValue('dark_mode', value)} />
                                <SettingsListItem bgColor="#ffffff00" height={70} label={switches[3].label} toggleStatus={values.show_archived_items} onValueChange={(value: boolean) => setFieldValue('show_archived_items', value)} />
                                {/* <Button title="submit" onPress={handleSubmit} /> */}
                            </>
                        )}
                    </Formik>
                </View>
            </View>
            <Item onPress={logout} borderColor="transparent"><Text style={{ color: "#fff", fontSize: 20, fontFamily: 'segoe-bold' }}>logout</Text></Item>
        </ScrollView >
    )
}

export default SettingsScreen
