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
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import {APIKho} from '../api/API';
import {GlobalState} from '../GlobalState';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DanhSachKho({navigation, route}) {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [warehouses] = state.warehouseAPI.warehouses;
  // const [inforuser] = state.userAPI.inforuser;

  const [indexCheck, setIndexCheck] = useState('0');
  var [dskho, setDSKho] = useState([]);
  const [loading, setLoading] = useState();
  const [search, setSearch] = useState('');
  const [textInputFocussed, setTeInputFocussed] = useState(false);

  let newwarehouses = '';

  if (
    route.params.page == 'LapPhieuNhap' ||
    route.params.page == 'LapPhieuXuat'
  ) {
    newwarehouses = warehouses.filter((warehouse, index) =>
      route.params.madl === warehouse.madaily._id ? warehouse : undefined,
    );
  } else if (route.params.page == 'ThongKeVatTuTon') {
    newwarehouses = warehouses.filter((warehouse, index) =>
      route.params.madaily === warehouse.madaily._id ? warehouse : undefined,
    );
  }

  return (
    <View style={{flex: 1}}>
      <Header title="Trở về" type="arrow-left" navigation={navigation} />
      <Text style={styles.title}>Danh Sách Kho</Text>
      <View style={styles.TextInput2}>
        <TextInput
          style={{width: '80%'}}
          placeholder="Nhập tên kho"
          onChangeText={text => setSearch(text)}
          onFocus={() => {
            setTeInputFocussed(false);
          }}
          onBlur={() => {
            setTeInputFocussed(true);
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
          {newwarehouses
            ?.filter(item => {
              if (search == '') {
                return item;
              } else if (
                item.tenkho.toLowerCase().includes(search.toLowerCase())
              ) {
                return item;
              }
            })
            ?.map(item => (
              <View key={item._id}>
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
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}>
                      <Button
                        title="Chọn"
                        buttonStyle={styles.buttonOption}
                        onPress={() => {
                          AsyncStorage.setItem('kt', '1');
                          if (route.params.page == 'LapPhieuNhap') {
                            AsyncStorage.setItem('kt', 'chonkho');
                            AsyncStorage.setItem('cart', ''); //Chọn lại kho -> Tiến hành xóa danh sách vật tư trong phiếu

                            navigation.navigate('LapPhieuNhap', {kho: item});
                          } else if (route.params.page == 'LapPhieuXuat') {
                            AsyncStorage.setItem('kt', 'chonkho');
                            AsyncStorage.setItem('cart', ''); //Chọn lại kho -> Tiến hành xóa danh sách vật tư trong phiếu

                            navigation.navigate('LapPhieuXuat', {kho: item});
                          } else if (route.params.page == 'ThongKeVatTuTon') {
                            // console.log('đại lý nè : ', item);
                            navigation.navigate('ThongKeVatTuTon', {
                              kho: item,
                              type: 'chonkho',
                            });
                          }
                        }}
                      />
                    </View>
                  </View>
                  <View style={styles.thonTinSP}>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                      <Text
                        style={{
                          color: '#000',
                          marginLeft: 'auto',
                          marginRight: 'auto',
                        }}>
                        Kho : {item.tenkho}
                      </Text>
                      <Text
                        style={{
                          color: '#000',
                          marginLeft: 'auto',
                          marginRight: 'auto',
                        }}>
                        Đại lý :{item.madaily.tendl}
                      </Text>
                    </View>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                      <Text
                        style={{
                          color: '#000',
                          marginLeft: 'auto',
                          marginRight: 'auto',
                        }}>
                        <Text>Địa chỉ : {item.diachi}</Text>
                      </Text>
                      <Text
                        style={{
                          color: '#000',
                          marginLeft: 'auto',
                          marginRight: 'auto',
                        }}>
                        <Text>SĐT: {item.sodienthoai}</Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
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
    marginLeft: 'auto',
    marginRight: 'auto',
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
    flexDirection: 'column',
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
