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
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import {Icon, Button} from 'react-native-elements';
import NumericInput from 'react-native-numeric-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';

export default function PhieuNhap({navigation}) {
  return (
    <View style={{flex: 1}}>
      <Header title="Trở về" type="arrow-left" navigation={navigation} />
      <View style={styles.groupButtonAction}>
        <Button
          buttonStyle={styles.buttonAction}
          title="Danh Sách Phiếu Xuất"
          onPress={() => {
            AsyncStorage.removeItem('cart');
            navigation.navigate('DanhSachPhieuXuat');
          }}
        />
        <Button
          buttonStyle={styles.buttonAction}
          title="Lập Phiếu Xuất"
          onPress={() => {
            AsyncStorage.removeItem('cart');
            AsyncStorage.setItem('kt', '0');
            AsyncStorage.setItem('dachonkho', '0');
            navigation.navigate('LapPhieuXuat');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 140,
    width: 160,
  },
  textInput: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#999',
    width: 270,
    height: 40,
  },
  groupButtonAction: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    flexDirection: 'column',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  buttonAction: {
    width: 220,
    height: 100,
    borderRadius: 5,
    backgroundColor: '#1b94ff',
    marginBottom: 40,
  },
});
