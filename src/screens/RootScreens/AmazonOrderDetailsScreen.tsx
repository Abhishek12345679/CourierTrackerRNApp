import React from 'react'
import { View, Text, Linking } from 'react-native'

const AmazonOrderDetailsScreen: React.FC = ({ route }) => {
    const item = route.params.item
    console.log(item)
    return (
        <View>
            <Text
                style={{ color: "#fff", fontSize: 50 }}
                onPress={() => Linking.openURL(item.orderPreviewLink)}>
                LINK
            </Text>
        </View>
    )
}

export default AmazonOrderDetailsScreen
