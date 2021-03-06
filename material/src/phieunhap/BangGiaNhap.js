import axios from 'axios';
import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
} from 'react-native';
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APIVattu, TimVatTuPN} from './../api/API';
import Header from './../components/Header';
import {GlobalState} from '../GlobalState';
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function BangGiaNhap({navigation, route}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();
  const state = useContext(GlobalState);
  const [search, setSearch] = useState('');
  const [textInputFocussed, setTeInputFocussed] = useState(false);
  const [token] = state.token;
  const [materialsfilter, setMaterialsFilter] = useState(null);

  const Format = number => {
    if (number >= 0) {
      return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.') + ' VND';
    } else
      return (
        '-' + String(number * -1).replace(/(.)(?=(\d{3})+$)/g, '$1.') + ' VND'
      );
  };

  function onClickAddCart(data) {
    AsyncStorage.setItem('kt', 'themvt');
    const itemcart = {
      material: data,
      quantity: 1,
    };
    // SetGiaTri();
    AsyncStorage.getItem('cart')
      .then(datacart => {
        if (datacart !== null) {
          let check = 0;
          const cart = JSON.parse(datacart);
          cart.map(item => {
            if (item.material._id == itemcart.material._id) {
              item.quantity++;
              check = 1;
            }
          });
          if (check == 0) {
            cart.push(itemcart);
          }
          AsyncStorage.setItem('cart', JSON.stringify(cart));
        } else {
          const cart = [];
          cart.push(itemcart);
          AsyncStorage.setItem('cart', JSON.stringify(cart));
        }
        // alert("Add Cart")
      })
      .catch(err => {
        alert(err);
      });
  }

  useEffect(async () => {
    console.log('load l???i d??? li???u materialsfilter');
    const res = await axios.post(
      `${TimVatTuPN}`,
      //  [JSON.parse(localStorage.getItem('inforuser')).madaily._id,exportbill.makho]
      {makhofilter: route.params.makho},
    );

    setMaterialsFilter(res.data);
  }, []);

  return (
    <View style={{flex: 1}}>
      <Header title="Tr??? v???" type="arrow-left" navigation={navigation} />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={styles.title}>B???ng Gi?? Nh???p</Text>

        <View style={styles.TextInput2}>
          <TextInput
            style={{width: '80%'}}
            placeholder="Nh???p t??? kh??a t??m ki???m"
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
            {materialsfilter ? (
              materialsfilter
                ?.filter(item => {
                  if (search == '' && item.trangthai === '??ang kinh doanh') {
                    return item;
                  } else if (
                    (item._id.toLowerCase().includes(search.toLowerCase()) ||
                      item.tenvt.toLowerCase().includes(search.toLowerCase()) ||
                      item.soluong
                        .toString()
                        .toLowerCase()
                        .includes(search.toLowerCase())) &&
                    item.trangthai === '??ang kinh doanh'
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
                        style={{
                          display: 'flex',
                          flex: 1,
                          flexDirection: 'row',
                        }}>
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
                            title="Th??m V??o Phi???u"
                            buttonStyle={styles.buttonOption}
                            // disabled={item.soluong === 0 ? true : false}
                            onPress={() => {
                              onClickAddCart(item);
                              navigation.navigate('LapPhieuNhap', {
                                id: item._id,
                              });
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
                            T??n: {item.tenvt}
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
                            SL T???n: {item.soluong} {item.donvi}
                          </Text>
                        </View>
                        <View>
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              color: '#000',
                              marginLeft: 'auto',
                              marginRight: 'auto',
                            }}>
                            <Text>Gi?? Nh???p : {Format(item.gianhap)}</Text>
                            <Text>/{item.donvi}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                ))
            ) : (
              <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
                <Text style={{fontSize: 20}}>Kho ch??a c?? v???t t??</Text>
              </View>
            )}
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
    justifyContent: 'space-around',
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
    height: 60,
    borderRadius: 5,
    backgroundColor: '#1b94ff',
    marginRight: 5,
    marginLeft: 5,
  },
});
