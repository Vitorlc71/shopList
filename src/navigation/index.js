import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import OpenScreen from '../component/OpenScreen'
import CreateList from '../../App'
import LoadSavedLists from '../component/LoadSavedLists'
import LoadSelectedList from '../component/LoadSelectedList'
import LoadedPreList from '../component/LoadedPreList'
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer'
import { Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'


const Drawer = createDrawerNavigator()

const CustomDrawer = ({ navigation }) => {
    return (
        <View>
            <View style={{
                height: 100,
                width: '100%',
                backgroundColor: '#609789',
                justifyContent: 'center'
            }}>
                <Text style={{
                    textAlign: 'center',
                    fontSize: 30,
                    fontWeight: 'bold',
                    alignSelf: 'center',
                    position: 'absolute',
                    zIndex: 7,
                    color: 'white',
                    textShadowColor: 'black',
                    textShadowOffset: {
                        width: 3,
                        height: 3
                    },
                    shadowOpacity: 0.5,
                    textShadowRadius: 4,
                }}>
                    Bem Vindo
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', opacity: 0.4 }}>
                    <Icon name='shopping-cart' size={60} color='#163F4D' />
                    <Icon name='shopping-basket' size={50} color='#163F4D' />
                    <Icon name='apple' size={60} color='#163F4D' />
                    <Icon name='calculator' size={50} color='#163F4D' />
                </View>
            </View>
            <View style={{ marginTop: 10 }}>
                <DrawerItem labelStyle={{ fontSize: 17 }} icon={() => <Icon color='#609789' size={30} name='database' />} label='Listas Armazenadas' onPress={() => navigation.navigate('Listas Salvas')} />
            </View>
        </View>
    )
}

export default function index() {
    return (
        <NavigationContainer>
            <Drawer.Navigator drawerContent={CustomDrawer} initialRouteName='Início'>
                <Drawer.Screen name='Início' component={OpenScreen} />
                <Drawer.Screen name='Listas Salvas' component={LoadSavedLists} />
                <Drawer.Screen name='CreateList' component={CreateList} />
                <Drawer.Screen name='LoadedPreList' component={LoadedPreList} />
                <Drawer.Screen name='SelectedList' component={LoadSelectedList} />
            </Drawer.Navigator>
        </NavigationContainer>
    )
}
