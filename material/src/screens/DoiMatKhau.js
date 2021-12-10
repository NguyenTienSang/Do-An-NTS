import React, {useState, useEffect} from 'react';
import axios from 'axios';
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
  Alert,
} from 'react-native';

import Header from '../components/Header';
import DatePicker from 'react-native-datepicker';
import {Icon, Button} from 'react-native-elements';
import NumericInput from 'react-native-numeric-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APIChangePass} from '../api/API';
const argon2 = require('argon2');

export default function DoiMatKhau({navigation, route}) {
  const [iddl, setIDDL] = useState('');
  const [hoten, setHoTen] = useState(route.params.nhanvien.hoten);
  const [madl, setMaDL] = useState(route.params.nhanvien.madaily);
  const [diachi, setDiaChi] = useState(route.params.nhanvien.diachi);
  const [username, setUserName] = useState(route.params.nhanvien.username);
  const [role, setRole] = useState(route.params.nhanvien.role);
  const [imageData, setImageData] = useState(route.params.nhanvien.images);

  const [password, setPassword] = useState({
    oldpassword: '',
    newpassword: '',
    renewpassword: '',
  });

  const DoiMatKhau = async () => {
    let manv = '';

    await AsyncStorage.getItem('inforuser').then(async dataUser => {
      manv = JSON.parse(dataUser)._id;
      console.log('manv : ', manv);
      // console.log('JSON.parse(dataUser)._id : ', JSON.parse(dataUser)._id);
      // console.log(
      //   'typeof(JSON.parse(dataUser)._id) : ',
      //   typeof JSON.parse(dataUser)._id,
      // );
    });
    console.log('manv2 : ', manv);
    await axios
      .put(`http://192.168.1.5:5000/api/auth/changepassword/${manv}`, {
        ...password,
      })
      .then(res => {
        Alert.alert('Thông báo', res.data.message);

        setPassword({
          ...password,
          oldpassword: '',
          newpassword: '',
          renewpassword: '',
        });
      })
      .catch(error => {
        Alert.alert('Thông báo', error.response.data.message);
      });
  };

  return (
    <View style={styles.container}>
      <Header title="Trở về" type="arrow-left" navigation={navigation} />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: 30,
          marginTop: 20,
        }}>
        <Text style={{fontSize: 25, fontWeight: 'normal'}}>Đổi Mật Khẩu</Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <Text style={{fontSize: 20, textAlign: 'center', marginBottom: 15}}>
          Mật khẩu hiện tại
        </Text>
        <TextInput
          style={styles.textInput}
          secureTextEntry={true}
          placeholder="Mật khẩu hiện tại"
          value={password.oldpassword}
          onChangeText={text => setPassword({...password, oldpassword: text})}
        />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <Text style={{fontSize: 20, textAlign: 'center', marginBottom: 15}}>
          Mật khẩu mới
        </Text>
        <TextInput
          style={styles.textInput}
          secureTextEntry={true}
          placeholder="Mật khẩu mới"
          value={password.newpassword}
          onChangeText={text => setPassword({...password, newpassword: text})}
        />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 30,
        }}>
        <Text style={{fontSize: 20, textAlign: 'center', marginBottom: 15}}>
          Nhập lại mật khẩu mới
        </Text>
        <TextInput
          style={styles.textInput}
          secureTextEntry={true}
          placeholder="Nhập lại mật khẩu mới"
          value={password.renewpassword}
          onChangeText={text => setPassword({...password, renewpassword: text})}
        />
      </View>

      <View style={styles.groupButtonAction}>
        <Button
          buttonStyle={styles.buttonAction}
          title="Thay đổi"
          onPress={async () => {
            await DoiMatKhau();
          }}
        />

        <Button
          buttonStyle={styles.buttonAction}
          title="Hủy"
          onPress={() => {
            navigation.navigate('HomeScreen');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowInput: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  textInput: {
    display: 'flex',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#333',
    borderRadius: 8,
    width: 300,
    height: 50,
  },
  groupButtonAction: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  buttonAction: {
    width: 150,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#1b94ff',
  },
});
