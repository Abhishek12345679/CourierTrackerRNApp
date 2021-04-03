import React, { useState, useEffect } from 'react'
import { View, Text, Pressable, Image, ScrollView, TouchableOpacity, Linking, Button } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { sensitiveData } from '../../constants/sen_data';

import { FileSystem, Constants } from 'react-native-unimodules'

const uuid = require('react-native-uuid')

const HomeScreen: React.FC = (props: any) => {



    // const downloadInvoices = (downloadLinks: string[]) => {
    //     console.log(downloadLinks)
    //     const links = downloadLinks.map((link, i) => (
    //         FileSystem.downloadAsync(
    //             link,
    //             FileSystem.documentDirectory + `${uuid.v4()}.pdf`
    //         ).then(({ uri }) => uri))
    //     )

    //     Promise.all(links).then((uriList) => {
    //         console.log(uriList)
    //         if (uriList) {
    //             uriList.map((uri, i) => {
    //                 console.log(uri)
    //                 FileSystem.uploadAsync(`${sensitiveData.baseUrl}/multipart-upload`, uri, {
    //                     httpMethod: "PATCH",
    //                     sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
    //                     uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    //                     fieldName: 'file',
    //                     mimeType: 'multipart/form-data'
    //                 }).then((res) => { console.log(res.status) })
    //             })
    //         }
    //     }).then(() => {
    //         console.log("success!")

    //     }).catch((err) => {
    //         console.log(err)
    //     })


    // }



    return (
        <View style={{ flex: 1 }}>
            <Text>Home</Text>
        </View>
    )
}

export default HomeScreen


