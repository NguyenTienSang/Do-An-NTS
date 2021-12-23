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
import {APIKho, APIDestroy, APITKVTTDL} from '../api/API';
import {GlobalState} from '../GlobalState';
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ThongKeVatTuTrongCacKho({navigation, route}) {
  const state = useContext(GlobalState);
  const [loading, setLoading] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [textInputFocussed, setTeInputFocussed] = useState(false);
  const [token] = state.token;
  const [inforuser, setInforUser] = useState('');
  const [listWareHouseMaterial, setListWareHouseMaterial] = useState([]);
  const [listWareHouseSearch, setListWareHouseSearch] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('inforuser').then(async dataUser => {
      setInforUser(JSON.parse(dataUser));
    });
  }, []);

  useEffect(async () => {
    try {
      const res = await axios.post(
        `${APITKVTTDL}`,
        {mavattu: route.params.vattu._id},
        {
          headers: {Authorization: token},
        },
      );
      console.log('res.data : ', res.data);
      setListWareHouseMaterial(res.data);
    } catch (err) {
      Alert.alert('Lỗi', error.response.data.message);
    }
  }, [route.params._id]);

  // Lấy ra danh sách kho có trong từ khóa search
  useEffect(() => {
    console.log('listWareHouseMaterial : ', listWareHouseMaterial);
    if (inforuser?.role === 'user') {
      console.log('user : ');
      setListWareHouseSearch(
        listWareHouseMaterial?.filter(warehouse => {
          if (
            searchTerm === '' &&
            warehouse.tendl === inforuser.madaily.tendl
          ) {
            return warehouse;
          } else if (
            (warehouse._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
              warehouse.tenkho
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              warehouse.tendl
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              warehouse.diachi
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              warehouse.sodienthoai
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) &&
            warehouse.tendl === inforuser.madaily.tendl
          ) {
            return warehouse;
          }
        }),
      );
    } else {
      setListWareHouseSearch(
        listWareHouseMaterial?.filter(warehouse => {
          if (searchTerm === '') {
            return warehouse;
          } else if (
            warehouse._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            warehouse.tenkho.toLowerCase().includes(searchTerm.toLowerCase()) ||
            warehouse.tendl.toLowerCase().includes(searchTerm.toLowerCase()) ||
            warehouse.diachi.toLowerCase().includes(searchTerm.toLowerCase()) ||
            warehouse.sodienthoai
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          ) {
            return warehouse;
          }
        }),
      );
    }
  }, [searchTerm, listWareHouseMaterial, inforuser]);

  return (
    <View
      style={{
        flex: 1,
      }}>
      <Header title="Trở về" type="arrow-left" navigation={navigation} />

      <Text style={styles.title}>Danh Sách Kho Đang Tồn</Text>
      <Text style={styles.title}>{route.params.vattu.tenvt}</Text>
      <View style={styles.TextInput2}>
        <TextInput
          style={{width: '80%'}}
          placeholder="Nhập từ khóa tìm kiếm"
          onChangeText={text => setSearchTerm(text)}
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
          {listWareHouseSearch?.length ? (
            listWareHouseSearch.map(item => (
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
                      source={{uri: item?.images.url}}
                    />
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
                        Đại lý: {item.tendl}
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
                        <Text>
                          Số lượng : {item.soluong} /{route.params.vattu.donvi}
                        </Text>
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
                  marginTop: 200,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}>
                Vật tư này chưa có trong kho
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
    fontSize: 20,
    fontWeight: '400',
    paddingTop: 5,
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
    height: 170,
    width: 340,
    borderRadius: 5,
    marginLeft: 20,
    marginRight: 22,
    marginTop: 10,
    marginBottom: 5,
  },
  thontinkho: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 3,
    marginBottom: 3,
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
