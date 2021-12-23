import React, {useContext, useState, useEffect} from 'react';
import axios from 'axios';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  TextInput,
} from 'react-native';

import Header from '../components/Header';
import {Button} from 'react-native-elements';
import {GiaBan} from '../global/Data';
// import { DSNhapVien } from '../global/Data';
import EditEmployee from './../nhanvien/EditEmployee';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APINhanVien, APIDestroy} from '../api/API';
import {Icon} from 'react-native-elements';
import {GlobalState} from '../GlobalState';
import {colors, parameters} from '../global/styles';
import * as Animatable from 'react-native-animatable';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DSNhanVienUser({navigation}) {
  const state = useContext(GlobalState);
  const [inforuser, setInforUser] = useState('');

  const [textInput2Focussed, setTeInput2Focussed] = useState(false);
  const [employees] = state.employeeAPI.employees;

  const [search, setSearch] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('inforuser').then(async dataUser => {
      console.log('JSON.parse(dataUser) : ', JSON.parse(dataUser));
      setInforUser(JSON.parse(dataUser));
    });
  }, []);

  return (
    <View style={{flex: 1}}>
      <Header title="Trở về" type="arrow-left" navigation={navigation} />
      {/* <View style={styles.header}>
        <View style={{marginLeft: 20}}>
          <Icon
            type="material-community"
            name="arrow-left"
            color="white"
            size={28}
            onPress={() => {
              navigation.navigate('UserHomeScreen');
            }}
          />
        </View>
        <View>
          <Text style={styles.headerText}>Trở về</Text>
        </View>
      </View> */}

      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.title}>Danh Sách Nhân Viên</Text>
        {/* <View style={styles.optionsSelect}>
          <Button
            title="Thêm"
            buttonStyle={styles.buttonOption}
            onPress={() => {
              navigation.navigate('AddEmployee');
            }}
          />
        </View> */}

        <View style={styles.TextInput2}>
          <TextInput
            style={{width: '80%'}}
            placeholder="Nhập từ khóa tìm kiếm"
            onChangeText={text => setSearch(text)}
            onFocus={() => {
              setTeInput2Focussed(false);
            }}
            onBlur={() => {
              setTeInput2Focussed(true);
            }}
          />

          <Animatable.View
            animation={textInput2Focussed ? '' : 'fadeInLeft'}
            duration={400}>
            <Icon
              name="search"
              iconStyle={{color: colors.grey3}}
              type="fontisto"
              style={{marginRight: 100}}
              onPress={() => console.log('hello')}
            />
          </Animatable.View>
        </View>

        <ScrollView>
          <View style={styles.listPrice}>
            {employees && inforuser ? (
              employees
                .filter(item => {
                  if (
                    search == '' &&
                    inforuser.madaily._id.toString() ===
                      item.madaily._id.toString()
                  ) {
                    return item;
                  } else if (
                    (item._id.toLowerCase().includes(search.toLowerCase()) ||
                      item.hoten.toLowerCase().includes(search.toLowerCase()) ||
                      item.madaily.tendl
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      item.role.toLowerCase().includes(search.toLowerCase()) ||
                      item.trangthai
                        .toLowerCase()
                        .includes(search.toLowerCase())) &&
                    inforuser.madaily._id.toString() ===
                      item.madaily._id.toString()
                  ) {
                    return item;
                  }
                })
                ?.map(item => (
                  <View key={item._id}>
                    <View>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          borderWidth: 1,
                          borderColor: '#1b94ff',
                          borderRadius: 5,
                          marginLeft: 3,
                          marginRight: 3,
                          marginBottom: 20,
                          paddingTop: 7,
                          paddingBottom: 7,
                        }}>
                        <View style={styles.thongTinNV}>
                          <Image
                            style={styles.image}
                            source={{uri: item.images.url}}
                          />
                        </View>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 10,
                            marginLeft: 15,
                            marginRight: 15,
                          }}>
                          <Text style={{marginLeft: 15}}>
                            Họ tên: {item.hoten}
                          </Text>
                          {/* <Text>Địa chỉ:{item.diachi}</Text> */}
                          <Text>Quyền: {item.role}</Text>
                        </View>

                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 10,
                            marginLeft: 15,
                            marginRight: 15,
                          }}>
                          <Text style={{marginLeft: 15}}>ID: {item._id}</Text>
                        </View>

                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 10,
                            marginLeft: 15,
                            marginRight: 15,
                          }}>
                          <Text style={{marginLeft: 15}}>
                            Trạng thái: {item.trangthai}
                          </Text>
                        </View>

                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 10,
                            marginLeft: 15,
                            marginRight: 15,
                          }}>
                          <Text style={{marginLeft: 15}}>
                            Đại lý: {item.madaily.tendl}
                          </Text>
                          <Text>SĐT:{item.sodienthoai}</Text>
                        </View>

                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 10,
                            marginLeft: 15,
                            marginRight: 15,
                          }}>
                          <Text style={{marginLeft: 15}}>
                            Địa chỉ: {item.diachi}
                          </Text>
                        </View>

                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 10,
                            marginLeft: 15,
                            marginRight: 15,
                          }}>
                          <Text style={{marginLeft: 15}}>
                            Email: {item.email}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))
            ) : (
              <View>
                <Text
                  style={{
                    marginTop: 350,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}>
                  Danh sách nhân viên trống
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  TextInput1: {
    borderWidth: 1,
    borderColor: '#86939e',
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    paddingLeft: 15,
  },
  TextInput2: {
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 20,
    borderColor: '#86939e',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 15,
  },
  textInput: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#333',
    width: 220,
    height: 40,
    borderRadius: 10,
  },
  thongTinNV: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 2,
    paddingRight: 2,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#1b94ff',
    height: 40,
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: '400',
    paddingTop: 10,
    paddingBottom: 10,
  },
  optionsSelect: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    paddingBottom: 15,
  },
  buttonOption: {
    width: 80,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#1b94ff',
    marginRight: 5,
    marginLeft: 5,
  },
  listPrice: {
    flex: 1,
    width: SCREEN_WIDTH,
    justifyContent: 'space-between',
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 100,
    marginRight: 5,
  },
  giaSP: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    textAlign: 'center',
    alignItems: 'center',
    color: 'red',
  },
});
