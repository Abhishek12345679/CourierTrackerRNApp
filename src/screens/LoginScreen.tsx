import React from 'react'
import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'

import {
    GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import { sensitiveData } from '../../constants/sen_data';
import { useTheme } from '@react-navigation/native';


const LoginScreen: React.FC = (props: any) => {
    const signIn = async () => {
        const response = await fetch(`${sensitiveData.baseUrl}/authorize`)
        const data = await response.json()
        // console.log("DATA: ", decodeURIComponent(data.url))
        props.navigation.navigate('AuthUrlScreen', {
            url: decodeURIComponent(data.url)
        })
    }

    const { colors } = useTheme()

    return (
        <SafeAreaView style={{ flex: 1 }}>

            {/* <Image
                source={require('../Assets/Images/Welcome.png')}
                style={{ width: '100%', height: 100, marginTop: 50 }} /> */}
            <View style={styles.form}>
                <Text style={styles.text}>{`Welcome \nHooman 🥳`}</Text>

                <Text style={{ color: '#413d3c', marginStart: 5, marginBottom: 5, marginTop: 40 }}>create an account using</Text>
                <Pressable
                    style={styles.signInWithPhbutton}
                    onPress={() => { }}
                    android_ripple=
                    {{
                        color: '#fff',
                        borderless: false,
                        radius: 100
                    }}>
                    <Text style={{ ...styles.text, ...{ color: colors.text, fontSize: 17 } }}>
                        Sign in with phone number
                    </Text>
                </Pressable>
                <View style={{ width: '100%', height: 40, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{}}>or</Text>
                </View>
                <GoogleSigninButton
                    style={{ width: '95%', height: 60, marginStart: 5 }}

                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={signIn}
                />
                <Pressable
                    style={{ ...styles.signInWithPhbutton, ...{ marginTop: 20, borderRadius: 5, marginStart: 5 } }}
                    onPress={() => { }}
                    android_ripple=
                    {{
                        color: '#fff',
                        borderless: false,
                        radius: 100
                    }}>
                    <Text style={{ ...styles.text, ...{ color: colors.text, fontSize: 17 } }}>
                        Sign in with Apple
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView >
    )
}

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
