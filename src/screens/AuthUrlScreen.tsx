import React, { useRef } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview';

import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../store/store';

const AuthUrlScreen = (props: any) => {
    const url = props.route.params.url
    const webviewRef = useRef(null);

    const quotes = '&#34;'
    const quotesPattern = new RegExp(quotes, 'g')

    const setCredentials = async (credentials: string) => {
        try {
            let tokens = JSON.parse(credentials.replace(quotesPattern, "\""))
            const refresh_token = tokens.refresh_token as string
            if (!!refresh_token) {
                await AsyncStorage.setItem('refresh_token', refresh_token)
                await AsyncStorage.setItem('credentials', JSON.stringify(tokens))
                store.setCredentials(tokens)
            } else {
                const refresh_token = await AsyncStorage.getItem('refresh_token')
                console.log("rtoken: ", refresh_token)
                tokens.refresh_token = refresh_token
                await AsyncStorage.setItem('credentials', JSON.stringify(tokens))

                store.setCredentials(tokens)

            }

        } catch (e) {
            console.log("Error: ", e)
        }
        console.log('Saved Refresh Token!')
    }

    const onMessage = (data: any) => {

        const authData = data.nativeEvent.data
        console.log("from server: ", authData)
        try {
            setCredentials(authData)
        } catch (e) {
            console.log("Credentials not saved!: ", e)
        }

    }


    function LoadingIndicatorView() {
        return (
            <ActivityIndicator
                color="#009b88"
                size="large"
                style={{
                    flex: 1,
                    justifyContent: "center",
                }}
            />
        )
    }

    return (
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
            <WebView
                ref={webviewRef}
                source={{ uri: url }}
                userAgent={"Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.1 Mobile/15E148 Safari/604.1"}
                onMessage={onMessage}
                renderLoading={LoadingIndicatorView}
                startInLoadingState={true}
            />
        </View>
    )
}

export default AuthUrlScreen
