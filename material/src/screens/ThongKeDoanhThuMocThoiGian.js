import axios from 'axios';
import React, {useContext, useState, useEffect} from 'react';
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
  Button,
} from 'react-native';
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {GlobalState} from '../GlobalState';
import Header from '../components/Header';
import PhieuXuatItem from '../phieuxuat/PhieuXuatItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APICTPX, APITKLNGD} from '../api/API';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ThongKeDoanhThuMocThoiGian({navigation, route}) {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [search, setSearch] = useState('');
  const [textInputFocussed, setTeInputFocussed] = useState(false);
  var [madl, setMaDL] = useState('');
  var [tendaily, setTenDL] = useState('');
  const [loading, setLoading] = useState(0);

  const [date, setDate] = useState(moment());
  const [show, setShow] = useState(false);
  const [optionStatistic, setOptionStatistic] = useState('Thang');

  const [dataStatistic, setDataStatistic] = useState('');

  //Khởi tạo mảng năm
  const listmonth = [];
  const listyear = [];

  var max = new Date().getFullYear();
  var min = 1995;

  var currentDate = new Date();

  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);

  for (var i = max; i >= min; i--) {
    listyear.push(i);
  }

  for (var i = 1; i <= 12; i++) {
    listmonth.push(i);
  }

  var nam = 0;
  const slnhap = [];
  const slxuat = [];
  const currentyear = new Date().getFullYear();

  var totalcost = 0;
  const Format = number => {
    if (number >= 0) {
      return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.') + ' VND';
    } else
      return (
        '-' + String(number * -1).replace(/(.)(?=(\d{3})+$)/g, '$1.') + ' VND'
      );
  };

  if (route.params !== undefined) {
    console.log('route.params.daily._id : ', route.params.daily._id);
    madl = route.params.daily._id;
    tendaily = route.params.daily.tendl;
  }

  //Set ngày lập
  const onDateChange = (event, selectedDate) => {
    console.log('event : ', event);
    console.log('selectedDate : ', selectedDate);
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(moment(currentDate));
    console.log('currentDate : ', currentDate);
    // setImportBill({...importbill, ngay: moment(currentDate)});
  };

  const onLoadTotal = () => {
    let total = 0;

    if (optionStatistic === 'Ngay') {
      dataStatistic?.map(exportbill => {
        exportbill?.ctpx?.map(epbill => {
          total += epbill.giaxuat * epbill.soluong;
        });
      });

      return total;
    } else if (optionStatistic === 'Thang' || optionStatistic === 'Nam') {
      dataStatistic.map(item => {
        console.log('typeof(item.tongtienxuat) : ', typeof item.tongtienxuat);
        total += item.tongtienxuat;
      });
    }

    return total;
  };

  const ThongKeDoanhThu = async () => {
    if (madl !== '') {
      try {
        const res = await axios.post(
          'http://192.168.1.3:5000/api/thongke/thongkedoanhthu',
          {
            madailyfilter: madl,
            timestatistic:
              optionStatistic === 'Ngay'
                ? moment(date).format('YYYY-MM-DD')
                : optionStatistic === 'Thang'
                ? `${year}-${month}`
                : year,
            optionstatistic: optionStatistic,
          },
        );
        console.log(res.data);
        setDataStatistic(res.data);
      } catch (error) {
        Alert.alert('Thông báo ', 'Thất bại');
      }
    } else if (madl !== '') {
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header title="Trở về" type="arrow-left" navigation={navigation} />
      <ScrollView>
        <View style={{marginBottom: 20}}>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 60,
            }}>
            <Text style={{fontSize: 20, fontWeight: '600'}}>
              Thống kê doanh thu theo{' '}
              {optionStatistic === 'Ngay'
                ? 'ngày'
                : optionStatistic === 'Thang'
                ? 'tháng'
                : 'năm'}
            </Text>
          </View>

          <View style={styles.rowInput}>
            <Text>Loại thống kê : </Text>
            <Picker
              style={styles.pickerDropdown}
              selectedValue={optionStatistic}
              onValueChange={itemValue => {
                setOptionStatistic(itemValue);
                setDataStatistic('');
              }}>
              <Picker.Item value="Ngay" label="Ngày" />
              <Picker.Item value="Thang" label="Tháng" />
              <Picker.Item value="Nam" label="Năm" />
            </Picker>
          </View>
          {optionStatistic === 'Ngay' ? (
            <View style={styles.rowInput}>
              <Text style={{marginRight: 55}}>Ngày : </Text>
              {show && (
                <DateTimePicker
                  value={new Date(date)}
                  mode="date"
                  // minimumDate={new Date(moment().subtract(30, 'd'))}
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
                title="Chọn ngày"
                onPress={() => setShow(true)}
              />
            </View>
          ) : optionStatistic === 'Thang' ? (
            <View style={styles.rowInput}>
              <Text>Tháng : </Text>
              <Picker
                style={styles.pickerDropdown}
                selectedValue={month}
                onValueChange={itemValue => setMonth(itemValue)}>
                {listmonth.map((value, i) => (
                  <Picker.Item key={i} value={value} label={value.toString()} />
                ))}
              </Picker>

              <Text> Năm : </Text>
              <Picker
                style={styles.pickerDropdown}
                selectedValue={year}
                onValueChange={itemValue => setYear(itemValue)}>
                {listyear.map((value, i) => (
                  <Picker.Item key={i} value={value} label={value.toString()} />
                ))}
              </Picker>
            </View>
          ) : (
            <View style={styles.rowInput}>
              <Text style={{marginRight: 55}}>Năm : </Text>
              <Picker
                style={styles.pickerDropdown}
                selectedValue={year}
                onValueChange={itemValue => setYear(itemValue)}>
                {listyear.map((value, i) => (
                  <Picker.Item key={i} value={value} label={value.toString()} />
                ))}
              </Picker>
            </View>
          )}

          <View style={styles.rowInput}>
            <Text
              style={{
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                marginTop: 15,
                marginRight: 30,
              }}>
              Đại lý :
            </Text>
            <TextInput
              style={{
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: '#999',
                borderRadius: 8,
                width: 260,
                height: 38,
                marginTop: 20,
              }}
              placeholder="Vui lòng chọn đại lý"
              value={route.params !== undefined ? route.params.daily.tendl : ''}
              editable={false}
              onChangeText={text => setMaDL(text)}
            />
          </View>

          {/* =========================================== */}
          <View
            style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 30}}>
            <Button
              buttonStyle={styles.buttonAction}
              title="Chọn đại lý"
              onPress={() => {
                navigation.navigate('DanhSachDaiLy', {
                  page: 'ThongKeDoanhThuMocThoiGian',
                });
              }}
            />
          </View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
              marginBottom: 20,
            }}>
            <Button
              buttonStyle={styles.buttonAction}
              title="Thống kê"
              disabled={madl === '' ? true : false}
              onPress={async () => {
                ThongKeDoanhThu();
              }}
            />
          </View>
        </View>

        <View>
          <View style={styles.listPrice}>
            {optionStatistic === 'Ngay' && dataStatistic.length > 0 ? (
              <View>
                <View>
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
                  {dataStatistic
                    ?.filter(phieuxuat => {
                      if (search == '') {
                        return phieuxuat;
                      } else if (
                        phieuxuat._id
                          .toLowerCase()
                          .includes(search.toLowerCase()) ||
                        phieuxuat.manv._id
                          .toLowerCase()
                          .includes(search.toLowerCase()) ||
                        phieuxuat.manv.hoten
                          .toLowerCase()
                          .includes(search.toLowerCase()) ||
                        phieuxuat.manv.madaily.tendl
                          .toLowerCase()
                          .includes(search.toLowerCase()) ||
                        phieuxuat.makho.tenkho
                          .toLowerCase()
                          .includes(search.toLowerCase())
                      ) {
                        return phieuxuat;
                      }
                    })
                    ?.map((phieuxuat, index) => (
                      <PhieuXuatItem
                        key={phieuxuat._id}
                        phieuxuat={phieuxuat}
                        stt={index}></PhieuXuatItem>
                    ))}
                </View>
                <View
                  style={[
                    styles.itemstatistic,
                    {
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      textAlign: 'center',
                      flex: 0.6,
                      backgroundColor: '#1b94ff',
                      height: 40,
                      borderColor: '#fff',
                    },
                  ]}>
                  <Text style={{color: '#fff'}}>
                    Tổng doanh thu : {Format(onLoadTotal())}
                  </Text>
                </View>
              </View>
            ) : optionStatistic === 'Thang' && dataStatistic.length > 0 ? (
              <View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#1b94ff',
                  }}>
                  <View
                    style={[
                      styles.itemstatistic,
                      {
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        textAlign: 'center',
                        flex: 0.6,
                      },
                    ]}>
                    <Text style={{color: '#fff'}}>Ngày</Text>
                  </View>

                  <View
                    style={[
                      styles.itemstatistic,
                      {
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        textAlign: 'center',
                        flex: 1,
                      },
                    ]}>
                    <Text style={{color: '#fff'}}>Số phiếu xuất</Text>
                  </View>
                  <View
                    style={[
                      styles.itemstatistic,
                      {
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        textAlign: 'center',
                        alignItems: 'center',
                        flex: 1,
                      },
                    ]}>
                    <Text style={{color: '#fff'}}>Doanh thu</Text>
                  </View>
                </View>
                <View>
                  {dataStatistic?.map((dataitem, index) => (
                    <View
                      key={index}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                      }}>
                      <View
                        style={[
                          styles.itemstatistic,
                          {
                            justifyContent: 'center',
                            textAlign: 'center',
                            flex: 0.6,
                          },
                        ]}>
                        <Text>{dataitem.ngay}</Text>
                      </View>
                      <View
                        style={[
                          styles.itemstatistic,
                          {
                            justifyContent: 'center',
                            textAlign: 'center',
                            flex: 1,
                          },
                        ]}>
                        <Text>{dataitem.sophieuxuat}</Text>
                      </View>
                      <View
                        style={[
                          styles.itemstatistic,
                          {
                            justifyContent: 'center',
                            textAlign: 'center',
                            flex: 1,
                          },
                        ]}>
                        <Text>{Format(dataitem.tongtienxuat)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
                <View
                  style={[
                    styles.itemstatistic,
                    {
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      textAlign: 'center',
                      flex: 0.6,
                      backgroundColor: '#1b94ff',
                      height: 40,
                    },
                  ]}>
                  <Text style={{color: '#fff'}}>
                    Tổng doanh thu : {Format(onLoadTotal())}
                  </Text>
                </View>
              </View>
            ) : optionStatistic === 'Nam' && dataStatistic.length > 0 ? (
              <View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#1b94ff',
                  }}>
                  <View
                    style={[
                      styles.itemstatistic,
                      {
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        textAlign: 'center',
                        flex: 0.6,
                      },
                    ]}>
                    <Text style={{color: '#fff'}}>Tháng</Text>
                  </View>

                  <View
                    style={[
                      styles.itemstatistic,
                      {
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        textAlign: 'center',
                        flex: 1,
                      },
                    ]}>
                    <Text style={{color: '#fff'}}>Số phiếu xuất</Text>
                  </View>
                  <View
                    style={[
                      styles.itemstatistic,
                      {
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        textAlign: 'center',
                        alignItems: 'center',
                        flex: 1,
                      },
                    ]}>
                    <Text style={{color: '#fff'}}>Doanh thu</Text>
                  </View>
                </View>
                <View>
                  {dataStatistic?.map((dataitem, index) => (
                    <View
                      key={index}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                      }}>
                      <View
                        style={[
                          styles.itemstatistic,
                          {
                            justifyContent: 'center',
                            textAlign: 'center',
                            flex: 0.6,
                          },
                        ]}>
                        <Text>{dataitem.thang}</Text>
                      </View>
                      <View
                        style={[
                          styles.itemstatistic,
                          {
                            justifyContent: 'center',
                            textAlign: 'center',
                            flex: 1,
                          },
                        ]}>
                        <Text>{dataitem.sophieuxuat}</Text>
                      </View>
                      <View
                        style={[
                          styles.itemstatistic,
                          {
                            justifyContent: 'center',
                            textAlign: 'center',
                            flex: 1,
                          },
                        ]}>
                        <Text>{Format(dataitem.tongtienxuat)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
                <View
                  style={[
                    styles.itemstatistic,
                    {
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      textAlign: 'center',
                      flex: 0.6,
                      backgroundColor: '#1b94ff',
                      height: 40,
                    },
                  ]}>
                  <Text style={{color: '#fff'}}>
                    Tổng doanh thu : {Format(onLoadTotal())}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 140,
    width: 160,
  },
  rowInput: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 20,
    marginLeft: 20,
  },
  textInput: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#999',
    borderRadius: 8,
    width: 100,
    height: 38,
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
  buttonOption: {
    width: 90,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#1b94ff',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  itemstatistic: {
    display: 'flex',
    // flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 30,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000',
    width: SCREEN_WIDTH,
  },
  pickerDropdown: {
    width: 125,
    height: 50,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 8,
    borderColor: '#000',
    backgroundColor: '#dbdbdb',
    color: '#000',
  },
  listPrice: {
    flex: 1,
    width: SCREEN_WIDTH,
    justifyContent: 'space-between',
  },
});
