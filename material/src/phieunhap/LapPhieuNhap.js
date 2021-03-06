import axios from 'axios';
import React, {useContext, useState, useEffect} from 'react';
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
  Alert,
  TouchableOpacity,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import DatePicker from 'react-native-datepicker'
import {Icon, Button} from 'react-native-elements';
import NumericInput from 'react-native-numeric-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import {APIPN, APIInforUser} from '../api/API';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {GlobalState} from '../GlobalState';

export default function LapPhieuNhap({navigation, route}) {
  const state = useContext(GlobalState);
  const [inforuser, setInforUser] = useState('');
  const [token] = state.token;
  const [importbills] = state.importbillAPI.importbills;
  const [detailimportbill, setDetailImportBill] = useState([]);
  const [callback, setCallback] = state.importbillAPI.callback;
  const [datacart, setDataCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [id, setID] = useState('');
  var [madl, setMaDL] = useState('');
  const [datehdn, setDateHDN] = useState(new Date());
  const [onSearch, setOnSearch] = useState(false);
  const [importbill, setImportBill] = useState();

  useEffect(() => {
    AsyncStorage.getItem('inforuser').then(async dataUser => {
      // console.log('JSON.parse(dataUser) : ', JSON.parse(dataUser));
      setMaDL(JSON.parse(dataUser).madaily._id);
      setInforUser(JSON.parse(dataUser));
    });
  }, []);

  useEffect(() => {
    setImportBill({
      ngay: moment(),
      manv: inforuser?._id,
      makho: '',
      hotenkh: '',
      sodienthoaikh: '',
    });
  }, [inforuser]);

  const [date, setDate] = useState(moment());
  const [show, setShow] = useState(false);

  //Set m?? kho
  AsyncStorage.getItem('kt').then(async kt => {
    // console.log('Ch???n kho  : ', kt);
    if (kt == 'chonkho') {
      // importbill.makho = route.params.kho._id;
      setImportBill({...importbill, makho: route.params.kho._id});
      setLoading(!loading);
      console.log('Set loading l???i');
      AsyncStorage.setItem('kt', 'none');
    }
  });

  //Set ng??y l???p
  const onDateChange = (event, selectedDate) => {
    console.log('event : ', event);
    console.log('selectedDate : ', selectedDate);
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(moment(currentDate));
    console.log('currentDate : ', currentDate);
    setImportBill({...importbill, ngay: moment(currentDate)});
    console.log('importbill.ngay ch???n ng??y : ', importbill.ngay);
  };

  //Load l???i trang khi th??m v???t t??
  AsyncStorage.getItem('kt').then(kt => {
    if (kt == 'themvt') {
      setLoading(!loading);
      AsyncStorage.setItem('kt', 'none');
    }
  });

  const Format = number => {
    if (number >= 0) {
      return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.') + ' VND';
    } else
      return (
        '-' + String(number * -1).replace(/(.)(?=(\d{3})+$)/g, '$1.') + ' VND'
      );
  };

  useEffect(() => {
    AsyncStorage.getItem('cart')
      .then(data => {
        // if (data !== null) {
        data = JSON.parse(data);
        setDataCart(data);
        // }
      })
      .catch(err => {
        alert(err);
      });
  }, [loading]);

  useEffect(() => {
    setImportBill({
      ngay: moment(new Date()).format('MM-DD-yyy'),
      manv: inforuser._id,
      makho: '',
      hotenkh: '',
      sodienthoaikh: '',
      ctpn: [],
    });
    setDetailImportBill([]);
  }, [importbills]);

  return (
    <View style={{flex: 1}}>
      <Header title="Tr??? v???" type="arrow-left" navigation={navigation} />
      <ScrollView style={{paddingLeft: 7, paddingRight: 7}}>
        <View>
          <Text
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 20,
              marginBottom: 20,
              fontSize: 20,
              fontWeight: '500',
            }}>
            Nh???p Th??ng Tin Phi???u Nh???p
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Text style={styles.label}>Ng??y l???p</Text>
          {show && (
            <DateTimePicker
              value={new Date(date)}
              mode="date"
              minimumDate={new Date(moment().subtract(30, 'd'))}
              maximumDate={new Date(moment())}
              onChange={onDateChange}
            />
          )}

          <TextInput
            editable={false}
            style={[
              styles.textInput,
              {width: 100, textAlign: 'center', marginRight: 20},
            ]}>
            {date.format('DD/MM/YYYY')}
          </TextInput>
          <Button
            buttonStyle={styles.buttonAction}
            title="Ch???n ng??y"
            onPress={() => setShow(true)}
          />
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Text style={styles.label}>ID nh??n vi??n</Text>
          <TextInput
            style={styles.textInput}
            // placeholder="M?? nh??n vi??n"
            value={importbill?.manv}
            editable={false}
          />
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Text style={styles.label}>Kho</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Vui l??ng ch???n kho"
            value={route.params !== undefined ? route.params.kho.tenkho : ''}
            editable={false}
          />
        </View>

        <View
          style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 30}}>
          <Button
            buttonStyle={styles.buttonAction}
            title="Ch???n kho"
            onPress={() => {
              // navigation.navigate("DanhSachKho",{page: 'LapPhieuNhap'})
              console.log('m?? ?????i l?? : ', madl);
              navigation.navigate('DanhSachKho', {
                madl: madl,
                page: 'LapPhieuNhap',
              });
            }}
          />
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Text style={styles.label}>H??? t??n KH</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Vui l??ng nh???p h??? t??n kh??ch h??ng"
            value={importbill?.hotenkh}
            onChangeText={text => setImportBill({...importbill, hotenkh: text})}
            // editable={false}
          />
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Text style={styles.label}>S??T KH</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Vui l??ng nh???p s??t kh??ch h??ng"
            value={importbill?.sodienthoaikh}
            maxLength={10}
            keyboardType="numeric"
            onChangeText={text =>
              setImportBill({...importbill, sodienthoaikh: text})
            }
            // editable={false}
          />
        </View>

        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            marginTop: 15,
            marginBottom: 15,
          }}>
          <Text style={{fontSize: 20, fontWeight: '300'}}>
            Danh s??ch v???t t??
          </Text>
        </View>
        <View
          style={{borderWidth: 1, borderStyle: 'solid', borderColor: '#999'}}>
          <View
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              paddingLeft: 10,
              paddingRight: 10,
              height: 40,
            }}>
            <Text
              style={{
                width: 30,
              }}>
              STT
            </Text>
            <Text style={{flex: 1, textAlign: 'center'}}>T??n VT</Text>
            <Text style={{flex: 1, textAlign: 'center'}}>Gi??</Text>
            <Text style={{width: 72}}>S??? L?????ng</Text>
          </View>
          {datacart?.map((item, i) => {
            return (
              <View
                key={i}
                style={{
                  borderTopWidth: 1,
                  borderStyle: 'solid',
                  borderColor: '#999',
                  paddingTop: 7,
                  paddingBottom: 7,
                }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}>
                  <Text style={{width: 30}}>{i + 1}</Text>
                  <Text style={{flex: 1, textAlign: 'center'}}>
                    {item.material.tenvt}
                  </Text>
                  <Text style={{flex: 1, textAlign: 'center'}}>
                    {Format(item.material.gianhap)}
                  </Text>

                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: 80,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        onChangeQual(i, item.quantity, false);
                      }}>
                      <MaterialCommunityIcons
                        name="minus-circle-outline"
                        size={15}
                        color="black"
                      />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.textInputSL}
                      maxLength={4}
                      keyboardType="numeric"
                      placeholder="s??? l?????ng"
                      value={item.quantity.toString()}
                      onChangeText={text => {
                        if (text.length === 0) {
                          onChangeQual(i, 0, 'typing');
                        } else if (text.length > 0 && parseInt(text) < 1000) {
                          onChangeQual(i, parseInt(text), 'typing');
                        }
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        onChangeQual(i, item.quantity, true);
                      }}>
                      <MaterialCommunityIcons
                        name="plus-circle-outline"
                        size={15}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
                  <Icon
                    name="delete"
                    iconStyle={{color: '#1b94ff'}}
                    type="material"
                    onPress={() => {
                      removeProduct(i);
                    }}
                  />
                </View>
              </View>
            );
          })}
          {datacart !== null ? (
            datacart.length > 0 ? (
              <View
                style={{
                  borderTopWidth: 1,
                  borderStyle: 'solid',
                  borderColor: '#999',
                  paddingTop: 7,
                  paddingBottom: 7,
                }}>
                <Text style={{marginLeft: 'auto', marginRight: 'auto'}}>
                  T???ng c???ng : {Format(onLoadTotal())}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  borderTopWidth: 1,
                  borderStyle: 'solid',
                  borderColor: '#999',
                  paddingTop: 7,
                  paddingBottom: 7,
                }}>
                <Text style={{marginLeft: 'auto', marginRight: 'auto'}}>
                  T???ng c???ng : 0 VND
                </Text>
              </View>
            )
          ) : (
            <View
              style={{
                borderTopWidth: 1,
                borderStyle: 'solid',
                borderColor: '#999',
                paddingTop: 7,
                paddingBottom: 7,
              }}>
              <Text style={{marginLeft: 'auto', marginRight: 'auto'}}>
                T???ng c???ng : 0 VND
              </Text>
            </View>
          )}
        </View>

        <View style={styles.groupButtonAction}>
          <Button
            disabled={importbill?.makho === '' ? true : false}
            buttonStyle={[styles.buttonAction, {width: 250}]}
            title="Th??m V???t T?? V??o Danh S??ch"
            onPress={() => {
              navigation.navigate('BangGiaNhap', {makho: importbill?.makho});
            }}
          />
        </View>

        <View style={styles.groupButtonAction}>
          <Button
            disabled={datacart === null || datacart.length == 0 ? true : false}
            buttonStyle={styles.buttonAction}
            title="L???p H??a ????n"
            onPress={async () => {
              importbill.ngay = JSON.stringify(importbill.ngay).slice(1, 11);

              try {
                const res = await axios.post(
                  `${APIPN}`,
                  {
                    ...importbill,
                    ctpn: datacart.map(item => ({
                      mavt: item.material._id,
                      gianhap: item.material.gianhap,
                      soluong: item.quantity,
                    })),
                  },
                  {
                    headers: {Authorization: token},
                  },
                );
                console.log('importbill n?? : ', importbill);

                Alert.alert('Th??ng b??o', res.data.message, [
                  {
                    text: 'OK',
                    onPress: () => {
                      setCallback(!callback);
                      navigation.navigate('PhieuNhap');
                    },
                  },
                ]);
              } catch (err) {
                alert(err.response.data.message);
              }
            }}
          />

          <Button
            buttonStyle={styles.buttonAction}
            title="H???y"
            onPress={() => {
              navigation.navigate('PhieuNhap');
            }}
          />
        </View>
      </ScrollView>
    </View>
  );

  function onLoadTotal() {
    var total = 0;
    const cart = datacart;
    for (var i = 0; i < cart.length; i++) {
      total = total + cart[i].material.gianhap * cart[i].quantity;
    }
    return total;
  }

  function onChangeQual(i, soluong, type) {
    let cantd = datacart[i].quantity;
    //T??ng s??? l?????ng
    if (type == true) {
      cantd = cantd + 1;
      datacart[i].quantity = cantd;
      //  alert(data[i].quantity);
      AsyncStorage.setItem('cart', JSON.stringify(datacart));
      setDataCart(datacart);
    } else if (type == false && cantd >= 2) {
      //Gi???m s??? l?????ng
      cantd = cantd - 1;
      datacart[i].quantity = cantd;
      AsyncStorage.setItem('cart', JSON.stringify(datacart));
      setDataCart(datacart);
    } else if (type == false && cantd == 1) {
      //Gi???m s??? l?????ng v?? s??? l?????ng ??ang b???ng 1
      datacart.splice(i, 1);
      AsyncStorage.setItem('cart', JSON.stringify(datacart));
      setDataCart(datacart);
    } else if (type === 'typing') {
      datacart[i].quantity = soluong;
      AsyncStorage.setItem('cart', JSON.stringify(datacart));
      setDataCart(datacart);
    }
    return setLoading(!loading);
  }

  function removeProduct(i) {
    datacart.splice(i, 1);
    AsyncStorage.setItem('cart', JSON.stringify(datacart));
    setDataCart(datacart);
    return setLoading(!loading);
  }
}

const styles = StyleSheet.create({
  image: {
    height: 140,
    width: 160,
  },
  rowInput: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#999',
    borderRadius: 8,
    width: 270,
    height: 40,
  },
  textInputSL: {
    justifyContent: 'center',
    textAlign: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#999',
    borderRadius: 8,
    width: 45,
    height: 40,
    marginLeft: 5,
    marginRight: 5,
  },
  groupButtonAction: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 30,
  },
  buttonAction: {
    width: 120,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#1b94ff',
  },
  label: {
    width: 100,
    paddingLeft: 7,
  },
});
