import React from 'react'
import { View } from 'react-native'

import {
    GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

const LoginScreen: React.FC = (props: any) => {
    const signIn = async () => {
        const response = await fetch('https://ff900f4cc352.ngrok.io/authorize')
        const data = await response.json()
        // console.log("DATA: ", decodeURIComponent(data.url))
        props.navigation.navigate('AuthUrlScreen', {
            url: decodeURIComponent(data.url)
        })
    }

    return (
        <View style={{ flex: 1 }}>
            <GoogleSigninButton
                style={{ width: 192, height: 60 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={signIn}
            />
        </View>
    )
}

export default LoginScreen
