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
  Dimensions,
  Alert,
  Button,
} from 'react-native';

import {GlobalState} from '../GlobalState';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APIVattu, APITKLNN} from '../api/API';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ThongKeTheoNamTungDaiLy({navigation, route}) {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [year, setYear] = useState(0);
  var [madl, setMaDL] = useState('');
  var [tendaily, setTenDL] = useState('');
  const [loading, setLoading] = useState(0);
  const [datavattu, setDataVatTu] = useState([]);
  const [datactpn, setDataCTPN] = useState([]);
  const [datactpx, setDataCTPX] = useState([]);
  // const [sothang,setSoThang] = useState([]);
  const [dataStatistic, setDataStatistic] = useState('');
  const slnhap = [];
  const slxuat = [];
  const currentyear = new Date().getFullYear();
  var totalcost = 0;
  var thang = 0;

  const Format = number => {
    if (number >= 0) {
      return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.') + ' VND';
    } else
      return (
        '-' + String(number * -1).replace(/(.)(?=(\d{3})+$)/g, '$1.') + ' VND'
      );
  };

  if (route.params !== undefined) {
    madl = route.params.daily._id;
    tendaily = route.params.daily.tendl;
  }

  // useEffect(()=>{
  //     for(var i =0; i< 12; i++)
  //     {
  //         sothang.push(i);
  //     }
  //     setSoThang(sothang);
  //   },[])

  useEffect(() => {
    console.log('dataStatistic : ', dataStatistic);
    console.log('load lại');
  }, [dataStatistic]);

  const ThongKeDoanhThu = async () => {
    // console.log('route.params.daily._id : ',route.params.daily._id)
    // console.log('year : ',year)
    // console.log('token : ',token)
    // const madailyfilter = route.params.daily._id;
    // const yearstatistic = year;

    await axios
      .post(
        `${APITKLNN}`,
        {
          madailyfilter: route.params.daily._id,
          yearstatistic: parseInt(year),
        },
        {headers: {Authorization: token}},
      )
      .then(res => {
        setDataStatistic(res.data);
        console.log('res.data : ', res.data);
        // res.data?.map(item => {
        //         console.log('item.thang : ',item.thang)
        // })
      })
      .catch(error => {
        //   console.log('error.response : ',error.response.data.message)
        // Alert.alert('Thông báo ',error);
        Alert.alert('Thông báo ', 'Thất bại');
      });
  };

  return (
    <View style={{flex: 1}}>
      <Header title="Trở về" type="arrow-left" navigation={navigation} />
      <ScrollView>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            height: 40,
            marginTop: 20,
            marginBottom: 0,
          }}>
          <Text
            style={{
              display: 'flex',
              fontSize: 20,
              fontWeight: '600',
              marginRight: 10,
            }}>
            Thống kê lợi nhuận năm
          </Text>
          <TextInput
            style={[styles.textInput]}
            placeholder="nhập năm"
            value={year}
            keyboardType="numeric"
            onChangeText={text => setYear(text)}
          />
        </View>

        {/* <View style={styles.rowInput}>
                        <Text style={{display:'flex',alignItems:'center',textAlign:'center'}}>Mã đại lý</Text>
                        <TextInput style={{  display:'flex',justifyContent:'center',textAlign:'center',borderWidth:1,borderStyle:'solid',borderColor:'#999',borderRadius:5,width:240,height:38,marginTop:20}} 
                             placeholder="Mã đại lý"
                             value={madl}
                             editable={false}
                            //  onChangeText={(text) =>  setMaDL(text)}
                        />
                    </View> */}

        <View style={styles.rowInput}>
          <Text
            style={{
              display: 'flex',
              alignItems: 'center',
              textAlign: 'center',
              marginTop: 15,
              marginRight: 15,
            }}>
            Đại lý
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
              borderRadius: 5,
              width: 240,
              height: 38,
              marginTop: 20,
            }}
            placeholder="Vui lòng chọn đại lý"
            value={route.params !== undefined ? route.params.daily.tendl : ''}
            editable={false}
            //  onChangeText={(text) =>  setMaDL(text)}
          />
        </View>

        <View
          style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 30}}>
          <Button
            buttonStyle={styles.buttonAction}
            title="Chọn đại lý"
            onPress={() => {
              navigation.navigate('DanhSachDaiLy', {
                page: 'ThongKeTheoNamTungDaiLy',
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
            onPress={async () => {
              if (year > currentyear) {
                alert('Thời gian lớn hơn năm hiện tại');
              } else {
                if (route.params === undefined) {
                  alert('Vui lòng chọn đại lý');
                } else if (route.params !== undefined) {
                  await ThongKeDoanhThu();
                }
              }
            }}
          />
        </View>

        <View>
          {dataStatistic ? (
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: 400,
              }}>
              {dataStatistic.map((item, index) => (
                <View
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                  }}>
                  <View
                    style={[
                      styles.itemstatistic,
                      {backgroundColor: '#1b94ff'},
                    ]}>
                    <Text style={{color: '#fff'}}>Tháng : {item.thang}</Text>
                  </View>
                  <View style={styles.itemstatistic}>
                    <Text>Số phiếu nhập : {item.sophieunhap}</Text>
                    <Text>Tổng tiền nhập : {Format(item.chiphinhap)}</Text>
                  </View>
                  <View style={styles.itemstatistic}>
                    <Text>Số phiếu xuất : {item.sophieuxuat}</Text>
                    <Text>Tổng tiền xuất : {Format(item.chiphixuat)}</Text>
                  </View>
                  <View style={styles.itemstatistic}>
                    <Text>
                      Doanh thu tháng {item.thang} :{' '}
                      {Format(item.chiphixuat - item.chiphinhap)}
                    </Text>
                  </View>
                </View>
              ))}
              {
                <View
                  style={[styles.itemstatistic, {backgroundColor: '#1b94ff'}]}>
                  <Text style={{color: '#fff'}}>
                    Doanh thu cả năm : {Format(onLoadTotal())}
                  </Text>
                </View>
              }
            </View>
          ) : (
            <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
              <Text style={{fontSize: 20}}>Không có dữ liệu</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );

  function onLoadTotal() {
    var total = 0;
    dataStatistic.map(item => {
      total += item.chiphixuat - item.chiphinhap;
    });

    return total;
  }
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
    borderRadius: 5,
    width: 80,
    height: 38,
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
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 30,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000',
    width: SCREEN_WIDTH,
  },
});
