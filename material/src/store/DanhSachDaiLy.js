import axios from 'axios';
import React, {useContext, useState, useEffect} from 'react';

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
// import BangGia from './BangGia';
import {GlobalState} from '../GlobalState';
import {Button} from 'react-native-elements';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APIDaiLy} from '../api/API';
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
const SCREEN_WIDTH = Dimensions.get('window').width;

const initialStore = {
  tendl: '',
  diachi: '',
  sodienthoai: 0,
};

export default function DanhSachDaiLy({navigation, route}) {
  const state = useContext(GlobalState);
  const [stores] = state.storeAPI.stores;
  const [search, setSearch] = useState('');
  const [textInputFocussed, setTextInputFocussed] = useState(false);

  useEffect(async () => {}, [stores]);

  return (
    <View style={{flex: 1}}>
      <Header title="Trở về" type="arrow-left" navigation={navigation} />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={styles.title}>Danh Sách Đại Lý</Text>
        <View style={styles.TextInput2}>
          <TextInput
            style={{width: '80%'}}
            placeholder="Nhập từ khóa tìm kiếm"
            onChangeText={text => setSearch(text)}
            onFocus={() => {
              setTextInputFocussed(false);
            }}
            onBlur={() => {
              setTextInputFocussed(true);
            }}
          />

          <Animatable.View
            animation={textInputFocussed ? '' : 'fadeInLeft'}
            duration={400}>
            <Icon
              name="search"
              iconStyle={{color: '#86939e'}}
              type="fontisto"
              style={{marginRight: 100}}
              onPress={() => console.log('hello')}
            />
          </Animatable.View>
        </View>
        <ScrollView>
          <View style={styles.listPrice}>
            {stores
              ?.filter(item => {
                if (search == '') {
                  return item;
                } else if (
                  item._id.toLowerCase().includes(search.toLowerCase()) ||
                  item.tendl.toLowerCase().includes(search.toLowerCase()) ||
                  item.diachi.toLowerCase().includes(search.toLowerCase()) ||
                  item.sodienthoai.toLowerCase().includes(search.toLowerCase())
                ) {
                  return item;
                }
              })
              ?.map((item, stt) => (
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
                      <View style={styles.thongDaiLy}>
                        <Image
                          style={styles.image}
                          source={{uri: item.images.url}}
                        />

                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginTop: 14,
                            marginBottom: 14,
                          }}>
                          <Button
                            title="Chọn"
                            buttonStyle={styles.buttonOption}
                            onPress={() => {
                              AsyncStorage.setItem('kt', '1');
                              if (route.params.page == 'AddKho') {
                                navigation.navigate('AddKho', {daily: item});
                              } else if (route.params.page == 'EditKho') {
                                navigation.navigate('EditKho', {daily: item});
                              } else if (route.params.page == 'AddEmployee') {
                                navigation.navigate('AddEmployee', {
                                  daily: item,
                                });
                              } else if (route.params.page == 'EditEmployee') {
                                navigation.navigate('EditEmployee', {
                                  daily: item,
                                });
                              } else if (
                                route.params.page == 'ThongKeVatTuTon'
                              ) {
                                console.log('đại lý nè : ', item);
                                navigation.navigate('ThongKeVatTuTon', {
                                  daily: item,
                                  type: 'chondaily',
                                });
                              } else if (
                                route.params.page == 'ThongKeTheoNamTungDaiLy'
                              ) {
                                navigation.navigate('ThongKeTheoNamTungDaiLy', {
                                  daily: item,
                                });
                              } else if (
                                route.params.page ==
                                'ThongKeDoanhThuMocThoiGian'
                              ) {
                                navigation.navigate(
                                  'ThongKeDoanhThuMocThoiGian',
                                  {
                                    daily: item,
                                  },
                                );
                              } else if (
                                route.params.page ==
                                'ThongKeTheoGiaiDoanTungDaiLy'
                              ) {
                                navigation.navigate(
                                  'ThongKeTheoGiaiDoanTungDaiLy',
                                  {daily: item},
                                );
                              }
                            }}
                          />
                        </View>
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
                        <Text>Tên ĐL: {item.tendl}</Text>
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
                        <Text>SĐT: {item.sodienthoai}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
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
  thongDaiLy: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 2,
    paddingRight: 2,
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
    width: 120,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#1b94ff',
    marginRight: 5,
    marginLeft: 5,
  },
  listPrice: {
    // flex: 1,
    width: SCREEN_WIDTH,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  image: {
    height: 150,
    width: 260,
    borderRadius: 5,
    marginRight: 5,
  },
  thonTinSP: {
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginBottom: 10,
  },
  giaSP: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    textAlign: 'center',
    alignItems: 'center',
    color: 'red',
  },
  buttonOption: {
    width: 100,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#1b94ff',
    marginRight: 5,
    marginLeft: 5,
  },
});
