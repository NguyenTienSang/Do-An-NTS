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
// import BangGia from './BangGia';
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import {APIKho, APIDestroy} from '../api/API';
import {GlobalState} from '../GlobalState';
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Kho({navigation}) {
  const state = useContext(GlobalState);
  const [loading, setLoading] = useState();
  const [search, setSearch] = useState('');
  const [textInputFocussed, setTeInputFocussed] = useState(false);
  const [token] = state.token;

  const [warehouse] = state.warehouseAPI.warehouses;

console.log('warehouse : ',warehouse)

  const [callback, setCallback] = state.warehouseAPI.callback;

  const DeleteWareHouse = async (id, public_id) => {
    console.log('id : ', id);
    console.log('token : ', token);
    axios
      .post(
        `${APIDestroy}`,
        {
          public_id,
        },
        {headers: {Authorization: token}},
      )
      .then(() => {
        axios
          .delete(`${APIKho}/${id}`, {
            headers: {Authorization: token},
          })
          .then(res => {
            Alert.alert('Thông báo', res.data.message, [
              {
                text: 'OK',
                onPress: () => {
                  setCallback(!callback);
                  // navigation.replace("NhanVien");
                },
              },
            ]);
          })
          .catch(error => {
            Alert.alert('Thông báo', error.response.data.message);
          });
      })
      .catch(error => {
        Alert.alert('Thông báo', error.response.data.message);
      });
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <View style={styles.header}>
        <View style={{marginLeft: 20}}>
          <Icon
            type="material-community"
            name="arrow-left"
            color="white"
            size={28}
            onPress={() => {
              navigation.navigate('HomeScreen');
            }}
          />
        </View>
        <View>
          <Text style={styles.headerText}>Trở về</Text>
        </View>
      </View>

      <Text style={styles.title}>Danh Sách Kho</Text>

      <View style={styles.optionsSelect}>
        <Button
          title="Thêm"
          buttonStyle={styles.buttonOption}
          onPress={() => {
            navigation.navigate('AddKho');
          }}
        />
      </View>

      <View style={styles.TextInput2}>
        <TextInput
          style={{width: '80%'}}
          placeholder="Nhập từ khóa tìm kiếm"
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
          {warehouse ? (
            warehouse
              .filter(item => {
                if (search == '') {
                  return item;
                } else if (
                  item._id.toLowerCase().includes(search.toLowerCase()) ||
                  item.tenkho.toLowerCase().includes(search.toLowerCase()) ||
                  item.madaily.tendl
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  item.diachi.toLowerCase().includes(search.toLowerCase()) ||
                  item.sodienthoai
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  item.trangthai.toLowerCase().includes(search.toLowerCase())
                ) {
                  return item;
                }
              })
              .map(item => (
                <View key={item._id}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderWidth: 1,
                      borderColor: '#1b94ff',
                      borderRadius: 5,
                      marginLeft: 3,
                      marginBottom: 20,
                      paddingTop: 7,
                      paddingBottom: 7,
                    }}>
                    <View
                      style={{display: 'flex', flex: 1, flexDirection: 'row'}}>
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
                          title="Cập nhật"
                          buttonStyle={[
                            styles.buttonOption,
                            {marginBottom: 40},
                          ]}
                          onPress={() => {
                            navigation.navigate('EditKho', {kho: item});
                          }}
                        />
                        <Button
                          title="Xóa"
                          buttonStyle={styles.buttonOption}
                          onPress={() => {
                            DeleteWareHouse(item._id, item.images.public_id);
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.thontinkho}>
                      <View>
                        <Text
                          style={{
                            color: '#000',
                          }}>
                          ID : {item._id}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.thontinkho}>
                      <View>
                        <Text
                          style={{
                            color: '#000',
                          }}>
                          <Text>Tên : {item.tenkho}</Text>
                        </Text>
                      </View>
                    </View>

                    <View style={styles.thontinkho}>
                      <View>
                        <Text
                          style={{
                            color: '#000',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                          }}>
                          Đại lý: {item.madaily.tendl}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.thontinkho}>
                      <View>
                        <Text
                          style={{
                            color: '#000',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                          }}>
                          Địa chỉ: {item.diachi}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.thontinkho}>
                      <View>
                        <Text
                          style={{
                            color: '#000',
                          }}>
                          <Text>SĐT : {item.sodienthoai}</Text>
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{
                            color: '#000',
                            marginLeft: 15,
                          }}>
                          <Text>Trạng thái : {item.trangthai}</Text>
                        </Text>
                      </View>
                    </View>

                    <View
                      style={[styles.thontinkho, {justifyContent: 'center'}]}>
                      <Button
                        title="Số lượng tồn"
                        buttonStyle={{
                          width: 150,
                          height: 40,
                          borderRadius: 5,
                          backgroundColor: '#1b94ff',
                          marginRight: 5,
                          marginLeft: 5,
                        }}
                        onPress={() => {
                          navigation.navigate('SoLuongTonKho', {
                            madaily: item.madaily._id,
                            makho: item._id,
                          });
                        }}
                      />
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
                Danh sách kho trống
              </Text>
            </View>
          )}
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
    display: 'flex',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 30,
    fontWeight: '400',
    paddingTop: 10,
    paddingBottom: 10,
  },
  optionsSelect: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginTop: 15,
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
  },
  image: {
    height: 150,
    width: 260,
    borderRadius: 5,
    marginRight: 5,
  },
  thontinkho: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
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
