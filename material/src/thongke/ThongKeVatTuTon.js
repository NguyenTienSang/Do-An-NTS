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
import {APITKVTT} from '../api/API';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ThongKeVatTuTon({navigation, route}) {
  // const state = useContext(GlobalState);
  // const [material, setMaterial] = useState(initialMaterial);
  const [daily, setDaiLy] = useState();
  const [kho, setKho] = useState();
  const [materialstatistic, setMaterialStatistic] = useState([]);
  const Format = number => {
    if (number >= 0) {
      return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.') + ' VND';
    } else
      return (
        '-' +
        String(number)
          .replace(/(.)(?=(\d{3})+$)/g, '$1.')
          .slice(2) +
        ' VND'
      );
  };



  if (route.params !== undefined) {
    console.log('route.params.daily : ', route.params.daily);
    console.log('route.params.daily_id : ', route.params.daily._id);
    if (route.params.type === 'chondaily') {
      setDaiLy(route.params.daily);
    } else if (route.params.type === 'chonkho') {
      setKho(route.params.kho);
    }
    route.params = undefined;
  }
  
  const StatisticMaterial = async () => {
    const res = await axios.post(`${APITKVTT}`, {
      madailyfilter: daily._id,
      makhofilter: kho._id,
    });
    console.log('res.data : ', res.data);
    setMaterialStatistic(res.data);
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
            Thống Kê Số Lượng Tồn
          </Text>
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
            Đại lý
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Tên đại lý"
            value={daily === undefined ? '' : daily.tendl}
            editable={false}
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
            buttonStyle={styles.buttonAction}
            title="Chọn đại lý"
            onPress={() => {
              navigation.navigate('DanhSachDaiLy', {page: 'ThongKeVatTuTon'});
            }}
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
            Kho
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Tên kho"
            value={kho === undefined ? '' : kho.tenkho}
            editable={false}
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
            buttonStyle={styles.buttonAction}
            disabled={daily === undefined ? true : false}
            title="Chọn kho"
            onPress={() => {
              navigation.navigate('DanhSachKho', {
                page: 'ThongKeVatTuTon',
                madaily: daily._id,
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
            textAlign: 'center',
            marginBottom: 20,
          }}>
          <Button
            buttonStyle={styles.buttonAction}
            title="Thống Kê"
            onPress={StatisticMaterial}
          />
        </View>

        <View style={styles.listPrice}>
          {materialstatistic?.map(item => (
            <View key={item._id}>
              <View
                style={{
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: '#999',
                  borderRadius: 5,
                  marginBottom: 20,
                }}>
                <View style={{display: 'flex', flex: 1, flexDirection: 'row'}}>
                  <Image style={styles.image} source={{uri: item.images.url}} />
                </View>
                <View style={styles.thongTinSP}>
                  <View>
                    <Text
                      style={{
                        color: '#000',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                      }}>
                      ID: {item._id}
                    </Text>
                  </View>
                </View>
                <View style={styles.thongTinSP}>
                  <View>
                    <Text
                      style={{
                        color: '#000',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                      }}>
                      Tên: {item.tenvt}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: '#000',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                      }}>
                      SL Tồn: {item.soluong} {item.donvi}
                    </Text>
                  </View>
                </View>
                <View style={styles.thongTinSP}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginRight: 20,
                    }}>
                    <Text>Giá Nhập : {Format(item.gianhap)}</Text>
                    <Text>/</Text>
                    <Text>{item.donvi}</Text>
                  </View>
                </View>
                <View style={styles.thongTinSP}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginRight: 20,
                    }}>
                    <Text>Giá Xuất : {Format(item.giaxuat)}</Text>
                    <Text>/</Text>
                    <Text>{item.donvi}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
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
  label: {
    display: 'flex',
    alignItems: 'center',
    width: 70,
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
    width: SCREEN_WIDTH,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
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
  image: {
    height: 170,
    width: 340,
    borderRadius: 5,
    marginLeft: 20,
    marginRight: 22,
    marginTop: 10,
    marginBottom: 5,
  },
  thongTinSP: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
});
