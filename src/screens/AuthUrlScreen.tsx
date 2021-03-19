import React, { useRef } from 'react'
import { View, Text, Alert, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview';

import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthUrlScreen = (props: any) => {
    const url = props.route.params.url
    // console.log(url)
    const webviewRef = useRef(null);



    const quotes = '&#34;'
    const quotesPattern = new RegExp(quotes, 'g')

    const setCredentials = async (credentials: string) => {
        try {
            // let tokens = JSON.stringify(credentials)
            let tokens = credentials.replace(quotesPattern, "\"")
            console.log("credentials from first time login: ", JSON.parse(tokens))

            if (JSON.parse(tokens).refresh_token) {
                await AsyncStorage.setItem('credentials', tokens)
            }
        } catch (e) {
            console.log("Error: ", e)
        }
        console.log('Saved Refresh Token!')
    }

    const onMessage = (data: any) => {
        console.log(data)
        // Alert.alert(data.nativeEvent.data);
        console.log(data.nativeEvent.data);
        setCredentials(data.nativeEvent.data).then(() => {
            props.navigation.navigate("HomeScreen", {
                auth: data.nativeEvent.data
            });
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
        );
    }

    return (
        <View style={{ backgroundColor: "pink", flex: 1 }}>
            <WebView
                ref={webviewRef}
                source={{ uri: url }}
                userAgent={"Mozilla/5.0 (Android; Mobile; rv:40.0) Gecko/40.0 Firefox/40.0"}
                onMessage={onMessage}
                renderLoading={LoadingIndicatorView}
                startInLoadingState={true}
            />
        </View>
    )
}

export default AuthUrlScreen
