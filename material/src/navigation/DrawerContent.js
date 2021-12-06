import axios from 'axios';
import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from './../global/styles';
// import { APIGetUser } from '../api/API';

import {GlobalState} from '../GlobalState';

export function DrawerContent({navigation, props}) {
  const state = useContext(GlobalState);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();
  // const [manv,setMaNV] = useState('');
  //   var inforuser = '';
  const [inforuser, setInforUser] = useState('');
  //   const inforuser = '';

  AsyncStorage.getItem('inforuser').then(async dataUser => {
    // inforuser = await JSON.parse(dataUser);
    // console.log('test : ', JSON.parse(dataUser));
    setInforUser(JSON.parse(dataUser));
  });

  //   AsyncStorage.getItem('inforuser').then(async dataUser => {
  //     console.log('test111111111');
  //     inforuser = await JSON.parse(dataUser);
  //   console.log('inforuser : ', inforuser);
  //   });

  //   useEffect(async () => {}, [inforuser]);

  const logout = () => {
    // AsyncStorage.removeItem('firstLogin');
    AsyncStorage.clear();
    navigation.replace('SignInScreen');
    // AsyncStorage.removeItem('token').then(() => {

    // });
  };

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{flexDirection: 'column', marginTop: 15}}>
              <View style={{marginLeft: 50}}>
                <Avatar.Image
                  source={{
                    uri: inforuser?.images?.url,
                  }}
                  size={90}
                />
              </View>
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 25,
                }}>
                <Icon
                  name="user-circle"
                  iconStyle={{color: 'black', marginRight: 10}}
                  type="font-awesome"
                />
                <Text style={{fontSize: 18}}>{inforuser.username}</Text>
              </View>

              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 20,
                }}>
                <Icon
                  name="v-card"
                  iconStyle={{color: 'black', marginRight: 10}}
                  type="entypo"
                />
                <Text style={{fontSize: 18}}>{inforuser?.hoten}</Text>
              </View>

              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 20,
                }}>
                <Icon
                  name="store"
                  iconStyle={{color: 'black', marginRight: 10}}
                  type="material"
                />
                <Text style={{fontSize: 18}}>{inforuser?.madaily?.tendl}</Text>
              </View>

              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 25,
                }}>
                <Icon
                  name="home"
                  iconStyle={{color: 'black', marginRight: 10}}
                  type="entypo"
                />
                <Text style={{fontSize: 18}}>{inforuser?.diachi}</Text>
              </View>

              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 25,
                }}>
                <Icon
                  name="table-account"
                  iconStyle={{color: 'black', marginRight: 10}}
                  type="material-community"
                />
                <Text style={{fontSize: 18}}>{inforuser?.role}</Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 25,
                }}>
                <Icon
                  name="account-key-outline"
                  iconStyle={{color: 'black', marginRight: 10}}
                  type="material-community"
                />

                <Text
                  style={{fontSize: 18}}
                  onPress={() => {
                    navigation.navigate('DoiMatKhau', {nhanvien: inforuser});
                  }}>
                  Đổi mật khẩu
                </Text>
                {/* <Button
                                                title="Đổi mật khẩu"
                                                // buttonStyle={styles.taskButton}
                                                // titleStyle={parameters.buttonTitle}
                                                onPress={()=>{
                                                    navigation.navigate("DSNhanVienUser")
                                                }}
                                            >
                                            </Button> */}
              </View>
            </View>
          </View>

          {/* <Drawer.Section title="Preferences"> */}
          {/* <DrawerItem
                                        icon={({color,size}) => (
                                            <Icon
                                            name="table-account"
                                            iconStyle={{color: 'black',marginRight:10}}
                                            type="material-community"
                                            />
                                        )}
                                        label="Đổi mật khẩu"
                                        onPress={() => {}}
                                    /> */}
          {/* </Drawer.Section>   */}
        </View>
      </DrawerContentScrollView>

      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({color, size}) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Đăng xuất"
          onPress={() => {
            // props.navigation.navigate('SignInScreen')
            logout();
          }}
        />
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
