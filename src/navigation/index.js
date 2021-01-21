import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import OpenScreen from '../component/OpenScreen'
import CreateList from '../../App'
import LoadSavedLists from '../component/LoadSavedLists'
import LoadSelectedList from '../component/LoadSelectedList'
import PreList from '../component/PreList'
import LoadedPreList from '../component/LoadedPreList'

const Stack = createStackNavigator()

export default function index() {
    return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Home'
                    screenOptions={{
                        headerShown: false
                    }}>
                    <Stack.Screen name='Home' component={OpenScreen} />
                    <Stack.Screen name='CreateList' component={CreateList} />
                    <Stack.Screen name='SavedLists' component={LoadSavedLists} />
                    <Stack.Screen name='SelectedList' component={LoadSelectedList} />
                    <Stack.Screen name='PreList' component={PreList} />
                    <Stack.Screen name='LoadedPreList' component={LoadedPreList} />
                </Stack.Navigator>
            </NavigationContainer>
    )
}
