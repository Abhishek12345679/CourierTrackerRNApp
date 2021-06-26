import { Entypo, Ionicons } from '@expo/vector-icons';
import React from 'react'
import { Pressable } from 'react-native';
import { View, Text, FlatList } from 'react-native'


//TODO: Create a matrix looking calender-esque screen
const ETAOverviewScreen = (props: any) => {
    const ETAList = props.route.params.ETAList
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    return (
        <View style={{ flex: 1, backgroundColor: '#121212' }}>
            {/* {ETAList.map((data) => (
                <View style={{ backgroundColor: "#fff" }}>
                    <Text>{new Date(parseInt(data)).getDate()}</Text>
                </View>
            ))} */}
            <Pressable
                style={{ width: 50, height: 50, backgroundColor: 'transparent', position: 'absolute', marginTop: 10, marginStart: 10, borderRadius: 25, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
                onPress={() => props.navigation.goBack()}
                android_ripple={{ color: "#fff", radius: 25, }}

            >
                <Entypo name="cross" size={36} color="#fff" />
            </Pressable>
            <FlatList
                keyExtractor={item => item}
                style={{ marginTop: 50 }}
                data={ETAList}
                renderItem={(item) => (
                    <View style={{ backgroundColor: "#fff", margin: 40, width: 70, height: 70, justifyContent: 'center', alignItems: 'center', borderRadius: 35, }}>
                        <Text style={{ color: "#000", fontSize: 20, fontFamily: 'gotham-bold' }}>{new Date(parseInt(item.item)).getDate()}</Text>
                        <Text style={{ color: "#000", fontSize: 20, fontFamily: 'gotham-normal' }}>{months[new Date(parseInt(item.item)).getMonth()]}</Text>
                    </View>
                )}
                numColumns={3}
            />
        </View>
    )
}

export default ETAOverviewScreen
