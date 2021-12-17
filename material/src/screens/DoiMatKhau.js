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

export default function DoiMatKhau({navigation, route}) {
  console.log('test đổi mật khẩu');
  console.log('navigation đổi mật khẩu : ', navigation);

  const [password, setPassword] = useState({
    oldpassword: '',
    newpassword: '',
    renewpassword: '',
  });

  const DoiMatKhau = async () => {
    await axios
      .put(`${APIChangePass}/${route.params.nhanvien._id}`, {
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
            if (route.params.nhanvien.role === 'admin') {
              console.log('quyền admin');
              navigation.navigate('HomeScreen');
            } else if (route.params.nhanvien.role === 'user') {
              console.log('quyền user');
              navigation.navigate('UserHomeScreen');
            }
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
