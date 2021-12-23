import React, {useState, useEffect} from 'react';
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
import Header from '../components/Header';
import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
const SCREEN_WIDTH = Dimensions.get('window').width;
import {APIDaiLy, APIDestroy} from '../api/API';

export default function DaiLy({navigation}) {
  const [indexCheck, setIndexCheck] = useState('0');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();
  const [search, setSearch] = useState('');
  const [textInputFocussed, setTeInputFocussed] = useState(false);

  const DeleteStore = async (id, public_id) => {
    const token = await AsyncStorage.getItem('token');
    // console.log('token : ', token);
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
          .delete(`${APIDaiLy}/${id}`, {
            headers: {Authorization: token},
          })
          .then(res => {
            Alert.alert('Thông báo', res.data.message, [
              {
                text: 'OK',
                onPress: () => {
                  navigation.replace('DaiLy');
                },
              },
            ]);
          })
          .catch(error => {
            Alert.alert('Lỗi', error.response.data.message);
          });
      })
      .catch(error => {
        Alert.alert('Lỗi', error.response.data.message);
      });
  };

  const Infor = async () => {
    const token = await AsyncStorage.getItem('token');
    const Username = await AsyncStorage.getItem('username');
    const res = await axios.get(`${APIDaiLy}`);
    console.log('res.data : ', res.data);
    setData(res.data);
  };

  useEffect(async () => {
    if (data.length == 0) {
      await Infor();
      setLoading('');
    }
  }, [loading]);

  if (data.length > 0) {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <Header title="Trở về" type="arrow-left" navigation={navigation} />
        <Text style={styles.title}>Danh Sách Đại Lý</Text>

        <View style={styles.optionsSelect}>
          <Button
            title="Thêm"
            buttonStyle={styles.buttonOption}
            onPress={() => {
              navigation.navigate('AddStore');
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
            {data
              .filter(item => {
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
                            title="Cập nhật"
                            buttonStyle={[
                              styles.buttonOption,
                              {marginBottom: 40},
                            ]}
                            onPress={() => {
                              navigation.navigate('EditStore', {item: item});
                            }}
                          />
                          <Button
                            title="Xóa"
                            buttonStyle={styles.buttonOption}
                            onPress={() => {
                              Alert.alert(
                                //title
                                'Thông báo',
                                //body
                                `Bạn có chắc xóa đại lý ${item.tendl}`,
                                [
                                  {
                                    text: 'Xóa',
                                    onPress: () =>
                                      DeleteStore(
                                        item._id,
                                        item.images.public_id,
                                      ),
                                  },
                                  {
                                    text: 'Hủy',
                                    onPress: () => console.log('No Delete'),
                                  },
                                ],
                                // { cancelable: false }
                              );
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
                        <Text>Tên ĐL:{item.tendl}</Text>
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
                          Địa chỉ:{item.diachi}
                        </Text>
                        <Text>SĐT: {item.sodienthoai}</Text>
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
                    </View>
                  </View>
                </View>
              ))}
          </View>
        </ScrollView>
      </View>
    );
  }
  if (loading == '') {
    if (data.length == 0) {
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
          <View style={styles.optionsSelect}>
            <Button
              title="Thêm"
              buttonStyle={styles.buttonOption}
              onPress={() => {
                navigation.navigate('AddStore');
              }}
            />
          </View>
          <Text
            style={{marginTop: 250, marginLeft: 'auto', marginRight: 'auto'}}>
            Danh sách đại lý trống
          </Text>
        </View>
      );
    }
  }
  if (loading === undefined) {
    if (data.length == 0) {
      return (
        <View>
          <Text
            style={{marginTop: 350, marginLeft: 'auto', marginRight: 'auto'}}>
            Đang load dữ liệu
          </Text>
        </View>
      );
    }
  }
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
    flex: 1,
    width: SCREEN_WIDTH,
    justifyContent: 'space-between',
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
