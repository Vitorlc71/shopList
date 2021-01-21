import React from 'react'
import { View, Text, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import Button from './Button'
import Gradient from 'react-native-linear-gradient'
import DropShadow from 'react-native-drop-shadow'

export default function Menu({ newStateList, componentVisibility, closeMenu, handleSaveList }) {
    return (
        <Modal transparent={true} visible={componentVisibility}>
            <View style={styles.background}>
                <Gradient colors={['#163F4D', '#609789']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.menu}>
                    <DropShadow style={styles.shadow}>
                        <Gradient colors={['#609789', '#163F4D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
                            <Text style={styles.text}>Menu</Text><Button designedFunction={closeMenu} style={styles.button} Name='X' />
                        </Gradient>
                    </DropShadow>
                    <DropShadow style={styles.shadows}>
                        <Gradient colors={['#163F4D', '#609789']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.shadowButtons}>
                            <TouchableWithoutFeedback onPress={handleSaveList}>
                                <Text style={styles.textList}>Salvar lista</Text>
                            </TouchableWithoutFeedback>
                        </Gradient>
                    </DropShadow>
                    <DropShadow style={styles.shadows}>
                        <Gradient colors={['#163F4D', '#609789']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.shadowButtons}>
                            <TouchableWithoutFeedback onPress={newStateList}>
                                <Text style={styles.textList}>Nova lista</Text>
                            </TouchableWithoutFeedback>
                        </Gradient>
                    </DropShadow>
                </Gradient>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
        flex: 1
    },
    container: {
        textAlign: 'center',
        flexDirection: 'row',
        paddingTop: 20,
        paddingBottom: 30,
    },
    text: {
        width: '87%',
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
        fontSize: 22,
        fontFamily: 'Open Sans',
        left: 15
    },
    button: {
        position: 'relative',
        alignSelf: 'flex-end',
        flex: 1
    },
    textList: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Open Sans',
        textAlign: 'center',
    },
    menu: {
        alignItems: 'center',
        height: 320,
        width: '100%',
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
    },
    header: {
        width: '100%',
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 50
    },
    shadowButtons: {
        width: '90%',
        height: 70,
        marginBottom: 10,
        justifyContent: 'center',
        
    },
    shadows: {
        width: '100%',
        shadowColor: 'black',
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        alignItems: 'center'
    }
})