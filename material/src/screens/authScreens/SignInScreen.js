import React, {useState, useRef} from 'react';
import axios from 'axios';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import {colors, parameters} from '../../global/styles';
import * as Animatable from 'react-native-animatable';

import {Icon, Button, SocialIcon} from 'react-native-elements';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiURL} from './apiURL';
// import { DSNhapVien } from '../../global/Data';
import {APILogin} from '../../api/API';

import Swiper from 'react-native-swiper';

export default function SignInScreen({props, navigation}) {
  const [textInput2Focussed, setTeInput2Focussed] = useState(false);
  // const [username, setUserName] = useState('');
  // const [password, setPassword] = useState('');
  const [showpass, setShowPass] = useState(true);

  const [user, setUser] = useState({
    username: '',
    password: '',
  });
  [].forEach(id => {});

  const sendCred = async () => {
    try {
      const res = await axios.post(`${APILogin}`, {
        ...user,
      });

      console.log('hi nts', res.data.user);

      AsyncStorage.setItem('inforuser', JSON.stringify(res.data.user));

      AsyncStorage.setItem('firstLogin', true);

      navigation.navigate('DrawerNavigator', {role: res.data.user.role});
    } catch (error) {
      alert(error.response.data.message);
    }

    //   await fetch(`${APILogin}`,{
    //   method:"POST",
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body:JSON.stringify({
    //     "username":username,
    //     "password":password,
    //   })
    // })
    // .then(res=>res.json())
    // .then(async (data)=>{
    //       try{

    //         // await AsyncStorage.setItem('token',data.accessToken);
    //         // await AsyncStorage.setItem('username',username);
    //         // await AsyncStorage.setItem('nhanvien',JSON.stringify(data.nhanvien));
    //         navigation.navigate("DrawerNavigator",{role: data.nhanvien.role})

    //       } catch(e){
    //         Alert.alert('Thông báo',data.message);
    //       }
    // })
  };

  return (
    <View style={styles.container}>
      {/* <Header title="MY ACCOUNT" type="arrow-left"
      navigation={navigation} /> */}

      <View>
        <Text
          style={[
            styles.text1,
            {
              display: 'flex',
              marginTop: 20,
              marginLeft: 'auto',
              marginRight: 'auto',
              fontSize: 25,
              fontWeight: '700',
            },
          ]}>
          Đăng nhập
        </Text>
      </View>

      <View style={{alignItems: 'center', marginTop: 10}}>
        <Text style={styles.text1}>Vui lòng nhập tài khoản và mật khẩu</Text>
      </View>

      <View style={{marginTop: 20}}>
        <View>
          <TextInput
            style={styles.TextInput1}
            placeholder="Username"
            value={user.username}
            // onChangeText={(text) =>  setUserName(text)}

            onChangeText={text => setUser({...user, username: text})}
          />
        </View>

        <View style={styles.TextInput2}>
          <Animatable.View
            animation={textInput2Focussed ? '' : 'fadeInLeft'}
            duration={400}>
            <Icon
              name="lock"
              iconStyle={{color: colors.grey3}}
              type="material"
            />
          </Animatable.View>

          <TextInput
            style={{width: '80%'}}
            placeholder="Mật khẩu"
            // ref={textInput2}
            value={user.password}
            secureTextEntry={showpass}
            // onChangeText={(text) =>  setPassword(text)}

            onChangeText={text => setUser({...user, password: text})}
            onFocus={() => {
              setTeInput2Focussed(false);
            }}
            onBlur={() => {
              setTeInput2Focussed(true);
            }}
          />

          <Animatable.View
            animation={textInput2Focussed ? '' : 'fadeInLeft'}
            duration={400}>
            <Icon
              name="visibility-off"
              iconStyle={{color: colors.grey3}}
              type="material"
              onPress={() => {
                if (showpass) {
                  setShowPass(false);
                } else if (!showpass) {
                  setShowPass(true);
                }
              }}
              style={{marginRight: 10}}
            />
          </Animatable.View>
        </View>
      </View>

      <View style={{marginHorizontal: 20, marginTop: 30}}>
        <Button
          title="ĐĂNG NHẬP"
          buttonStyle={parameters.styledButton}
          titleStyle={parameters.buttonTitle}
          onPress={() => {
            sendCred();
          }}></Button>
      </View>

      <View style={{flex: 4, justifyContent: 'center'}}>
        <Swiper autoplay={true} loop={true}>
          <View style={styles.slide}>
            <Image
              source={{
                uri: 'https://cuahangminhlong.com/wp-content/uploads/2019/09/gia-dong-thau-phe-lieu-moi-nhat.png',
              }}
              style={{width: '100%', height: 280}}
            />
          </View>

          <View style={styles.slide}>
            <Image
              source={{
                uri: 'https://muaphelieu247.com/wp-content/uploads/2019/11/nhom-1.jpg',
              }}
              style={{width: '100%', height: 280}}
            />
          </View>

          <View style={styles.slide}>
            <Image
              source={{
                uri: 'http://ctythumuaphelieu.vn/wp-content/uploads/2021/02/thu_mua_phe_lieu_sat-1.jpg',
              }}
              style={{width: '100%', height: 280}}
            />
          </View>

          <View style={styles.slide}>
            <Image
              source={{
                uri: 'https://phelieuquangdat.com/wp-content/uploads/2019/12/Dien-tu.jpg',
              }}
              style={{width: '100%', height: 280}}
            />
          </View>
        </Swiper>
      </View>

      {/* <View>
        <Button 
        title="Đăng Ký"
        buttonStyle={styles.createButton}
        titleStyle={styles.createButtonTitle}
        onPress={()=>{
            // navigation.navigate("SignUpScreen")
           navigation.navigate("SignUpScreen")
        }} >
        </Button>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    color: colors.grey3,
    fontSize: 16,
  },
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
  },

  SocialIcon: {
    borderRadius: 12,
    height: 50,
  },

  createButton: {
    backgroundColor: 'white',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1b94ff',
    height: 40,
    paddingHorizontal: 20,
    marginTop: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  createButtonTitle: {
    color: '#1b94ff',
    fontSize: 16,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -3,
  },
});
