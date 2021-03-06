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
import {VatTu} from '../global/Data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import {GlobalState} from '../GlobalState';
import {APIVattu} from '../api/API';
import {APIDestroy} from '../api/API';
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ListMaterial({navigation}) {
  const state = useContext(GlobalState);
  // const [dsvttonkho, setDSVTTonKho] = useState([]);
  const [loading, setLoading] = useState();
  const [materials] = state.materialAPI.materials;
  const [token] = state.token;
  const [callback, setCallback] = state.materialAPI.callback;
  const [search, setSearch] = useState('');
  const [textInputFocussed, setTeInputFocussed] = useState(false);

  const Format = number => {
    if (number >= 0) {
      return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.') + ' VND';
    } else
      return (
        '-' + String(number * -1).replace(/(.)(?=(\d{3})+$)/g, '$1.') + ' VND'
      );
  };

  const DeleteMaterial = async (id, public_id) => {
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
          .delete(`${APIVattu}/${id}`, {
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
    <View style={{flex: 1}}>
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

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={styles.title}>Danh Sách Vật Tư</Text>

        <View style={styles.optionsSelect}>
          <Button
            title="Thêm"
            buttonStyle={styles.buttonOption}
            onPress={() => {
              navigation.navigate('AddPriceMaterial');
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

        <ScrollView style={{paddingLeft: 5, paddingRight: 5}}>
          <View style={styles.listPrice}>
            {materials
              ?.filter(item => {
                if (search == '') {
                  return item;
                } else if (
                  item._id.toLowerCase().includes(search.toLowerCase()) ||
                  item.tenvt.toLowerCase().includes(search.toLowerCase()) ||
                  item.soluong
                    .toString()
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
                      borderWidth: 1,
                      borderStyle: 'solid',
                      borderColor: '#1b94ff',
                      borderRadius: 5,
                      marginBottom: 20,
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
                            {marginBottom: 10},
                          ]}
                          onPress={() => {
                            console.log('thông tin data : ', item);
                            navigation.navigate('EditMaterial', {vattu: item});
                          }}
                        />

                        <Button
                          title="Xóa"
                          buttonStyle={[
                            styles.buttonOption,
                            {marginBottom: 10},
                          ]}
                          onPress={() => {
                            // Delete(item._id);
                            DeleteMaterial(item._id, item.images.public_id);
                          }}
                        />

                        <Button
                          title="Xem"
                          buttonStyle={styles.buttonOption}
                          onPress={() => {
                            navigation.navigate('ThongKeVatTuTrongCacKho', {
                              vattu: item,
                            });
                            // Delete(item._id);
                            // DeleteMaterial(item._id, item.images.public_id);
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.thonTinSP}>
                      <View>
                        <Text
                          style={{
                            color: '#000',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                          }}>
                          ID: {item._id}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.thonTinSP}>
                      <View>
                        <Text
                          style={{
                            color: '#000',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                          }}>
                          Tên: {item.tenvt}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.thonTinSP}>
                      <View>
                        <Text
                          style={{
                            color: '#000',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                          }}>
                          SL Tồn: {item.soluong}/{item.donvi}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{
                            color: '#000',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                          }}>
                          Trạng thái: {item.trangthai}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.thonTinSP}>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          marginRight: 20,
                        }}>
                        <Text>Giá Nhập : {Format(item.gianhap)}</Text>
                        <Text>/</Text>
                        <Text>{item.donvi}</Text>
                      </View>
                    </View>

                    <View style={styles.thonTinSP}>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          marginRight: 20,
                        }}>
                        <Text>Giá Xuất : {Format(item.giaxuat)}</Text>
                        <Text>/</Text>
                        <Text>{item.donvi}</Text>
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
  listPrice: {
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
    marginLeft: 5,
    marginRight: 3,
    marginTop: 5,
    marginBottom: 5,
  },
  thonTinSP: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 10,
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
