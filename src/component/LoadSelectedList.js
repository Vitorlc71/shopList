import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, LogBox, BackHandler } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import DropShadow from 'react-native-drop-shadow'
import Gradient from 'react-native-linear-gradient'
import Intl from 'intl'
import 'intl/locale-data/jsonp/pt-BR'
import Icon from 'react-native-vector-icons/FontAwesome'
import { CommonActions } from '@react-navigation/native'


export default function LoadSelectedList({ route, navigation }) {

    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
    ])

    const [listName, setListName] = useState([])
    const [title, setTitle] = useState()
    const [date, setDate] = useState()
    const [total, setTotal] = useState()

    useEffect(() => {
        const getList = () => {

            setListName(route.params.titulo.items)
            setTitle(route.params.titulo.titulo)
            setDate(route.params.titulo.date)
            setTotal(route.params.titulo.total)

            BackHandler.addEventListener('hardwareBackPress', () => {
                navigation.dispatch(CommonActions.reset({
                    index: 1,
                    routes: [
                        { name: 'Início' },
                        { name: 'Listas Salvas' },
                    ]
                }
                ))
                return true
            })

        }
        getList()

    }, [])

    const format = (number) => Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 5 }).format(number)

    return (
        <View style={styles.background}>
            <DropShadow style={styles.shadow}>
                <Gradient colors={['#609789', '#163F4D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
                    <Icon name='arrow-left' size={25} color='white' style={styles.back} onPress={() => navigation.dispatch(CommonActions.reset({
                        index: 0,
                        routes: [{
                            name: 'Listas Salvas'
                        }]
                    }
                    ))} />
                    <Text style={{ color: 'white', fontSize: 20 }}>Sua lista</Text>
                </Gradient>
            </DropShadow>
            <Text style={styles.text}>Lista:   {title}</Text>
            <Text style={styles.text}>Data:   {date}</Text>
            <View style={styles.separate}></View>
            <View style={{ flexDirection: 'row', marginBottom: 12, alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
                <Text style={{ position: 'absolute', left: 20, fontWeight: 'bold', fontSize: 18 }}>Item</Text>
                <Text style={{ position: 'absolute', fontWeight: 'bold', fontSize: 18 }}>Qtd.</Text>
                <Text style={{ position: 'absolute', right: 20, fontWeight: 'bold', fontSize: 18 }}>Valor</Text>
            </View>
            <View style={styles.separate}></View>
            <ScrollView>
                {listName.map((list, i) => {
                    return (
                        <View style={{ flexDirection: 'row', marginBottom: 12, alignItems: 'center', justifyContent: 'center', marginTop: 8 }} key={i}>
                            <Text style={{ position: 'absolute', left: 20 }}>{list.description}</Text>
                            <Text style={{ position: 'absolute' }}>{list.quantidade}</Text>
                            <Text style={{ position: 'absolute', right: 20 }}>{format(list.price)}</Text>
                        </View>
                    )
                })}
                <View style={styles.separate}></View>
                <View style={styles.totalContainer}>
                    <Text style={styles.total}>Valor total:</Text><Text style={styles.total}>{format(total)}</Text>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#E9E19D'
    },
    text: {
        color: 'black',
        fontSize: 17,
        fontFamily: 'Arial',
        marginLeft: 20,
        fontWeight: 'bold'
    },
    back: {
        position: 'absolute',
        left: 20
    },
    header: {
        backgroundColor: 'darkblue',
        height: 60,
        justifyContent: 'center',
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    separate: {
        borderColor: 'black',
        borderBottomWidth: 0.8,
        marginBottom: 20,
        marginTop: 20,
        width: '90%',
        alignSelf: 'center'
    },
    total: {
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'right'
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 20,
        marginRight: 20
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
})