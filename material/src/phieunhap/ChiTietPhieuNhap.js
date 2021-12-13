import React, {useState, useEffect} from 'react';
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
import DatePicker from 'react-native-datepicker';
import {Icon, Button} from 'react-native-elements';
import NumericInput from 'react-native-numeric-input';
import PhieuNhap from './../screens/PhieuNhap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APICTPN} from '../api/API';
import Header from '../components/Header';

function ChiTietPhieuNhap(phieunhap) {
  const Format = number => {
    if (number >= 0) {
      return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.') + ' VND';
    } else
      return (
        '-' + String(number * -1).replace(/(.)(?=(\d{3})+$)/g, '$1.') + ' VND'
      );
  };

  return (
    <View>
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderTopWidth: 1,
          borderColor: '#1b94ff',
          height: 30,
        }}>
        <Text>Chi Tiết Phiếu Nhập</Text>
      </View>

      <View
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexDirection: 'row',
          height: 40,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: '#1b94ff',
          paddingLeft: 5,
          paddingRight: 5,
        }}>
        <Text style={{flex: 1}}>Tên VT</Text>
        <Text style={{flex: 1}}>Giá</Text>
        <Text style={{flex: 1}}>Số Lượng</Text>
        <Text style={{flex: 1}}>Thành Tiền</Text>
      </View>
      <View>
        {phieunhap.phieunhap.ctpn.map((item, stt) => (
          <View key={stt}>
            {
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderLeftWidth: 1,
                  borderRightWidth: 1,
                  borderBottomWidth: 1,
                  borderStyle: 'solid',
                  borderColor: '#1b94ff',
                  paddingTop: 5,
                  paddingBottom: 5,
                  paddingLeft: 5,
                  paddingRight: 5,
                }}>
                <Text style={{flex: 0.7}}>{item.mavt.tenvt}</Text>
                <Text style={{flex: 1}}>{Format(item.mavt.gianhap)}</Text>
                <Text
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flex: 0.5,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}>
                  {item.soluong}
                </Text>
                <Text style={{flex: 1}}>
                  {Format(item.mavt.gianhap * item.soluong)}
                </Text>
              </View>
            }
          </View>
        ))}
      </View>
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderTopWidth: 0,
          borderColor: '#1b94ff',
          marginBottom: 5,
          height: 30,
        }}>
        <Text>Tổng Tiền : {Format(onLoadTotal())}</Text>
      </View>
    </View>
  );

  function onLoadTotal() {
    var total = 0;
    phieunhap.phieunhap.ctpn.map(item => {
      total += item.mavt.gianhap * item.soluong;
    });

    return total;
  }
}

export default ChiTietPhieuNhap;
