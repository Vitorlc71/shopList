import React, { useState } from 'react'
import { Text, TextInput, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import Gradient from 'react-native-linear-gradient'
import DropShadow from 'react-native-drop-shadow'
import Toast from 'react-native-toast-message'

export default function OpenScreen({ navigation }) {

    const [newName, setNewName] = useState()

    return (
        <Gradient colors={['#163F4D', '#609789']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.background}>
            <DropShadow style={styles.shadow}>
                <Gradient colors={['#609789', '#163F4D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
                    <Text style={styles.title}>Listas de compras</Text>
                </Gradient>
            </DropShadow>
            <TextInput style={styles.textInput} placeholder='Nome da lista' value={newName} onChangeText={(e) => setNewName(e)} />
            <Toast ref={ref => Toast.setRef(ref)} />
            <TouchableOpacity activeOpacity={0.7} onPress={() => {
                if (newName) {
                    navigation.push('CreateList', {
                        nameList: newName
                    }
                    )
                    setNewName()
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Informe um nome para sua lista.',
                        text2: 'Será mais fácil identificar posteriormente.'
                    })
                    return
                }
            }}>
                <Gradient colors={['#609789', '#163F4D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.buttonContainer}>
                    <Text style={styles.button}>Criar lista</Text>
                </Gradient>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('PreList')}>
                <Gradient colors={['#609789', '#163F4D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.buttonContainer}>
                    <Text style={styles.button}>Pré Listas</Text>
                </Gradient>
            </TouchableOpacity>
            <Pressable onPress={() => navigation.navigate('SavedLists')}
                style={({ pressed }) => ({
                    opacity: pressed ? 0.5 : null
                })}>
                <Gradient colors={['#609789', '#163F4D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={styles.buttonContainer}>
                    <Text style={styles.button}>Listas salvas</Text>
                </Gradient>
            </Pressable>
        </Gradient>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    title: {
        fontFamily: 'Open Sans',
        color: 'white',
        fontSize: 20,
    },
    textInput: {
        fontFamily: 'Open Sans',
        color: 'white',
        fontSize: 17,
        textAlign: 'center',
        textAlignVertical: 'center',
        marginTop: 35,
        marginBottom: 30,
        width: '70%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 20
    },
    button: {
        fontFamily: 'Open Sans',
        color: 'white',
        fontSize: 17,
    },
    header: {
        width: '100%',
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        width: 150,
        height: 70,
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 30,
        justifyContent: 'center',
        elevation: 15,
    },
    shadow: {
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.5,
        width: '100%',
        shadowRadius: 4
    }
})