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
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import {Icon, Button} from 'react-native-elements';
import NumericInput from 'react-native-numeric-input';
import PhieuNhap from './../screens/PhieuNhap';
import {DSPhieuNhap} from '../global/Data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import {APIPN} from '../api/API';
import PhieuNhapItem from './PhieuNhapItem';
import * as Animatable from 'react-native-animatable';
import {GlobalState} from './../GlobalState';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DanhSachPhieuNhap({navigation}) {
  const state = useContext(GlobalState);
  const [importbills] = state.importbillAPI.importbills;
  const [listImportBillSearch, setListImportBillSearch] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [textInputFocussed, setTeInputFocussed] = useState(false);
  const [inforuser, setInforUser] = useState('');

  AsyncStorage.getItem('inforuser').then(async dataUser => {
    setInforUser(JSON.parse(dataUser));
  });

  useEffect(() => {
    if (inforuser.role === 'user') {
      setListImportBillSearch(
        importbills?.filter(importbill => {
          if (
            searchTerm === '' &&
            inforuser.madaily._id.toString() ===
              importbill.manv.madaily._id.toString()
          ) {
            return importbill;
          } else if (
            (importbill._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
              `${importbill.ngay.slice(8, 10)}-${importbill.ngay.slice(
                5,
                7,
              )}-${importbill.ngay.slice(0, 4)}`.includes(
                searchTerm.toLowerCase(),
              ) ||
              importbill.manv._id
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              importbill.manv.madaily.tendl
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              importbill.makho.tenkho
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) &&
            inforuser.madaily._id.toString() ===
              importbill.manv.madaily._id.toString()
          ) {
            return importbill;
          }
        }),
      );
    } else {
      setListImportBillSearch(
        importbills?.filter(importbill => {
          if (searchTerm === '') {
            return importbill;
          } else if (
            importbill._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${importbill.ngay.slice(8, 10)}-${importbill.ngay.slice(
              5,
              7,
            )}-${importbill.ngay.slice(0, 4)}`.includes(
              searchTerm.toLowerCase(),
            ) ||
            importbill.manv._id
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            importbill.manv.madaily.tendl
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            importbill.makho.tenkho
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          ) {
            console.log('importbill.ngay : ', importbill.ngay.slice(8, 10));
            return importbill;
          }
        }),
      );
    }
  }, [searchTerm, importbills, inforuser]);

  return (
    <View style={{flex: 1}}>
      <Header title="Trở về" type="arrow-left" navigation={navigation} />
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.title}>Danh Sách Phiếu Nhập</Text>
        <View style={styles.optionsSelect}>
          <Button
            title="Thêm"
            buttonStyle={styles.buttonOption}
            onPress={() => {
              navigation.navigate('LapPhieuNhap');
            }}
          />
        </View>

        <View style={styles.TextInput2}>
          <TextInput
            style={{width: '80%'}}
            placeholder="Nhập từ khóa tìm kiếm"
            onChangeText={text => setSearchTerm(text)}
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
            {listImportBillSearch.length ? (
              listImportBillSearch?.map((phieunhap, index) => (
                <PhieuNhapItem
                  key={phieunhap._id}
                  phieunhap={phieunhap}
                  stt={index}></PhieuNhapItem>
              ))
            ) : (
              <View>
                <Text
                  style={{
                    marginTop: 150,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    fontSize: 20,
                  }}>
                  Đại lý chưa có phiếu nhập
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
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
  image: {
    height: 140,
    width: 160,
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
    flex: 1,
    width: SCREEN_WIDTH,
    justifyContent: 'space-between',
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
});
