import React, { useRef } from 'react'
import { View, Text, Alert, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview';

import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../store/store';

const AuthUrlScreen = (props: any) => {
    const url = props.route.params.url
    // console.log(url)
    const webviewRef = useRef(null);

    const quotes = '&#34;'
    const quotesPattern = new RegExp(quotes, 'g')

    // const setCredentials = async (credentials: string) => {
    //     try {
    //         // let tokens = JSON.stringify(credentials)
    //         let tokens = JSON.parse(credentials.replace(quotesPattern, "\""))
    //         console.log("credentials", tokens)

    //         const refresh_token: string = tokens.refresh_token
    //         if (!!refresh_token) {
    //             await AsyncStorage.setItem('credentials', tokens)
    //             await AsyncStorage.setItem('refresh_token', refresh_token)
    //             return credentials
    //         } else {
    //             const refresh_token = await AsyncStorage.getItem('refresh_token')
    //             console.log("rtoken: ", refresh_token)
    //             tokens.refresh_token = refresh_token
    //             await AsyncStorage.setItem('credentials', JSON.stringify(tokens))
    //             return tokens
    //         }
    //     } catch (e) {
    //         console.log("Error: ", e)
    //     }
    //     console.log('Saved Refresh Token!')
    // }

    const setCredentials = async (credentials: string) => {
        try {
            let tokens = JSON.parse(credentials.replace(quotesPattern, "\""))
            const refresh_token = tokens.refresh_token as string
            if (!!refresh_token) {
                await AsyncStorage.setItem('refresh_token', refresh_token)
                store.setCredentials(tokens)
            } else {
                const refresh_token = await AsyncStorage.getItem('refresh_token')
                console.log("rtoken: ", refresh_token)
                tokens.refresh_token = refresh_token

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
        setCredentials(authData).then((creds) => {
            // console.log("After adding refresh_token: ", creds)
            // use state management
            // props.navigation.navigate("HomeScreen", {
            //     auth: creds
            // });
            // props.navigation.goBack()
        }).catch((err) => { console.log("Credentials not saved!: ", err) })

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
        <View style={{ backgroundColor: "pink", flex: 1 }}>
            <Text>Bullocks</Text>
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
