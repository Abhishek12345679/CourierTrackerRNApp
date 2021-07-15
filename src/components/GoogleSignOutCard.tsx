import React from 'react'
import { View, Text, Pressable, Image, ActivityIndicator } from 'react-native'

type Props = {
    onPress(): void,
    loading: boolean
}

const GoogleSignOutCard = (props: Props) => {
    return (
        <View style={{
            width: '92%',
            height: 150,
            backgroundColor: "#ffffff",
            marginTop: 15,
            borderRadius: 5,
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
            <Text style={{ color: "#000", fontSize: 17, fontWeight: 'bold' }}>
                Sign in to  <Text style={{ color: '#000', fontStyle: "italic" }}>Google</Text>  to give us access to your emails, so that can we scan it for orders.
            </Text>
            <Pressable
                style={{ width: '100%', height: 50, backgroundColor: "#121212", justifyContent: "space-around", flexDirection: "row", alignItems: "center", paddingHorizontal: 90, marginTop: 20, borderRadius: 10 }}
                onPress={props.onPress}
                android_ripple={{ color: "#cccccc20", radius: 200, }}

            >
                {!props.loading ?
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-evenly", alignItems: 'center', width: '100%' }}>
                        <Image source={require('../Assets/Icons/google.png')} style={{ height: 24, width: 24, marginEnd: 20 }} />
                        <Text style={{ fontFamily: 'segoe-bold', color: '#ccc' }}>Sign out of Google</Text>
                    </View> :
                    <ActivityIndicator color="#fff" size="small" />
                }
            </Pressable>
        </View>
    )
}

export default GoogleSignOutCard
