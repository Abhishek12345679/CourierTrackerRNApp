import { AntDesign, Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Input } from '@ui-kitten/components'
import { Formik } from 'formik'
import React, { useState } from 'react'
import { View, Text, ScrollView, Button, Pressable, TouchableOpacity, StatusBar, TextInput } from 'react-native'
import { Avatar, Switch } from 'react-native-ui-lib'
import SettingsListItem from '../../components/SettingsListItem'
import SwitchGroup from '../../components/SwitchGroup'
import store from '../../store/store'

// TODO: Add SwitchGroups using Formik and styles from ~~AushNative~~
const SettingsScreen = ({ navigation }: any) => {

    const logout = async () => {
        store.resetLoginCredentials()
        store.resetCredentials()
        store.removeOrders()
        await AsyncStorage.removeItem('loginCredentials')
        await AsyncStorage.removeItem('credentials')
    }

    const switches = [
        { label: "show delivered items" },
        { label: "allow fetching new orders" },
        { label: "dark mode" },
        { label: "show archived orders" },
    ]



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
            // onPress={() => navigation.navigate('OrderDetailsScreen', {
            //     item: item
            // })}
            // key={index}
            >
                <TouchableOpacity style={{ marginEnd: 20 }} onPress={() => navigation.navigate('Settings')}>
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
                        onSubmit={(values) => { store.updateSettings(values) }}
                    // innerRef={}
                    >
                        {({ handleChange, handleSubmit, values, setFieldValue }) => (
                            <>
                                <TouchableOpacity style={{
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
                                            value={values.orders_newer_than}
                                            onChangeText={(value) => {
                                                const regex = /^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/;
                                                if (!value || regex.test(value.toString())) {
                                                    if (parseInt(value) >= 0) {
                                                        setFieldValue("orders_newer_than", value);
                                                    }
                                                }
                                            }}

                                            textStyle={{ width: 35, height: 20, color: "#fff", fontSize: 18 }}
                                            style={{ marginLeft: 20, backgroundColor: "#4d4b4b", borderRadius: 10, borderWidth: 0, }}
                                            accessoryRight={() => (
                                                <View style={{ width: 10, height: 20, marginEnd: 5 }}>
                                                    <AntDesign name="caretup" size={12} color="#fff" onPress={() => { setFieldValue('orders_newer_than', (parseInt(values.orders_newer_than) + 7).toString()) }} />
                                                    <AntDesign name="caretdown" size={12} color="#fff" onPress={() => { setFieldValue('orders_newer_than', (parseInt(values.orders_newer_than) - 7).toString()) }} />
                                                </View>
                                            )}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <SettingsListItem label={switches[0].label} toggleStatus={values.show_delivered_items} onValueChange={(value: boolean) => setFieldValue('show_delivered_items', value)} />
                                <SettingsListItem label={switches[1].label} toggleStatus={values.allow_fetching_new_orders} onValueChange={(value: boolean) => setFieldValue('allow_fetching_new_orders', value)} />
                                <SettingsListItem label={switches[2].label} toggleStatus={values.dark_mode} onValueChange={(value: boolean) => setFieldValue('dark_mode', value)} />
                                <SettingsListItem label={switches[3].label} toggleStatus={values.show_archived_items} onValueChange={(value: boolean) => setFieldValue('show_archived_items', value)} />
                                <Button title="submit" onPress={handleSubmit} />
                            </>
                        )}
                    </Formik>
                </View>
            </View>
            {/* <Button title="Logout" onPress={logout} /> */}
        </ScrollView >
    )
}

export default SettingsScreen
