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
      <ScrollView>
        <View style={styles.groupButtonAction}>
          <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
            <Text
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                fontSize: 20,
                fontWeight: '500',
                marginBottom: 30,
              }}>
              Thống Kê
            </Text>
            {/* ----------------- New -------------------- */}
            <Button
              buttonStyle={styles.buttonAction}
              title="Nhân Viên Lập Phiếu"
              onPress={() => {
                navigation.navigate('ThongKeNhanVienLapPhieu');
              }}
            />
            <Button
              buttonStyle={styles.buttonAction}
              title="Vật Tư Tồn"
              onPress={async () => {
                // AsyncStorage.removeItem('cart');
                // AsyncStorage.setItem('kt', '0');
                navigation.navigate('ThongKeVatTuTon');
              }}
            />
            {/* ----------------------------------------------- */}

            <Button
              buttonStyle={styles.buttonAction}
              title={'Thống kê doanh thu'}
              onPress={() => {
                navigation.navigate('ThongKeDoanhThuMocThoiGian');
              }}
            />

            <Button
              buttonStyle={styles.buttonAction}
              title={'Thống kê lợi nhuận \n theo năm'}
              onPress={() => {
                navigation.navigate('ThongKeTheoNamTungDaiLy');
              }}
            />
            <Button
              buttonStyle={styles.buttonAction}
              title={'Thống kê lợi nhuận \n theo giai đoạn'}
              onPress={async () => {
                AsyncStorage.removeItem('cart');
                AsyncStorage.setItem('kt', '0');
                navigation.navigate('ThongKeTheoGiaiDoanTungDaiLy');
              }}
            />
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
