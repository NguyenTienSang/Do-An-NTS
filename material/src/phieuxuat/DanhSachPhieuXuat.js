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
  const [listExportBillSearch, setListExportBillSearch] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [textInputFocussed, setTeInputFocussed] = useState(false);
  const [inforuser, setInforUser] = useState('');

  AsyncStorage.getItem('inforuser').then(async dataUser => {
    setInforUser(JSON.parse(dataUser));
  });

  useEffect(() => {
    if (inforuser.role === 'user') {
      setListExportBillSearch(
        exportbills?.filter(exportbill => {
          if (
            searchTerm === '' &&
            inforuser.madaily._id.toString() ===
              exportbill.manv.madaily._id.toString()
          ) {
            return exportbill;
          } else if (
            (exportbill._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
              `${exportbill.ngay.slice(8, 10)}-${exportbill.ngay.slice(
                5,
                7,
              )}-${exportbill.ngay.slice(0, 4)}`.includes(
                searchTerm.toLowerCase(),
              ) ||
              exportbill.manv._id
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              exportbill.manv.madaily.tendl
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              exportbill.makho.tenkho
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) &&
            inforuser.madaily._id.toString() ===
              exportbill.manv.madaily._id.toString()
          ) {
            return exportbill;
          }
        }),
      );
    } else {
      setListExportBillSearch(
        exportbills?.filter(exportbill => {
          if (searchTerm === '') {
            return exportbill;
          } else if (
            exportbill._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${exportbill.ngay.slice(8, 10)}-${exportbill.ngay.slice(
              5,
              7,
            )}-${exportbill.ngay.slice(0, 4)}`.includes(
              searchTerm.toLowerCase(),
            ) ||
            exportbill.manv._id
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            exportbill.manv.madaily.tendl
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            exportbill.makho.tenkho
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          ) {
            return exportbill;
          }
        }),
      );
    }
  }, [searchTerm, exportbills, inforuser]);

  return (
    <View style={{flex: 1}}>
      <Header title="Tr??? v???" type="arrow-left" navigation={navigation} />
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={styles.title}>Danh S??ch Phi???u Xu???t</Text>
        <View style={styles.optionsSelect}>
          <Button
            title="Th??m"
            buttonStyle={styles.buttonOption}
            onPress={() => {
              navigation.navigate('LapPhieuXuat');
            }}
          />
        </View>

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
        <ScrollView>
          <View style={styles.listPrice}>
            {listExportBillSearch.length ? (
              listExportBillSearch?.map((phieuxuat, index) => (
                <PhieuXuatItem
                  key={phieuxuat._id}
                  phieuxuat={phieuxuat}
                  stt={index}></PhieuXuatItem>
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
                  ?????i l?? ch??a c?? phi???u xu???t
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
