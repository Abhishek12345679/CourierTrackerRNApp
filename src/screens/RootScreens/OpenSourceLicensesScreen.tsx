import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'

const packages = require('./../../../package.json')

interface dependency {
    name: string,
    version: string
}

const OpenSourceLicensesScreen = () => {

    const [depList, setDepList] = useState<dependency[]>([])
    useEffect(() => {
        for (const [key, value] of Object.entries(packages.dependencies)) {
            setDepList((prev) => [...prev, { "name": key, "version": value as string }])
        }
    }, [])

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#121212" }}>
            <View style={{ width: "100%", justifyContent: "center", alignItems: 'center', marginTop: 20 }}>
                <View style={{ borderRadius: 10, overflow: 'hidden', backgroundColor: "#202020ed", width: "92%", }}>
                    {depList.map((dep, index) => (
                        <View style={{ width: '100%', justifyContent: "space-between", padding: 20 }} key={index}>
                            <Text style={{ color: "#fff", marginStart: 5, fontSize: 17, fontFamily: "gotham-bold", marginBottom: 10 }}>{dep.name}</Text>
                            <Text style={{ color: "#fff", marginStart: 5, fontSize: 15, fontFamily: "gotham-normal" }}>{dep.version}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}


export default OpenSourceLicensesScreen
