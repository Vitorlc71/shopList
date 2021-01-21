
import React, { useEffect, useState } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import 'moment/locale/pt-br'
import getRealm from './DatabaseRealm'
import 'intl/locale-data/jsonp/pt-BR'
import Gradient from 'react-native-linear-gradient'
import DropShadow from 'react-native-drop-shadow'

export default function PreList({ navigation, route }) {

    const [nameList, setNameList] = useState([])

    useEffect(() => {
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
    }, [nameList])

    const deleteList = async (list) => {
        const realm = await getRealm()
        const selectedList = nameList.filter(e => e.titulo === list.titulo)

        realm.write(() => {
            realm.delete(selectedList)
        })
    }


    return (
        <SafeAreaView style={styles.container}>
            <Gradient colors={['#163F4D', '#609789']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{ flex: 1, width: '100%', height: '100%' }}>
                <DropShadow style={styles.shadow}>
                    <Gradient colors={['#609789', '#163F4D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
                        <Icon style={styles.menu} name='arrow-left' size={25} color='white' onPress={() => navigation.goBack()} />
                        <Text style={styles.title}>Pré-listas</Text>
                    </Gradient>
                </DropShadow>
                <View style={styles.containerList}>
                    {nameList.map((e, i) => {
                        return (
                            <TouchableWithoutFeedback key={i} onLongPress={() => deleteList(e)} onPress={() => navigation.push('LoadedPreList', {
                                name: e.titulo
                            })}>
                                <Text style={styles.nameList}>{e.titulo}</Text>
                            </TouchableWithoutFeedback>
                        )
                    })}
                </View>
            </Gradient>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    header: {
        width: '100%',
        height: 70,
        justifyContent: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
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
    nameList: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Open Sans',
        textAlign: 'left',
        textAlignVertical: 'center',
    },
    saveIcon: {
        alignSelf: 'center',
        marginRight: 20,
    },
    containerList: {
        marginTop: 30,
        marginLeft: 30
    },
    menu: {
        right: 160
    },
    title: {
        color: 'white',
        fontSize: 20,
        position: 'absolute',
    }
})