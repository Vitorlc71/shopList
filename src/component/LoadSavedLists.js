import React, { useState, useCallback } from 'react'
import { ScrollView, StyleSheet, Text, TouchableWithoutFeedback, SafeAreaView, View, ImageBackground, BackHandler } from 'react-native'
import getRealm from './DatabaseRealm'
import Gradient from 'react-native-linear-gradient'
import DropShadow from 'react-native-drop-shadow'
import Icon from 'react-native-vector-icons/FontAwesome'
import { CommonActions } from '@react-navigation/native'
import { useFocusEffect } from '@react-navigation/native'
import image from '../../img/arquivarRedim1.png'
import MyContext from './MyContext'


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

                    BackHandler.addEventListener('hardwareBackPress', () => {
                        navigation.dispatch(CommonActions.reset({
                            index: 0,
                            routes: [
                                { name: 'Início' },
                                { name: 'Listas Salvas' },
                            ]
                        }
                        ))
                        return true
                    })

                } catch (error) {
                    console.log(error)
                }
            }
            buscar()

            return () => isMounted = false

        }, [lists])
    )

    const format = (number) => Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 5 }).format(number)

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
        <MyContext.Consumer>
            {value => (<SafeAreaView style={styles.background}>
                <ImageBackground blurRadius={2} imageStyle={{ opacity: 0.3 }} resizeMode='contain' style={{ width: '100%', height: '100%' }} source={image}>
                    <DropShadow style={styles.shadow}>
                        <Gradient colors={value} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
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
                                                <Text style={styles.dateList}>Data: {list.date}</Text>
                                                <Text style={styles.dateList}>Itens: {list.items.length}</Text>
                                                <Text style={styles.dateList}>Total: {format(list.total)}</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </DropShadow>
                            )
                        })}
                    </ScrollView>
                </ImageBackground>
            </SafeAreaView>)}
        </MyContext.Consumer>
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
        fontSize: 20,
        fontFamily: 'Open Sans',
        marginBottom: 10,
        fontWeight: 'bold'
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
        height: 110,
        marginBottom: 10,
        borderRadius: 5,
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingLeft: 10
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

    },
    dateList: {
        color: 'gray',
        fontSize: 15,
        fontFamily: 'Open Sans',
        marginRight: 10
    }
})