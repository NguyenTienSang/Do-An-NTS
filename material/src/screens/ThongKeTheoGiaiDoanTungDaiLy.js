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
import {APICTPX, APITKLNGD} from '../api/API';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ThongKeTheoGiaiDoanTatCaDaiLy({navigation, route}) {
  const state = useContext(GlobalState);
  const [token] = state.token;
  var [yearbd, setYearBD] = useState(0);
  var [yearkt, setYearKT] = useState(0);
  var [madl, setMaDL] = useState('');
  var [tendaily, setTenDL] = useState('');
  const [loading, setLoading] = useState(0);
  const [datavattu, setDataVatTu] = useState([]);
  const [datactpn, setDataCTPN] = useState([]);
  const [datactpx, setDataCTPX] = useState([]);
  const [sonam, setSoNam] = useState([]);
  const [dataStatistic, setDataStatistic] = useState('');

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
    madl = route.params._id;
    tendaily = route.params.tendl;
  }

  const ThongKeDoanhThu = async () => {
    await axios
      .post(
        `${APITKLNGD}`,
        {
          madailyfilter: route.params.daily._id,
          startyearstatistic: parseInt(yearbd),
          endyearstatistic: parseInt(yearkt),
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
        // Alert.alert('Th??ng b??o ',error);
        Alert.alert('Th??ng b??o ', 'Th???t b???i');
      });
  };

  return (
    <View style={{flex: 1}}>
      <Header title="Tr??? v???" type="arrow-left" navigation={navigation} />
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
              Th???ng k?? l???i nhu???n t??? n??m{' '}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              textAlign: 'center',
              marginBottom: 20,
            }}>
            <TextInput
              style={[styles.textInput]}
              placeholder="n??m b???t ?????u"
              value={yearbd}
              keyboardType="numeric"
              onChangeText={text => setYearBD(text)}
            />
            <Text> - </Text>
            <TextInput
              style={[styles.textInput]}
              placeholder="n??m k???t th??c"
              value={yearkt}
              keyboardType="numeric"
              onChangeText={text => setYearKT(text)}
            />
          </View>

          <View style={styles.rowInput}>
            <Text
              style={{
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                marginTop: 15,
                marginRight: 15,
              }}>
              ?????i l??
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
                width: 240,
                height: 38,
                marginTop: 20,
              }}
              placeholder="Vui l??ng ch???n ?????i l??"
              value={route.params !== undefined ? route.params.daily.tendl : ''}
              editable={false}
              //  onChangeText={(text) =>  setMaDL(text)}
            />
          </View>

          <View
            style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 30}}>
            <Button
              buttonStyle={styles.buttonAction}
              title="Ch???n ?????i l??"
              onPress={() => {
                navigation.navigate('DanhSachDaiLy', {
                  page: 'ThongKeTheoGiaiDoanTungDaiLy',
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
              title="Th???ng k??"
              onPress={async () => {
                if (yearbd == '' && yearkt == '') {
                  Alert.alert('Th??ng b??o', 'Vui l??ng nh???p th???i gian');
                } else if (yearbd == '') {
                  Alert.alert('Th??ng b??o', 'Vui l??ng nh???p th???i gian b???t ?????u');
                } else if (yearkt == '') {
                  Alert.alert('Th??ng b??o', 'Vui l??ng nh???p th???i gian k???t th??c');
                } else if (yearbd > yearkt) {
                  Alert.alert(
                    'L???i Th???i Gian',
                    'Th???i gian b???t ?????u ph???i nh??? h??n k???t th??c',
                  );
                } else if (yearbd > currentyear) {
                  Alert.alert(
                    'L???i Th???i Gian',
                    'Th???i gian b???t ?????u l???n h??n n??m hi???n t???i',
                  );
                } else if (yearkt > currentyear) {
                  Alert.alert(
                    'L???i Th???i Gian',
                    'Th???i gian k???t th??c l???n h??n n??m hi???n t???i',
                  );
                } else if (yearbd != '' && yearkt != '') {
                  await ThongKeDoanhThu();
                  // yearbd =  parseInt(yearbd);
                  // yearkt =  parseInt(yearkt);
                  // setSoNam([])
                  // console.log('Chi???u d??i : ',sonam.length);
                  // for(var i =yearbd; i <= yearkt; i++)
                  // {
                  //     sonam.push(i);
                  // }
                  // setSoNam(sonam);
                  // setLoading(loading+1);
                }
              }}
            />
          </View>
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
                    <Text style={{color: '#fff'}}>N??m : {item.nam}</Text>
                  </View>
                  <View style={styles.itemstatistic}>
                    <Text>S??? phi???u nh???p : {item.sophieunhap}</Text>
                    <Text>T???ng ti???n nh???p : {Format(item.chiphinhap)}</Text>
                  </View>
                  <View style={styles.itemstatistic}>
                    <Text>S??? phi???u xu???t : {item.sophieuxuat}</Text>
                    <Text>T???ng ti???n xu???t : {Format(item.chiphixuat)}</Text>
                  </View>
                  <View style={styles.itemstatistic}>
                    <Text>
                      T???ng doanh thu n??m {item.nam} :{' '}
                      {Format(item.chiphixuat - item.chiphinhap)}
                    </Text>
                  </View>
                </View>
              ))}
              {
                <View
                  style={[styles.itemstatistic, {backgroundColor: '#1b94ff'}]}>
                  <Text style={{color: '#fff'}}>
                    Doanh thu t??? n??m {yearbd} - {yearkt} :{' '}
                    {Format(onLoadTotal())}
                  </Text>
                </View>
              }
            </View>
          ) : (
            <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
              <Text style={{fontSize: 20}}>Kh??ng c?? d??? li???u</Text>
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
    borderRadius: 8,
    width: 100,
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
