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

import Header from '../../components/Header';
import DatePicker from 'react-native-datepicker';
import {Icon, Button} from 'react-native-elements';
import NumericInput from 'react-native-numeric-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {APIChangePass} from '../../api/API';
import {APIResetPassword} from '../../api/API';

export default function ForgotPassword({navigation, route}) {
  const [resetPassword, setResetPassword] = useState({
    username: '',
    email: '',
    sodienthoai: '',
    cmnd: '',
  });

  const ResetPassword = async () => {
    await axios
      .post(`${APIResetPassword}`, {
        ...resetPassword,
      })
      .then(res => {
        Alert.alert('Thông báo', res.data.message);

        setResetPassword({
          ...resetPassword,
          username: '',
          email: '',
          sodienthoai: '',
          cmnd: '',
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
        <Text style={{fontSize: 25, fontWeight: 'normal'}}>Quên mật khẩu</Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <Text style={{fontSize: 20, textAlign: 'center', marginBottom: 15}}>
          Username
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập username"
          value={resetPassword.username}
          onChangeText={text =>
            setResetPassword({...resetPassword, username: text})
          }
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
          Email
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập Email"
          value={resetPassword.email}
          onChangeText={text =>
            setResetPassword({...resetPassword, email: text})
          }
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
          Số điện thoại
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập số điện thoại"
          keyboardType="numeric"
          value={resetPassword.sodienthoai}
          onChangeText={text =>
            setResetPassword({...resetPassword, sodienthoai: text})
          }
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
          Cmnd
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập cmnd"
          keyboardType="numeric"
          value={resetPassword.cmnd}
          onChangeText={text =>
            setResetPassword({...resetPassword, cmnd: text})
          }
        />
      </View>

      <View style={styles.groupButtonAction}>
        <Button
          buttonStyle={styles.buttonAction}
          title="Gửi mail"
          onPress={async () => {
            await ResetPassword();
          }}
        />

        <Button
          buttonStyle={styles.buttonAction}
          title="Thoát"
          onPress={() => {
            navigation.goBack();
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
