import React, { useRef } from 'react'
import { View, Text, Alert, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview';

const AuthUrlScreen = (props: any) => {
    const url = props.route.params.url
    // console.log(url)
    const webviewRef = useRef(null);
    const onMessage = (data: any) => {
        console.log(data)
        // Alert.alert(data.nativeEvent.data);
        console.log(data.nativeEvent.data);
        props.navigation.navigate("HomeScreen", {
            auth: data.nativeEvent.data
        });
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
