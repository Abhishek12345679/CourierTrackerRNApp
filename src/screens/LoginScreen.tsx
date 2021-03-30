import React from 'react'
import { View } from 'react-native'

import {
    GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import { sensitiveData } from '../../constants/sen_data';

const LoginScreen: React.FC = (props: any) => {
    const signIn = async () => {
        const response = await fetch(`${sensitiveData.baseUrl}/authorize`)
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
