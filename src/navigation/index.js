import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import OpenScreen from '../component/OpenScreen'
import CreateList from '../../App'
import LoadSavedLists from '../component/LoadSavedLists'
import LoadSelectedList from '../component/LoadSelectedList'
import LoadedPreList from '../component/LoadedPreList'
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer'
import { StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'


const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

function Menu() {
    return (
        <Stack.Navigator
            initialRouteName='Início'
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name='CreateList' component={CreateList} />
            <Stack.Screen name='LoadedPreList' component={LoadedPreList} />
            <Stack.Screen name='SelectedList' component={LoadSelectedList} />
            <Stack.Screen name='Início' component={OpenScreen} />
        </Stack.Navigator>
    )
}

const CustomDrawer = ({ navigation }) => {
    return (
        <View>
            <View style={{
                height: 70,
                width: '100%',
                backgroundColor: 'lightblue',
                justifyContent: 'center'
            }}>
                <Text style={{ textAlign: 'center' }}>Bem Vindo</Text>
            </View>
            <View>
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
                <Drawer.Screen name='Menu' component={Menu} />
            </Drawer.Navigator>
        </NavigationContainer>
    )
}
