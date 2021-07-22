import React, { useState } from 'react'
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

import { useTheme } from '@react-navigation/native';
import { observer } from 'mobx-react';

import { Input } from '@ui-kitten/components'

import auth from '@react-native-firebase/auth';
import store from '../store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Formik } from 'formik';
import * as yup from 'yup'

const authenticationValidationSchema = yup.object().shape({
    email: yup
        .string()
        .email("Please enter valid email")
        .required('Email Address is Required'),
    password: yup
        .string()
        .min(8, ({ min }) => `Password must be at least ${min} characters`)
        .required('Password is required'),
})

const LoginScreen: React.FC = observer((props: any) => {
    // const { colors } = useTheme()
    const [loggingIn, setloggingIn] = useState(false)
    const [isSignIn, setIsSignIn] = useState(false)

    const saveCredentialsToAsyncStorage = async (email: string, uid: string, token: string) => {
        try {
            await AsyncStorage.setItem('loginCredentials', JSON.stringify({ email, uid, token }))
        }
        catch (e) {
            console.log("Error: ", e)
        }
        console.log('Saved Refresh Token!')
    }

    const EmailPasswordSignIn = async (email: string, password: string) => {
        try {
            setloggingIn(true)
            let user
            if (isSignIn) {
                user = await auth().createUserWithEmailAndPassword(email, password)
            } else {
                user = await auth().signInWithEmailAndPassword(email, password)

            }
            const token = await user.user.getIdToken()
            console.log("token: ", token)

            store.setLoginCredentials({ email: email, uid: user.user.uid, token: token })
            await saveCredentialsToAsyncStorage(email, user.user.uid, token)
            store.setTryAutoLogin()

            setloggingIn(false)

            console.log(JSON.stringify(user, null, 2))
            console.log('User account created & signed in!');

        } catch (error) {
            setloggingIn(false)
            if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
            }
            if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
            }
            console.error(error);
        }

    }
    return (
        <ScrollView style={{ backgroundColor: '#121212' }}
            contentContainerStyle={{ justifyContent: "center", flex: 1 }}>
            <Text style={styles.text}>{`Welcome \nHooman <3 `}</Text>
            <Formik
                validationSchema={authenticationValidationSchema}
                initialValues={{
                    email: '',
                    password: ''
                }}
                onSubmit={(values) => EmailPasswordSignIn(values.email, values.password)}
            // innerRef={formRef}
            >
                {({ handleChange, handleBlur, handleSubmit, values, isValid, errors, touched }) => (
                    <>
                        <View style={styles.form}>
                            <Input
                                importantForAutofill="yes"
                                autoCorrect={false}
                                autoCapitalize="none"
                                autoCompleteType="email"
                                label="Email"
                                size="large"
                                style={{ fontSize: 17, fontWeight: 'bold', backgroundColor: "#8b8a8a2c", padding: 10 }}
                                textStyle={{ height: 40, color: '#bdb8b8' }}
                                placeholder="Enter your email address"
                                value={values.email}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                            />
                            {(errors.email && touched.email) &&
                                <Text style={{ fontSize: 12, color: '#13c801', marginStart: 15, fontWeight: 'bold' }}>{errors.email}</Text>
                            }
                            <Input
                                label="Password"
                                size="large"
                                style={{ fontSize: 17, fontWeight: 'bold', backgroundColor: "#8b8a8a2c", padding: 10 }}
                                textStyle={{ height: 40, color: '#bdb8b8' }}
                                placeholder="Enter a valid password"
                                value={values.password}
                                secureTextEntry
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                            />
                            {(errors.password && touched.password) &&
                                <Text style={{ fontSize: 12, color: '#13c801', marginStart: 15, fontWeight: 'bold' }}>{errors.password}!!</Text>
                            }
                            <View style={{ marginTop: 20 }}>
                                <Text style={{ color: '#e6e1e1', paddingStart: 15, fontSize: 17, marginBottom: 7 }}>Don't have an account?</Text>
                                <Text style={{ paddingStart: 15, fontSize: 17, marginBottom: 7, textDecorationLine: 'underline', color: "#13c801" }} onPress={() => { setIsSignIn(prev => !prev) }}>Create an account</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', backgroundColor: "#2c2727" }}>
                            <Pressable
                                disabled={!isValid}
                                android_ripple={{ color: '#575454', radius: 100, borderless: false }}
                                style={{ flexDirection: 'row', width: '100%', height: 70, backgroundColor: '#13c801', marginEnd: 30, elevation: 100, borderRadius: 0, alignItems: 'center', justifyContent: "center" }}
                                onPress={handleSubmit}
                            >
                                {!loggingIn ?
                                    <Text style={{ fontFamily: 'segoe-bold', fontSize: 17, color: '#ffffff' }}>{isSignIn ? "Signin" : "Login"}</Text> :
                                    <ActivityIndicator size="large" color="#aaa8a8" />
                                }
                            </Pressable>
                        </View>
                    </>
                )}
            </Formik>
        </ScrollView >
    )
})

const styles = StyleSheet.create({
    text: {
        color: '#c7c4c4',
        fontSize: 48,
        fontFamily: 'gotham-black',
        padding: 20,
        marginTop: 40
    },
    form: {
        flex: 1,
        margin: 15,
        marginTop: 20,
        height: 200,
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
