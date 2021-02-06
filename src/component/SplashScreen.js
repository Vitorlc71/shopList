import React, { useEffect } from 'react'
import { ImageBackground, SafeAreaView, StyleSheet } from 'react-native'
import { CommonActions } from '@react-navigation/native'
import image from '../../img/carrinhoRed3.png'
import * as Progress from 'react-native-progress'
import { useState } from 'react'


export default function SplashScreen({ navigation }) {

    const [progress, setProgress] = useState(0)

    useEffect(() => {
        let newProgress = 0
        setInterval(() => {
            if (newProgress < 1) {
                newProgress += 0.2
                setProgress(newProgress)
            }
        }, 700)
            setTimeout(() => {
                navigation.dispatch(CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: 'Início' },
                        { name: 'Listas Salvas' },
                    ]
                }
                ))
            }, 4000)
    }, [])

    return (
        <SafeAreaView style={styles.background}>
            <ImageBackground source={image} style={styles.image}>
                <Progress.Bar borderWidth={0} progress={progress} height={3} color='#163F4D' size={100} style={styles.progress} />
            </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 150,
        height: 150,
    },
    background: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#609789',
        width: '100%',
        height: '100%'
    },
    progress: {
        alignSelf: 'center',
        top: 200
    }
})