import React from 'react'
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'

export default function Button({ Name, designedFunction }) {
    return (
        <TouchableWithoutFeedback onPress={designedFunction}>
            <View style={styles.container}>
                <Text style={styles.button}>{Name}</Text>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    button: {
        color: 'red',
        fontSize: 35,
        fontFamily: 'Lobster Regular'
    },
    container: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'

    }
})