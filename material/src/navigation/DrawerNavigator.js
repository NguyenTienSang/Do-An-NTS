import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
// import RootClientTabs from './ClientTabs';
import HomeScreen from '../screens/HomeScreen';
import UserHomeScreen from '../User/UserHomeScreen';

import {Icon} from 'react-native-elements';

import {colors} from "../global/styles"
import { View, Text, Image, StyleSheet} from 'react-native';
import { DrawerContent } from './DrawerContent';

const Drawer = createDrawerNavigator(); 

export default function DrawerNavigator({navigation,route}){
    if(route.params.role == 'admin')
    {
        return(
            <Drawer.Navigator drawerContent={props => <DrawerContent {...props}/>}>
                        <Drawer.Screen
                        name="HomeScreen"
                        component={HomeScreen}
                    />
            </Drawer.Navigator>
        ) 
    }
    else if(route.params.role == 'user')
    {
        return(
            <Drawer.Navigator drawerContent={props => <DrawerContent {...props}/>}>
                        <Drawer.Screen
                        name="UserHomeScreen"
                        component={UserHomeScreen}
                    />
            </Drawer.Navigator>
        )
    }
   
}
