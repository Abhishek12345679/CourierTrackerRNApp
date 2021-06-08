import React from 'react'
import { View, Text, Pressable, Image, ActivityIndicator } from 'react-native'

type Props = {
    onPress(): void,
    loading: boolean
}

const GoogleSignInCard = (props: Props) => {
    return (
        <View style={{
            width: '90%',
            height: 150,
            backgroundColor: "#8b8a8a2c",
            marginVertical: 20,
            borderRadius: 10,
            paddingHorizontal: 20,
            paddingVertical: 10,
            alignItems: 'center',
            justifyContent: 'center',

            //iOS
            shadowOpacity: 0.2,
            shadowColor: '#ccc',
            shadowOffset: { width: 5, height: 5 },
            shadowRadius: 20,

            //android
            elevation: 1,
        }}>
            <Text style={{ color: "#fffdfd", fontSize: 15, fontFamily: 'gotham-black' }}>
                Sign in to  <Text style={{ color: '#d6d3d3', fontStyle: "italic" }}>Google</Text>  to give us access to your emails, so that can we scan it for orders.
                </Text>
            <Pressable
                style={{ width: '90%', height: 50, backgroundColor: "#fff", justifyContent: "space-around", flexDirection: "row", alignItems: "center", paddingHorizontal: 100, marginTop: 20, borderRadius: 10 }}
                onPress={props.onPress}
                android_ripple={{ color: "#121212", radius: 150, }}

            >
                {!props.loading ? <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-around", alignItems: 'center' }}>
                    <Image source={require('../Assets/Icons/google.png')} style={{ height: 24, width: 24, marginEnd: 20 }} />
                    <Text>Sign in to Google</Text>
                </View> : <ActivityIndicator color="#000" size="small" />}
            </Pressable>
        </View>
    )
}

export default GoogleSignInCard
