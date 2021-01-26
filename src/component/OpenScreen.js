import React, { useState, useEffect, useCallback } from 'react'
import {
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Modal,
    View,
    ScrollView,
    TouchableWithoutFeedback,
} from 'react-native'
import Gradient from 'react-native-linear-gradient'
import DropShadow from 'react-native-drop-shadow'
import Toast from 'react-native-toast-message'
import Icon from 'react-native-vector-icons/FontAwesome'
import getRealm from './DatabaseRealm'
import { useFocusEffect } from '@react-navigation/native'

export default function OpenScreen({ navigation }) {

    const [newName, setNewName] = useState()
    const [isVisible, setIsVisible] = useState(false)
    const [nameList, setNameList] = useState([])

    useFocusEffect(
        useCallback(() => {
            let isMounted = true

            const getPreList = async () => {
                try {
                    const realm = await getRealm()

                    const data = realm.objects('PreListSchema')

                    if (isMounted) {
                        setNameList(data)
                    }


                } catch (error) {
                    console.log(error)
                }
            }
            getPreList()

            return () => isMounted = false

        }, [nameList],
        )
    )

    const deleteList = async (list) => {
        const realm = await getRealm()
        const selectedList = nameList.filter(e => e.titulo === list.titulo)

        realm.write(() => {
            realm.delete(selectedList)
        })
    }

    const ProgressBar = ({ value, value2 }) => {
        return (
            <View style={{
                backgroundColor: 'lightblue',
                height: 3,
                maxWidth: `${value2 * 100}%`,
            }}>
                <View style={{
                    backgroundColor: '#609789',
                    maxWidth: `${(value / value2) * 100}%`,
                    height: 3,
                }}>

                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.background}>
            <Modal transparent={true} visible={isVisible}>
                <View style={styles.backgroundModal}>
                    <Toast ref={ref => Toast.setRef(ref)} />
                    <View style={styles.modalView}>
                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 20, marginTop: 10 }}>Nova lista</Text>
                        <TextInput style={styles.textInput} autoFocus={true} placeholder='Nome da lista' value={newName} onChangeText={(e) => setNewName(e)} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                            <TouchableOpacity onPress={() => {
                                setIsVisible(false)
                                setNewName()
                            }}>
                                <Text style={styles.closeModal}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => {
                                if (newName) {
                                    navigation.navigate('Menu', {
                                        screen: 'CreateList',
                                        params: {
                                            nameList: newName
                                        }
                                    }
                                    )
                                    setNewName()
                                    setIsVisible(false)
                                } else {
                                    Toast.show({
                                        type: 'error',
                                        text1: 'Informe um nome para sua lista.',
                                        text2: 'Será mais fácil identificar posteriormente.'
                                    })
                                    return
                                }
                            }}>
                                <Text style={styles.buttonCreate}>Criar lista</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <DropShadow style={styles.shadow}>
                <Gradient colors={['#609789', '#163F4D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
                    <Icon style={{ position: 'absolute', left: 20 }} name='bars' size={30} color='white' onPress={() => navigation.toggleDrawer()} />
                    <Text style={styles.title}>Minhas listas</Text>
                </Gradient>
            </DropShadow>

            <View style={styles.containerList}>
                {nameList.map((e, i) => {
                    return (
                        <TouchableWithoutFeedback key={i} onLongPress={() => deleteList(e)} onPress={() => navigation.navigate('Menu', {
                            screen: 'LoadedPreList',
                            params: {
                                name: e.titulo
                            }
                        })}>
                            <DropShadow style={styles.shadowItemContainer}>
                                <View style={styles.containerShadow}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.nameList}>{e.titulo}</Text>
                                        <Text style={{ color: '#163F4D', position: 'absolute', right: 10, fontSize: 20 }}>{e.items.filter(e => e.price != 0).length}/{e.items.length}</Text>
                                    </View>
                                    <ProgressBar value2={e.items.length} value={e.items.filter(e => e.price != 0).length} />
                                </View>
                            </DropShadow>
                        </TouchableWithoutFeedback>
                    )
                })}
            </View>

            <Icon style={styles.icon} name='plus' size={50} color='#609789' onPress={() => setIsVisible(true)} />
        </SafeAreaView>
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
        textAlign: 'center',
        position: 'absolute'
    },
    textInput: {
        fontFamily: 'Open Sans',
        color: 'white',
        fontSize: 17,
        textAlign: 'center',
        marginTop: 0,
        marginBottom: 10,
        width: '90%',
        borderBottomWidth: 1,
        alignSelf: 'center'
    },
    button: {
        fontFamily: 'Open Sans',
        color: 'red',
        fontSize: 17,
    },
    header: {
        width: '100%',
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
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
            height: 2
        },
        shadowOpacity: 0.4,
        width: '100%',
        shadowRadius: 2
    },
    modalView: {
        backgroundColor: '#609789',
        height: 150,
        width: '90%',
        alignSelf: 'center',
        marginTop: '40%'
    },
    buttonCreate: {
        color: 'white',
        fontSize: 18,
        right: 20
    },
    closeModal: {
        color: 'white',
        fontSize: 18,
        left: 20
    },
    backgroundModal: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        height: '100%',
        width: '100%'
    },
    icon: {
        position: 'absolute',
        bottom: 20,
        right: 30
    },
    containerList: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nameList: {
        color: 'black',
        fontSize: 20,
        fontFamily: 'Open Sans',
        marginBottom: 10,
        width: '85%'
    },
    shadowItemContainer: {
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowRadius: 2,
        shadowOffset: {
            width: 1,
            height: 2
        },
        width: '100%',
    },
    containerShadow: {
        width: '95%',
        height: 70,
        marginTop: 10,
        borderRadius: 4,
        justifyContent: 'center',
        backgroundColor: 'white',
        alignSelf: 'center',
        padding: 10,
    }
})