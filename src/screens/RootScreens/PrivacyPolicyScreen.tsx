import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview';


const PrivacyPolicyScreen = () => {

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
                source={{ uri: "https://www.freeprivacypolicy.com/live/31ae1825-a8ae-4467-93b2-8ce731fe8cbd" }}
                userAgent={"Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.1 Mobile/15E148 Safari/604.1"}
                renderLoading={LoadingIndicatorView}
                startInLoadingState={true}
            />
        </View>
    )
}

export default PrivacyPolicyScreen
