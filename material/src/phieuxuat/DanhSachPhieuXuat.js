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
import PhieuXuatItem from './PhieuXuatItem';
import * as Animatable from 'react-native-animatable';
import {GlobalState} from './../GlobalState';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DanhSachPhieuXuat({navigation}) {
  const state = useContext(GlobalState);
  const [exportbills] = state.exportbillAPI.exportbills;
  const [search, setSearch] = useState('');
  const [textInputFocussed, setTeInputFocussed] = useState(false);

  useEffect(() => {
    console.log('exportbills : ', exportbills);
  }, [exportbills]);

  return (
    <View style={{flex: 1}}>
      <Header title="Trở về" type="arrow-left" navigation={navigation} />
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.title}>Danh Sách Phiếu Xuất</Text>
        <View style={styles.optionsSelect}>
          <Button
            title="Thêm"
            buttonStyle={styles.buttonOption}
            onPress={() => {
              navigation.navigate('LapPhieuXuat');
            }}
          />
        </View>

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
            {exportbills
              ?.filter(phieuxuat => {
                if (search == '') {
                  return phieuxuat;
                } else if (
                  phieuxuat._id.toLowerCase().includes(search.toLowerCase()) ||
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
