import React, { useState, useCallback } from 'react'
import { ScrollView, StyleSheet, Text, TouchableWithoutFeedback, SafeAreaView, View, ImageBackground } from 'react-native'
import getRealm from './DatabaseRealm'
import Gradient from 'react-native-linear-gradient'
import DropShadow from 'react-native-drop-shadow'
import Icon from 'react-native-vector-icons/FontAwesome'
import { CommonActions } from '@react-navigation/native'
import { useFocusEffect } from '@react-navigation/native'
import image from '../../img/arquivar.png'


export default function LoadSavedLists({ navigation }) {

    const [lists, setLists] = useState([])

    useFocusEffect(
        useCallback(() => {

            let isMounted = true

            async function buscar() {
                try {
                    const realm = await getRealm()

                    const data = realm.objects('ListsSchema')

                    if (isMounted) {
                        setLists(data)
                    }

                } catch (error) {
                    console.log(error)
                }
            }
            buscar()

            return () => isMounted = false

        }, [lists])
    )


    const handleDelete = async (id) => {
        try {
            const realm = await getRealm()

            const filteredList = lists.filter(e => e.id === id)

            realm.write(() => {
                realm.delete(filteredList)
            })
        } catch (error) {
            console.log(error)
        }
    }


    const selectedList = async (list) => {
        navigation.navigate('SelectedList', {
            titulo: list
        })
    }

    return (
        <SafeAreaView style={styles.background}>
            <ImageBackground blurRadius={2} imageStyle={{ opacity: 0.5 }} resizeMode='contain' style={{ width: '100%', height: '100%' }} source={image}>
                <DropShadow style={styles.shadow}>
                    <Gradient colors={['#609789', '#163F4D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
                        <Icon style={styles.backIcon} name='arrow-left' size={25} color='white' onPress={() => navigation.dispatch(CommonActions.reset({
                            index: 0,
                            routes: [
                                { name: 'Início' },
                                { name: 'Listas Salvas' },
                            ]
                        }
                        ))} />
                        <Text style={styles.text}>Armazenadas</Text>
                    </Gradient>
                </DropShadow>

                <ScrollView style={{ width: '100%' }}>
                    {lists.map((list, i) => {
                        return (
                            <DropShadow key={i} style={styles.shadowItem}>
                                <View style={styles.listItem}>
                                    <TouchableWithoutFeedback onLongPress={() => handleDelete(list.id)} onPress={() => selectedList(list)}>
                                        <View style={styles.containerList}>
                                            <Text style={styles.list}>{list.titulo}</Text>
                                            <Text style={styles.dateList}>{list.date}</Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </DropShadow>
                        )
                    })}
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        flex: 1
    },
    text: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Open Sans',
        textAlign: 'center',
        position: 'absolute'
    },
    list: {
        color: 'gray',
        fontSize: 18,
        fontFamily: 'Open Sans',
        marginLeft: 10
    },
    back: {
        color: 'white',
        fontSize: 17,
        fontFamily: 'Open Sans',
    },
    shadow: {
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.5,
        width: '100%',
        shadowRadius: 4,
        marginBottom: 20
    },
    header: {
        width: '100%',
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    listItem: {
        width: '95%',
        height: 50,
        marginBottom: 10,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    shadowItem: {
        shadowColor: 'black',
        shadowOffset: {
            width: 1,
            height: 3
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        alignItems: 'center'
    },
    backIcon: {
        marginLeft: 20,
        right: 170
    },
    containerList: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dateList: {
        color: 'gray',
        fontSize: 15,
        fontFamily: 'Open Sans',
        marginRight: 10
    }
})