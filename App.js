
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
  Alert,
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

  const date = moment().locale('pt-br').format('D     MM    YYYY')

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
      Alert.alert('Campo descrição não pode ficar em branco')
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
      Alert.alert('Campo descrição não pode ficar em branco.')
    }
  }

  const deleteItem = (item) => {
    const deleted = tasks.filter(e => e.id != item.id)
    setTasks(deleted)
  }

  const archiveList = async () => {
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

        realm.create('ListsSchema', {
          id: Math.floor(Math.random() * 65536),
          titulo: nameList,
          date: moment().locale('pt-br').format('DD-MM-YYYY'),
          total: totalPrice,
          items: list
        })
      })

      Alert.alert('Lista salva com sucesso!')

      navigation.dispatch(CommonActions.reset({
        index: 0,
        routes: [
          { name: 'Início' },
          { name: 'Listas Salvas' },
          { name: 'Menu' },
        ]
      }
      ))

    } catch (error) {
      console.log(error.message)
    }
    setNameList()
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
          date: moment().locale('pt-br').format('DD-MM-YYYY'),
          total: totalPrice,
          items: list
        })
      })

      Alert.alert('Salvo na pré lista!')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>

      <Modal transparent={true} visible={visibility}>
        <View style={styles.background}>
          <Gradient colors={['#163F4D', '#609789']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.containerModal}>
            <DropShadow style={styles.shadow}>
              <Gradient colors={['#163F4D', '#609789']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.header}>
                <Text style={styles.text}>Novo Item</Text>
              </Gradient>
            </DropShadow>
            <TextInput style={styles.input} autoFocus placeholder='Descrição do item...' value={value} onChangeText={e => setValue(e)} />
            <TextInput style={styles.input} keyboardType='numeric' keyboardAppearance='dark' placeholder='Quantidade...' value={qtd} onChangeText={(e) => setqtd(e)} />
            <TextInput style={styles.input} keyboardType='decimal-pad' placeholder='Valor' value={price} onChangeText={e => setPrice(e)} />
            <View style={styles.buttons}>
              <TouchableWithoutFeedback onPress={() => setVisibility(false)}>
                <Text style={styles.saveCancel}>Cancelar</Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={saveNewTask}>
                <Text style={styles.saveCancel}>Salvar</Text>
              </TouchableWithoutFeedback>
            </View>
          </Gradient>
        </View>
      </Modal>

      <Modal transparent={true} visible={editVisibility}>
        <View style={styles.background}>
          <Gradient colors={['#163F4D', '#609789']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.containerModal}>
            <DropShadow style={styles.shadow}>
              <Gradient colors={['#163F4D', '#609789']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.header}>
                <Text style={styles.text}>Editar</Text>
              </Gradient>
            </DropShadow>
            <TextInput style={styles.input} autoFocus placeholder='Descrição do item...' value={newDesc} onChangeText={e => setNewDesc(e)} />
            <TextInput style={styles.input} keyboardType='numeric' ty placeholder='Quantidade...' value={newQtd} onChangeText={e => setNewQtd(e)} />
            <TextInput style={styles.input} keyboardType='numeric' placeholder='Valor' value={newPrice} onChangeText={e => setNewPrice(e)} />
            <View style={styles.buttons}>
              <TouchableWithoutFeedback onPress={() => setEditVisibility(false)}>
                <Text style={styles.saveCancel}>Cancelar</Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={saveEditTask}>
                <Text style={styles.saveCancel}>Salvar</Text>
              </TouchableWithoutFeedback>
            </View>
          </Gradient>
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
                  { name: 'Menu' },
                ]
              }
              ))} />
            </View>
            <Text style={styles.nameList}>{nameList}</Text>
            <Icon style={styles.saveIcon} name='save' size={30} color='lightgreen' onPress={savePreList} />
            <Icon style={styles.archiveIcon} name='archive' size={30} color='#FFD700' onPress={archiveList} />
          </Gradient>
        </DropShadow>
        <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>Nova lista</Text>
        <Text style={styles.totalPrice}><Icon name='shopping-cart' size={27} color='lightgreen' />   {format(totalPrice)}</Text>
        <Table>
          <Row data={['Item', 'Qtd', 'ValUnid(R$)', 'Total(R$)']} widthArr={[120, 60, 100, 100]} textStyle={{ color: 'white', marginLeft: 20 }} />
        </Table>
        <ScrollView style={{ marginTop: 20 }}>
          <Table>
            {tasks.map(item => (
              <TouchableWithoutFeedback key={item.id} onPress={() => handleListItem(item)} onLongPress={() => deleteItem(item)}>
                <Row data={[item.desc, item.quant, format(item.price), format(item.quant * item.price)]} widthArr={[120, 60, 100, 100]} textStyle={item.quant * item.price != 0 ? styles.buy : styles.items} />
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
  date: {
    flex: 1,
    alignItems: 'flex-end',
    paddingEnd: 5,
    paddingTop: 8
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
    alignItems: 'center',
    marginTop: 0,
    width: '100%',
    height: 320
  },
  text: {
    fontFamily: 'Open Sans',
    width: '100%',
    height: 60,
    paddingTop: 20,
    color: 'white',
    textAlign: 'center',
    fontSize: 22
  },
  buttons: {
    flex: 1,
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around'
  },
  input: {
    width: '100%',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Open Sans',
    fontSize: 20,
    color: 'white'
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
    width: 190,
    left: 70
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
    fontSize: 15,
    marginLeft: 20,
    marginBottom: 10
  },
  saveIcon: {
    alignSelf: 'center',
    position: 'absolute',
    right: 70
  },
  archiveIcon: {
    alignSelf: 'center',
    position: 'absolute',
    right: 20
  },
  backButton: {
    marginRight: 20,
    position: 'relative',
  }
})