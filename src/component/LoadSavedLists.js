import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'
import getRealm from './DatabaseRealm'
import Gradient from 'react-native-linear-gradient'
import DropShadow from 'react-native-drop-shadow'
import Icon from 'react-native-vector-icons/FontAwesome'


export default function LoadSavedLists({ navigation }) {

    const [lists, setLists] = useState([])

    useEffect(() => {

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


    const handleDelete = async (name) => {
        try {
            const realm = await getRealm()

            const filteredList = lists.filter(e => e.titulo === name)

            realm.write(() => {
                realm.delete(filteredList)
            })
        } catch (error) {
            console.log(error)
        }
    }


    const selectedList = async (list) => {
        navigation.push('SelectedList', {
            titulo: list
        })
    }

    return (
        <Gradient colors={['#163F4D', '#609789']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.background}>
            <DropShadow style={styles.shadow}>
                <Gradient colors={['#609789', '#163F4D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
                    <Icon style={styles.backIcon} name='arrow-left' size={25} color='white' onPress={() => navigation.goBack()} />
                    <Text style={styles.text}>Suas listas</Text>
                </Gradient>
            </DropShadow>

            <ScrollView style={{ width: '100%' }}>
                {lists.map((list, i) => {
                    return (
                        <DropShadow key={i} style={styles.shadowItem}>
                            <Gradient colors={['#609789', '#163F4D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.listItem}>
                                <TouchableWithoutFeedback onLongPress={() => handleDelete(list.titulo)} onPress={() => selectedList(list)}>
                                    <Text style={styles.list}>{list.titulo}</Text>
                                </TouchableWithoutFeedback>
                            </Gradient>
                        </DropShadow>
                    )
                })}
            </ScrollView>
        </Gradient>
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
        color: 'white',
        fontSize: 17,
        fontFamily: 'Open Sans',
        textAlign: 'center'
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
        width: '90%',
        height: 30,
        marginBottom: 10,
    },
    shadowItem: {
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        alignItems: 'center'
    },
    backIcon: {
        marginLeft: 20,
        right: 170
    }
})