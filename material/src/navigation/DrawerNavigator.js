import {createDrawerNavigator} from '@react-navigation/drawer';
import * as React from 'react';
import HomeScreen from '../screens/HomeScreen';
import UserHomeScreen from '../User/UserHomeScreen';
import {DrawerContent} from './DrawerContent';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator({navigation, route}) {
  if (route.params.role == 'admin') {
    return (
      <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
        <Drawer.Screen name="HomeScreen" component={HomeScreen} />
      </Drawer.Navigator>
    );
  } else if (route.params.role == 'user') {
    return (
      <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
        <Drawer.Screen name="UserHomeScreen" component={UserHomeScreen} />
      </Drawer.Navigator>
    );
  }
}
