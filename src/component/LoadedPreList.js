import React, { useState, useEffect } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    Modal,
    TouchableWithoutFeedback,
    TextInput,
    ScrollView,
    Alert,
    LogBox
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import 'moment/locale/pt-br'
import getRealm from './DatabaseRealm'
import Intl from 'intl'
import 'intl/locale-data/jsonp/pt-BR'
import Gradient from 'react-native-linear-gradient'
import { Table, Row } from 'react-native-table-component'
import DropShadow from 'react-native-drop-shadow'
import Toast from 'react-native-toast-message'
import { CommonActions } from '@react-navigation/native'


export default function LoadedPreList({ navigation, route }) {

    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
    ])

    const [nameList, setName] = useState(route.params.name)
    const [items, setItems] = useState([])
    const [visibility, setVisibility] = useState(false)
    const [description, setDescription] = useState()
    const [quantidade, setQuantidade] = useState()
    const [price, setPrice] = useState()
    const [totalPrice, setTotalPrice] = useState()
    const [editVisibility, setEditVisibility] = useState(false)
    const [newDesc, setNewDesc] = useState()
    const [newQtd, setNewQtd] = useState()
    const [newPrice, setNewPrice] = useState()
    const [newID, setNewID] = useState()
    const [id, setId] = useState()

    useEffect(() => {
        let isMounted = true

        const getLoadList = async () => {
            try {
                const realm = await getRealm()

                const data = realm.objects('PreListSchema').filtered(`titulo = "${nameList}"`)

                if (isMounted) {
                    setItems(data[0].items)
                    setId(data[0].id)
                }
            } catch (error) {
                console.log(error)
            }

        }
        getLoadList()

        return () => isMounted = false

    }, [])

    useEffect(() => {
        let isMounted = true

        if (isMounted) {
            setTotalPrice(items.map(e => e.total).reduce((acc, curr) => {
                return acc + curr
            }, 0))
        }

        return () => isMounted = false
    }, [items])

    const format = (number) => Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 5 }).format(number)

    const savePreList = async () => {
        try {
            const realm = await getRealm()

            realm.write(() => {

                const list = items.map(e => {
                    return {
                        id: e.id,
                        description: e.description,
                        quantidade: e.quantidade,
                        price: e.price,
                        total: e.price * e.quantidade
                    }
                })

                realm.create('PreListSchema', {
                    id: id,
                    titulo: nameList,
                    date: moment().locale('pt-br').format('DD / MM / YYYY'),
                    total: totalPrice,
                    items: list
                }, 'modified')
            })

            Toast.show({
                type: 'success',
                text1: 'Pré-lista salva!',
                topOffset: 50
            })
        } catch (error) {
            console.log(error)
        }
    }

    const saveNewTask = () => {
        if (description) {
            const newItems = {
                id: Math.floor(Math.random() * 65536),
                description: description,
                quantidade: quantidade || '1',
                price: price || '0',
                total: quantidade * price || 0
            }

            setItems([...items, newItems])
            setVisibility(false)
            setDescription()
            setQuantidade()
            setPrice()
        } else {
            Alert.alert('Campo descrição não pode ficar em branco.')
        }
    }

    const handleListItem = (event) => {
        setEditVisibility(true)
        setNewDesc(event.description)
        setNewQtd(event.quantidade)
        setNewPrice(event.price)
        setNewID(event.id)
    }

    const saveEditTask = () => {
        if (newDesc) {
            const editedItems = {
                id: newID,
                description: newDesc,
                quantidade: newQtd,
                price: newPrice,
                total: newQtd * newPrice
            }
            const filteredList = items.filter(e => e.id != editedItems.id)
            setItems([...filteredList, editedItems])
            setEditVisibility(false)
        } else {
            Alert.alert('Campo descrição não pode ficar em branco.')
        }
    }

    const deleteItem = (item) => {
        const filtered = items.filter(e => e.id != item.id)
        setItems(filtered)
    }

    return (
        <SafeAreaView style={styles.container}>

            <Modal transparent={true} visible={visibility}>
                <View style={styles.background}>
                    <View style={styles.containerModal}>
                        <DropShadow style={styles.shadow}>
                            <Gradient colors={['#163F4D', '#609789']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.headerNewEdit}>
                                <Icon name='arrow-left' color='white' size={25} onPress={() => setVisibility(false)} style={{ position: 'absolute', left: 20, alignSelf: 'center', zIndex: 9 }} />
                                <Text style={styles.text}>Novo Item</Text>
                                <Icon name='check' color='white' size={25} onPress={saveNewTask} style={{ position: 'absolute', right: 20, alignSelf: 'center' }} />
                            </Gradient>
                        </DropShadow>

                        <Text style={{ color: '#609789', textAlign: 'left', marginLeft: 20, marginTop: 20, fontSize: 15 }}>Nome</Text>
                        <TextInput style={styles.input} autoFocus placeholder='Descrição do item...' value={description} onChangeText={e => setDescription(e)} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                            <View style={{ width: '40%', marginLeft: 20 }}>
                                <Text style={{ color: '#609789', textAlign: 'left', marginTop: 10, fontSize: 15 }}>Quantidade</Text>
                                <TextInput style={{ borderBottomWidth: 1, width: '100%' }} keyboardType='numeric' keyboardAppearance='dark' placeholder='0' value={quantidade} onChangeText={(e) => setQuantidade(e)} />
                            </View>
                            <View style={{ width: '40%', marginRight: 20 }}>
                                <Text style={{ color: '#609789', textAlign: 'left', marginTop: 10, fontSize: 15 }}>Valor(R$)</Text>
                                <TextInput style={{ borderBottomWidth: 1, width: '100%' }} keyboardType='decimal-pad' placeholder='0,00' value={price} onChangeText={e => setPrice(e)} />
                            </View>
                        </View>

                    </View>
                </View>
            </Modal>

            <Modal transparent={true} visible={editVisibility}>
                <View style={styles.background}>
                    <View style={styles.containerModal}>
                        <DropShadow style={styles.shadow}>
                            <Gradient colors={['#163F4D', '#609789']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.headerNewEdit}>
                                <Icon name='arrow-left' color='white' size={25} onPress={() => setEditVisibility(false)} style={{ position: 'absolute', left: 20, alignSelf: 'center', zIndex: 9 }} />
                                <Text style={styles.text}>Editar</Text>
                                <Icon name='check' color='white' size={25} onPress={saveEditTask} style={{ position: 'absolute', right: 20, alignSelf: 'center' }} />
                            </Gradient>
                        </DropShadow>

                        <Text style={{ color: '#609789', textAlign: 'left', marginLeft: 20, marginTop: 20, fontSize: 15 }}>Nome</Text>
                        <TextInput style={styles.input} autoFocus placeholder='Descrição do item...' value={newDesc} onChangeText={e => setNewDesc(e)} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                            <View style={{ width: '40%', marginLeft: 20 }}>
                                <Text style={{ color: '#609789', textAlign: 'left', marginTop: 10, fontSize: 15 }}>Quantidade</Text>
                                <TextInput style={{ borderBottomWidth: 1, width: '100%' }} keyboardType='numeric' keyboardAppearance='dark' placeholder='0' value={newQtd} onChangeText={(e) => setNewQtd(e)} />
                            </View>
                            <View style={{ width: '40%', marginRight: 20 }}>
                                <Text style={{ color: '#609789', textAlign: 'left', marginTop: 10, fontSize: 15 }}>Valor(R$)</Text>
                                <TextInput style={{ borderBottomWidth: 1, width: '100%' }} keyboardType='decimal-pad' placeholder='0,00' value={newPrice} onChangeText={e => setNewPrice(e)} />
                            </View>
                        </View>

                    </View>
                </View>
            </Modal>


            <Gradient colors={['#163F4D', '#609789']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{ flex: 1, width: '100%', height: '100%' }}>
                <DropShadow style={styles.shadow}>
                    <Gradient colors={['#609789', '#163F4D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
                        <View style={styles.menu}>
                            <Icon name='arrow-left' size={25} color='white' onPress={() => navigation.dispatch(CommonActions.reset({
                                index: 0,
                                routes: [
                                    { name: 'Início' },
                                    { name: 'Listas Salvas' },
                                ]
                            }
                            ))} />
                        </View>
                        <Text style={styles.nameList}>{nameList}</Text>
                        <Icon style={styles.saveIcon} name='save' size={30} color='lightgreen' onPress={savePreList} />
                    </Gradient>
                </DropShadow>
                <Toast ref={ref => Toast.setRef(ref)} />
                <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Pré-lista</Text>
                <Text style={styles.totalPrice}><Icon name='shopping-cart' size={27} color='lightgreen' />   {format(totalPrice)}</Text>
                <Table>
                    <Row data={['Item', 'Qtd', 'ValUnid', 'Total']} widthArr={[120, 60, 100, 100]} textStyle={{ color: 'yellow', marginLeft: 20, fontSize: 16 }} />
                </Table>
                <ScrollView style={{ marginTop: 20 }}>
                    <Table>
                        {items.map((item, i) => (
                            <TouchableWithoutFeedback key={i} onPress={() => handleListItem(item)} onLongPress={() => deleteItem(item)}>
                                <Row data={[item.description, item.quantidade, format(item.price), format(Number(item.quantidade) * Number(item.price))]} widthArr={[120, 60, 103, 105]} textStyle={item.price != 0 ? styles.buy : styles.items} />
                            </TouchableWithoutFeedback>
                        ))}
                    </Table>
                </ScrollView>

                <Icon style={styles.add} name="plus" size={70} onPress={() => setVisibility(true)} />

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
    background: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        flex: 1,
        alignItems: 'center',
        width: '100%',
        height: 320
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
        marginBottom: 10
    },
    menu: {
        marginLeft: 30
    },
    nameList: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Open Sans',
        textAlign: 'center',
        alignSelf: 'center',
        position: 'absolute',
        width: '70%',
        right: '15%',
    },
    saveIcon: {
        alignSelf: 'center',
        position: 'absolute',
        right: 20
    },
    totalPrice: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Open Sans',
        marginTop: 10,
        marginLeft: 20,
        marginBottom: 20
    },
    buy: {
        fontFamily: 'Open Sans',
        color: 'lightgreen',
        fontSize: 16,
        marginLeft: 20,
        marginBottom: 10,
        textDecorationLine: 'line-through'
    },
    items: {
        fontFamily: 'Open Sans',
        color: 'white',
        fontSize: 15,
        marginLeft: 20,
        marginBottom: 10
    },
    header: {
        width: '100%',
        height: 70,
        justifyContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    add: {
        position: 'absolute',
        marginLeft: 40,
        color: '#163F4D',
        bottom: 30,
        right: 30
    },
    containerModal: {
        marginTop: 0,
        width: '100%',
        height: 320,
        backgroundColor: 'white'
    },
    input: {
        width: '90%',
        textAlign: 'left',
        fontFamily: 'Open Sans',
        fontSize: 15,
        color: 'gray',
        borderBottomWidth: 1,
        alignSelf: 'center'
    },
    headerNewEdit: {
        alignItems: 'center',
        height: 70,
        justifyContent: 'center'
    },
    text: {
        color: 'white',
        fontSize: 20
    },
    saveCancel: {
        fontFamily: 'Open Sans',
        color: 'white',
        fontSize: 22
    },
})