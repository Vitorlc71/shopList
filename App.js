
import React, { useEffect, useState } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
  ToastAndroid,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import 'moment/locale/pt-br'
import getRealm from './src/component/DatabaseRealm'
import Intl from 'intl'
import 'intl/locale-data/jsonp/pt-BR'
import Gradient from 'react-native-linear-gradient'
import { Table, Row } from 'react-native-table-component'
import DropShadow from 'react-native-drop-shadow'
import { CommonActions } from '@react-navigation/native'

export default function App({ navigation, route }) {

  const [tasks, setTasks] = useState([])
  const [visibility, setVisibility] = useState(false)
  const [value, setValue] = useState('')
  const [qtd, setqtd] = useState()
  const [price, setPrice] = useState()
  const [editVisibility, setEditVisibility] = useState(false)
  const [newDesc, setNewDesc] = useState()
  const [newQtd, setNewQtd] = useState()
  const [newPrice, setNewPrice] = useState()
  const [ID, setID] = useState()
  const [totalPrice, setTotalPrice] = useState()
  const [nameList, setNameList] = useState(route.params.nameList)


  useEffect(() => {
    let isMounted = true
    try {
      const total = tasks.reduce((acc, curr) => {
        return acc + (curr.total || 0)
      }, 0)

      if (isMounted) {
        setTotalPrice(total)
      }
    } catch (error) {
      console.log(error)
    }

    return () => isMounted = false
  }, [tasks])

  const format = (number) => Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 5 }).format(number)

  const saveNewTask = () => {
    if (value) {
      const newTask = {
        id: Math.floor(Math.random() * 65536),
        desc: value,
        quant: qtd || '1',
        price: price || '0',
        total: qtd * price || 0
      }
      setTasks([...tasks, newTask])
      setVisibility(false)
      setValue()
      setqtd()
      setPrice()
    } else {
      ToastAndroid.showWithGravityAndOffset(
        'Campo descrição não pode ficar vazio.',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        0,
        100
      )
    }
  }

  const handleListItem = (event) => {
    setNewDesc(event.desc)
    setNewQtd(event.quant)
    setNewPrice(event.price)
    setID(event.id)
    setEditVisibility(true)
  }

  const saveEditTask = () => {
    if (newDesc) {
      const editedTask = {
        id: ID,
        desc: newDesc,
        quant: newQtd,
        price: newPrice,
        total: newQtd * newPrice
      }
      const filteredTask = tasks.filter(e => e.id != editedTask.id)
      setTasks([...filteredTask, editedTask])
      setEditVisibility(false)
    } else {
      ToastAndroid.showWithGravityAndOffset(
        'Campo descrição não pode ficar vazio.',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        0,
        100
      )
    }
  }

  const deleteItem = (item) => {
    const deleted = tasks.filter(e => e.id != item.id)
    setTasks(deleted)
  }

  const savePreList = async () => {
    try {
      const realm = await getRealm()

      realm.write(() => {
        const list = tasks.map(e => {
          return {
            id: e.id,
            description: e.desc,
            quantidade: e.quant,
            price: e.price,
            total: e.price * e.quant
          }
        })

        realm.create('PreListSchema', {
          id: Math.floor(Math.random() * 65536),
          titulo: nameList,
          date: moment().locale('pt-br').format('DD / MM / YYYY'),
          total: totalPrice,
          items: list
        }, 'modified')
      })

      navigation.dispatch(CommonActions.reset({
        index: 0,
        routes: [
          { name: 'Início' },
          { name: 'Listas Salvas' },
        ]
      }
      ))
      ToastAndroid.showWithGravityAndOffset(
        'Lista criada. Continue editando sua lista',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        0,
        100
    )

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>

      <Modal transparent={true} visible={visibility}>
        <View style={styles.background}>
          <View style={styles.containerModal}>
            <DropShadow style={styles.shadow}>
              <Gradient colors={['#163F4D', '#609789']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.header}>
                <Icon name='arrow-left' color='white' size={25} onPress={() => setVisibility(false)} style={{ position: 'absolute', left: 20, alignSelf: 'center', zIndex: 9 }} />
                <Text style={styles.text}>Novo Item</Text>
                <Icon name='check' color='white' size={25} onPress={saveNewTask} style={{ position: 'absolute', right: 20, alignSelf: 'center' }} />
              </Gradient>
            </DropShadow>
            <Text style={{ color: '#609789', textAlign: 'left', marginLeft: 20, marginTop: 20, fontSize: 15 }}>Nome</Text>
            <TextInput style={styles.input} autoFocus placeholder='Descrição do item...' value={value} onChangeText={e => setValue(e)} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <View style={{ width: '40%', marginLeft: 20 }}>
                <Text style={{ color: '#609789', textAlign: 'left', marginTop: 10, fontSize: 15 }}>Quantidade</Text>
                <TextInput style={{ borderBottomWidth: 1, width: '100%' }} keyboardType='numeric' keyboardAppearance='dark' placeholder='0' value={qtd} onChangeText={(e) => setqtd(e)} />
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
              <Gradient colors={['#163F4D', '#609789']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.header}>
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

            <View style={styles.buttons}>
              <TouchableWithoutFeedback onPress={() => setEditVisibility(false)}>
                <Text style={styles.saveCancel}>Cancelar</Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={saveEditTask}>
                <Text style={styles.saveCancel}>Salvar</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </Modal>

      <Gradient colors={['#163F4D', '#609789']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={{ flex: 1, width: '100%', height: '100%' }}>
        <DropShadow style={styles.shadow}>
          <Gradient colors={['#609789', '#163F4D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
            <View style={styles.menu}>
              <Icon style={styles.backButton} name='arrow-left' size={25} color='white' onPress={() => navigation.dispatch(CommonActions.reset({
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
        <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>Nova lista</Text>
        <Text style={styles.totalPrice}><Icon name='shopping-cart' size={27} color='lightgreen' />   {format(totalPrice)}</Text>
        <Table>
          <Row data={['Item', 'Qtd', 'ValUnid', 'Total']} widthArr={[120, 60, 100, 100]} textStyle={{ color: 'yellow', marginLeft: 20, fontSize: 16 }} />
        </Table>
        <ScrollView style={{ marginTop: 20 }}>
          <Table>
            {tasks.map(item => (
              <TouchableWithoutFeedback key={item.id} onPress={() => handleListItem(item)} onLongPress={() => deleteItem(item)}>
                <Row data={[item.desc, item.quant, format(item.price), format(item.quant * item.price)]} widthArr={[120, 60, 103, 103]} textStyle={item.quant * item.price != 0 ? styles.buy : styles.items} />
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
  menu: {
    flexDirection: 'row',
    textAlign: 'left',
    paddingLeft: 20,
    paddingTop: 20,
    justifyContent: 'center'
  },
  items: {
    fontFamily: 'Open Sans',
    color: 'white',
    fontSize: 15,
    marginLeft: 20,
    marginBottom: 10
  },
  add: {
    position: 'absolute',
    marginLeft: 40,
    color: '#163F4D',
    bottom: 30,
    right: 30
  },
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: 320
  },
  containerModal: {
    marginTop: 0,
    width: '100%',
    height: 320,
    backgroundColor: 'white'
  },
  text: {
    fontFamily: 'Open Sans',
    width: '100%',
    height: 60,
    paddingTop: 20,
    color: 'white',
    textAlign: 'center',
    fontSize: 20
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
  saveCancel: {
    fontFamily: 'Open Sans',
    color: 'white',
    fontSize: 22
  },
  nameList: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Open Sans',
    textAlign: 'center',
    alignSelf: 'center',
    position: 'absolute',
    width: '70%',
    right: '15%'
  },
  totalPrice: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Open Sans',
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 20
  },
  header: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
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
  buy: {
    fontFamily: 'Open Sans',
    color: 'lightgreen',
    fontSize: 16,
    marginLeft: 20,
    marginBottom: 10,
    textDecorationLine: 'line-through',
  },
  saveIcon: {
    alignSelf: 'center',
    position: 'absolute',
    right: 20
  },
  backButton: {
    marginRight: 20,
    position: 'relative',
  }
})