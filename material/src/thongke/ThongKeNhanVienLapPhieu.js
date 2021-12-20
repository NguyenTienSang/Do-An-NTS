import axios from 'axios';
import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import {Icon, Button} from 'react-native-elements';
import NumericInput from 'react-native-numeric-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../components/Header';
import moment from 'moment';
import PhieuNhapItem from '../phieunhap/PhieuNhapItem';
import PhieuXuatItem from '../phieuxuat/PhieuXuatItem';
import {APITKPNV} from '../api/API';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ThongKeNhanVienLapPhieu({navigation, route}) {
  // const [date, setDate] = useState(moment());
  const [datefrom, setDateFrom] = useState(moment());
  const [dateto, setDateTo] = useState(moment());
  const [showfrom, setShowFrom] = useState(false);
  const [showto, setShowTo] = useState(false);
  let [manv, setMaNV] = useState('');
  const [billstatistic, setBillStatistic] = useState([]);
  const [option, setOption] = useState('PhieuNhap');

  useEffect(() => {
    setBillStatistic([]);
  }, [manv, option]);

  if (route.params !== undefined) {
    console.log('route.params.nhanvien : ', route.params.nhanvien._id);
    // setMaNV(route.params.nhanvien._id);
    manv = route.params.nhanvien._id;
  }

  const StatisticBill = async () => {
    console.log('manv : ', manv);
    console.log('startDateFilter : ', datefrom);
    console.log('endDateFilter : ', dateto);
    console.log('optionbill : ', option);
    console.log('APITKPNV : ', APITKPNV);

    const res = await axios.post(`${APITKPNV}`, {
      manv: manv,
      startDateFilter: datefrom,
      endDateFilter: dateto,
      optionbill: option,
    });
    // console.log('Test');
    // console.log('Thống kê : ', res.data);
    setBillStatistic(res.data);
  };

  //Set ngày lập
  const onDateChangeFrom = (event, selectedDate) => {
    // console.log('typedate : ', typedate);
    console.log('eventfrom : ', event);
    console.log('selectedDateFrom : ', selectedDate);
    const currentDate = selectedDate || datefrom;
    setShowFrom(false);
    setDateFrom(moment(currentDate));
    console.log('currentDateFrom : ', currentDate);
    // setImportBill({...importbill, ngay: moment(currentDate)});
  };

  const onDateChangeTo = (event, selectedDate) => {
    console.log('eventto : ', event);
    console.log('selectedDateTo : ', selectedDate);
    const currentDate = selectedDate || dateto;
    setShowTo(false);
    setDateTo(moment(currentDate));
    console.log('currentDateTo : ', currentDate);
  };

  return (
    <View style={{flex: 1}}>
      <Header title="Trở về" type="arrow-left" navigation={navigation} />
      <ScrollView>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 60,
          }}>
          <Text style={{fontSize: 20, fontWeight: '600'}}>
            Thống Kê Phiếu {option === 'PhieuNhap' ? 'Nhập' : 'Xuất'}{' '}
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
          <Text>Bắt đầu : </Text>
          {showfrom && (
            <DateTimePicker
              value={new Date(datefrom)}
              mode="date"
              minimumDate={new Date(moment().subtract(30, 'd'))}
              maximumDate={new Date(moment())}
              onChange={onDateChangeFrom}
            />
          )}
          <TextInput
            editable={false}
            style={[
              styles.textInput,
              {width: 100, textAlign: 'center', marginRight: 20},
            ]}>
            {datefrom.format('DD/MM/YYYY')}
          </TextInput>

          <Button
            buttonStyle={styles.buttonAction}
            title="Chọn ngày"
            onPress={() => setShowFrom(true)}
          />
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
          <Text>Kết thúc : </Text>
          {showto && (
            <DateTimePicker
              value={new Date(dateto)}
              mode="date"
              minimumDate={new Date(moment().subtract(30, 'd'))}
              maximumDate={new Date(moment())}
              onChange={onDateChangeTo}
            />
          )}

          <TextInput
            editable={false}
            style={[
              styles.textInput,
              {width: 100, textAlign: 'center', marginRight: 20},
            ]}>
            {dateto.format('DD/MM/YYYY')}
          </TextInput>
          <Button
            buttonStyle={styles.buttonAction}
            title="Chọn ngày"
            onPress={() => setShowTo(true)}
          />
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
          <Text>ID Nhân Viên: </Text>
          <TextInput
            style={styles.textInput}
            editable={false}
            placeholder="ID"
            value={manv}
          />
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
          <Button
            title="Chọn Nhân Viên"
            buttonStyle={[styles.buttonAction, {width: 200}]}
            onPress={() => {
              navigation.navigate('DanhSachNhanVien');
            }}
          />
        </View>

        <View style={styles.rowInput}>
          <Text>Loại Phiếu</Text>
          <Picker
            style={styles.pickerDropdown}
            selectedValue={option}
            onValueChange={itemValue => setOption(itemValue)}>
            <Picker.Item value="PhieuNhap" label="Phiếu Nhập" />
            <Picker.Item value="PhieuXuat" label="Phiếu Xuất" />
          </Picker>
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
          <Button
            buttonStyle={styles.buttonAction}
            title="Thống Kê"
            onPress={StatisticBill}
          />
        </View>

        <View style={styles.listPrice}>
          {
            //   importbills?.filter(phieunhap=>{
            //     if(search == "")
            //     {
            //         return phieunhap;
            //     }
            //     else if(phieunhap._id.toLowerCase().includes(search.toLowerCase()))
            //     {
            //         return phieunhap;
            //     }
            // })?

            billstatistic.length ? (
              billstatistic?.map((phieu, index) =>
                option === 'PhieuNhap' ? (
                  <PhieuNhapItem
                    key={phieu._id}
                    phieunhap={phieu}
                    stt={index}></PhieuNhapItem>
                ) : (
                  <PhieuXuatItem
                    key={phieu._id}
                    phieuxuat={phieu}
                    stt={index}></PhieuXuatItem>
                ),
              )
            ) : (
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  textAlign: 'center',
                  marginBottom: 20,
                }}>
                <Text style={{fontSize: 20}}>Không có phiếu</Text>
              </View>
            )
          }
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  buttonAction: {
    width: 120,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#1b94ff',
  },
  pickerDropdown: {
    width: 230,
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
  itemfield: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    borderTopWidth: 1,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    borderStyle: 'solid',
    borderColor: '#e5e5e5',
    height: 25,
    color: '#fff',
  },
  label: {
    width: 85,
    //   backgroundColor:"#999",
    paddingLeft: 7,
    color: '#fff',
  },
  content: {
    color: '#fff',
  },
});
