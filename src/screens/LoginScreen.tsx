import React, { useState } from 'react'
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'

import { sensitiveData } from '../../constants/sen_data';
import { useTheme } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Incubator } from 'react-native-ui-lib';
import { AntDesign } from '@expo/vector-icons';

const { TextField, TouchableOpacity } = Incubator

import auth from '@react-native-firebase/auth';
import store from '../store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: add validation to textinput
const LoginScreen: React.FC = observer((props: any) => {

    const saveCredentialsToAsyncStorage = async (email: string, uid: string, token: string) => {
        try {
            await AsyncStorage.setItem('loginCredentials', JSON.stringify({ email, uid, token }))
        }
        catch (e) {
            console.log("Error: ", e)
        }
        console.log('Saved Refresh Token!')
    }

    const EmailPasswordSignIn = async () => {
        try {

            const user = await auth().signInWithEmailAndPassword(email, password)
            const token = await user.user.getIdToken()
            console.log("token: ", token)

            store.setLoginCredentials({ email: email, uid: user.user.uid, token: token })
            await saveCredentialsToAsyncStorage(email, user.user.uid, token)
            store.setTryAutoLogin()
            console.log(JSON.stringify(user, null, 2))
            console.log('User account created & signed in!');

        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
            }

            if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
            }

            console.error(error);
        }

    }

    const { colors } = useTheme()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <ScrollView style={{ flex: 1 }}>

            <Image
                source={require('../Assets/Images/Welcome.png')}
                style={{ width: '100%', height: 300, marginTop: 15 }} />
            <View style={styles.form}>
                {/* <Text style={styles.text}>{`Welcome \nHooman 🥳`}</Text> */}

                <Text style={{ ...styles.text, fontSize: 50, marginVertical: 10 }}>Login</Text>
                <TextField
                    style={{ fontSize: 17, fontWeight: 'bold' }}
                    containerStyle={{ height: 70, borderWidth: 2, borderColor: "#000", justifyContent: "center", borderRadius: 10, marginVertical: 15 }}
                    fieldStyle={{ marginHorizontal: 20, }}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    validateOnChange={true}
                    enableErrors
                    validationMessage={['Email is required', 'Email is invalid']}
                    // validationMessageStyle={Typography.text90R}
                    validationMessagePosition={TextField.validationMessagePositions.BOTTOM}
                    validate={['required', 'email']}
                    validationMessageStyle={{ marginTop: 5, marginStart: 20, fontSize: 12, fontWeight: 'bold' }}
                />
                <TextField
                    editable={email.length > 5}
                    containerStyle={{ height: 50, borderWidth: 2, borderColor: "#000", justifyContent: "center", borderRadius: 10, marginVertical: 20 }}
                    fieldStyle={{ marginHorizontal: 20 }}
                    placeholder="Password"
                    trailingAccessory={
                        password.length >= 8 ? <AntDesign
                            name="rightcircle"
                            size={24}
                            color="blue"
                            onPress={
                                () => {
                                    console.log("clicked!")
                                    EmailPasswordSignIn()
                                }
                            }

                        /> : <></>
                    }
                    value={password}
                    secureTextEntry
                    onChangeText={setPassword}
                />

            </View>
        </ScrollView>
    )
})

const styles = StyleSheet.create({
    text: {
        color: '#000',
        fontSize: 48,
        // fontFamily: 'segoe-bold'
        fontWeight: 'bold'

    },
    form: {
        margin: 15,
        marginTop: 20
    },
    signInWithPhbutton: {
        width: '95%',
        height: 50,
        borderRadius: 10,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    }
});

export default LoginScreen
