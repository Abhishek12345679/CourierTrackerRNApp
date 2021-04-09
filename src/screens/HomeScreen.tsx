import React from 'react'
import { View, Button } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen: React.FC = (props: any) => {
    return (
        <View style={{ flex: 1 }}>
            <Button title="sign out" onPress={() => {
                AsyncStorage.removeItem('credentials').then(() => {
                    props.navigation.goBack()
                })
            }} />
        </View>
    )
}

export default HomeScreen

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


