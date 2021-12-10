import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {Picker} from '@react-native-picker/picker';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import * as Animatable from 'react-native-animatable';
import {APITKVTT} from '../api/API';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ListMaterialUser({navigation, route}) {
  const [daily, setDaiLy] = useState();
  const [kho, setKho] = useState();
  const [materialstatistic, setMaterialStatistic] = useState([]);
  const [inforuser, setInforUser] = useState('');
  const [search, setSearch] = useState('');
  const [textInputFocussed, setTeInputFocussed] = useState(false);

  useEffect(async () => {
    AsyncStorage.getItem('inforuser').then(async dataUser => {
      setInforUser(JSON.parse(dataUser));

      const res = await axios.post(`${APITKVTT}`, {
        madailyfilter: JSON.parse(dataUser).madaily._id,
        makhofilter: 'allwarehouses',
      });

      setMaterialStatistic(res.data);
    });
  }, []);

  const Format = number => {
    if (number >= 0) {
      return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.') + ' VND';
    } else
      return (
        '-' +
        String(number)
          .replace(/(.)(?=(\d{3})+$)/g, '$1.')
          .slice(2) +
        ' VND'
      );
  };

  return (
    <View style={{flex: 1}}>
      <Header title="Trở về" type="arrow-left" navigation={navigation} />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={styles.title}>Danh Sách Vật Tư</Text>
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
            {materialstatistic
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
                      borderColor: '#999',
                      borderRadius: 5,
                      marginBottom: 20,
                    }}>
                    <View
                      style={{display: 'flex', flex: 1, flexDirection: 'row'}}>
                      <Image
                        style={styles.image}
                        source={{uri: item.images.url}}
                      />
                    </View>
                    <View style={styles.thongTinSP}>
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
                    <View style={styles.thongTinSP}>
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
                      <View>
                        <Text
                          style={{
                            color: '#000',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                          }}>
                          SL Tồn: {item.soluong} {item.donvi}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.thongTinSP}>
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
                    <View style={styles.thongTinSP}>
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
  title: {
    fontSize: 30,
    fontWeight: '400',
    paddingTop: 10,
    paddingBottom: 10,
  },
  rowInput: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    width: 70,
  },
  textInput: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#999',
    borderRadius: 8,
    width: 270,
    height: 40,
  },
  buttonAction: {
    width: 120,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#1b94ff',
  },
  pickerDropdown: {
    width: 230,
    height: 50,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 8,
    borderColor: '#000',
    backgroundColor: '#dbdbdb',
    color: '#000',
  },
  listPrice: {
    width: SCREEN_WIDTH,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  itemfield: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    borderTopWidth: 1,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    borderStyle: 'solid',
    borderColor: '#e5e5e5',
    height: 25,
    color: '#fff',
  },
  label: {
    width: 85,
    //   backgroundColor:"#999",
    paddingLeft: 7,
    color: '#fff',
  },
  content: {
    color: '#fff',
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
  thongTinSP: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
});
