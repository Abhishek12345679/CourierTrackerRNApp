import React from 'react'
import { View, Text, Pressable, Image, ActivityIndicator } from 'react-native'

type Props = {
    onPress(): void,
    loading: boolean
}

const GoogleSignInCard = (props: Props) => {
    return (
        <View style={{
            width: '95%',
            height: 150,
            backgroundColor: "#787fa7",
            marginTop: 10,
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 10,
            alignItems: 'center',
            justifyContent: 'center',

            //iOS
            shadowOpacity: 0.9,
            shadowColor: '#787fa7',
            shadowOffset: { width: 10, height: -10 },
            shadowRadius: 20,

            //android
            elevation: 50,
        }}>
            <Text style={{ color: "#000", fontWeight: "bold", fontSize: 17 }}>
                Sign in to  <Text style={{ color: '#fff', fontStyle: "italic" }}>Google</Text>  to give us access to your emails, so that can we scan it for orders.
                </Text>
            <Pressable
                style={{ width: '90%', height: 50, backgroundColor: "#fff", justifyContent: "space-around", flexDirection: "row", alignItems: "center", paddingHorizontal: 100, marginTop: 20 }}
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
