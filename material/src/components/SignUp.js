import React, {useState, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, Text, StyleSheet, Dimensions, TextInput, KeyboardAvoidingView} from 'react-native';
import {colors, parameters} from '../../global/styles';
import * as Animatable from 'react-native-animatable';

import {Icon, Button} from 'react-native-elements';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-community/async-storage';
// import { DSNhapVien } from '../../global/Data';


export default function SignUpScreen(
  {onSubmit,
  onChangeText,
  form,
  errors,
  navigation}) 
  {
  const {navigate} = useNavigation();
  const [isSecureEntry, setIsSecureEntry] = useState(true);  
  const [textInput2Focussed, setTeInput2Focussed] = useState(false);
  const [manv, setMaNV] = useState('');
  const [hoten, setHoTen] = useState('');
  const [madl, setMaDL] = useState('');
  const [diachi, setDiaChi] = useState('');
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [images, setImages] = useState('');

  const sendCred = async ()=>{
    fetch("https://material-manage.herokuapp.com/signup",{
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        "manv":manv,
        "hoten":hoten,
        "madl":madl,
        "diachi":diachi,
        "username":username,
        "password":password,
        "role":role,
        "images":images
      })
    })
    .then(res=>res.json())
    .then(async (data)=>{
          try{
            await AsyncStorage.setItem("token",data.token)
            console.log("Thành công----------------------------------");
            navigation.navigate("SignInScreen");
          } catch(e){
            alert("Lỗi rồi");
            // navigation.navigate("SignInScreen");
            // console.log("error hai",e);
          }
    })
  }

  return (
    <KeyboardAvoidingView behavior="position">
        <View style={styles.container}>
      <Header title="MY ACCOUNT" type="arrow-left"
      navigation={navigation} />

      <View>
        <Text style={[styles.text1,{display:'flex',marginTop:20,marginLeft:'auto',marginRight:'auto',fontSize:25,fontWeight:'500'}]}>Đăng Ký</Text>
      </View>

     

      <View style={{marginTop: 20}}>
        <View>
          <TextInput
            style={styles.TextInput1}
            placeholder="Mã NV"
            value={manv}
            onChangeText={(text) =>  setMaNV(text)}
          />
        </View>
        <View>
          <TextInput
            style={styles.TextInput1}
            placeholder="Họ tên"
            value={hoten}
            onChangeText={(text) =>  setHoTen(text)}
          />
        </View>
        <View>
          <TextInput
            style={styles.TextInput1}
            placeholder="Mã đại lý"
            value={madl}
            onChangeText={(text) =>  setMaDL(text)}
          />
        </View>
        <View>
          <TextInput
            style={styles.TextInput1}
            placeholder="Địa chỉ"
            value={diachi}
            onChangeText={(text) =>  setDiaChi(text)}
          />
        </View>
        <View>
          <TextInput
            style={styles.TextInput1}
            placeholder="Username"
            // value={username}
            // onChangeText={(text) =>  setUserName(text)}

            onChangeText={(value) =>{
              onchange({name: 'username',value});
            }}
            error={errors.username}
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
            value={password}
            secureTextEntry={true}
            onChangeText={(text) =>  setPassword(text)}

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
              style={{marginRight: 10}}
            />
          </Animatable.View>
        </View>

        <View>
          <TextInput
            style={styles.TextInput1}
            placeholder="Quyền"
            value={role}
            onChangeText={(text) =>  setRole(text)}
          />
        </View>  

        <View>
          <TextInput
            style={styles.TextInput1}
            placeholder="Ảnh"
            value={images}
            onChangeText={(text) =>  setImages(text)}
          />
        </View>   

      </View>

      <View style={{marginHorizontal:20, marginTop:30}}>
            <Button
                title="ĐĂNG KÝ"
                buttonStyle={parameters.styledButton}
                titleStyle={parameters.buttonTitle}
                onPress={()=> 
                  sendCred()}>
            </Button>
      </View>

      <View style={{alignItems:"center", marginTop:15}}>
            <Text style={{...styles.text1, textDecorationLine:"underline"}}>Quên mật khẩu?</Text>
      </View>

      <View style={{alignItems:"center", marginTop:30, marginBottom:30}}>
            <Text style={{fontSize:20, fontWeight:"bold"}}>Hoặc</Text>
      </View>  

    

      <View>
        <Button 
        title="Đăng Nhập"
        buttonStyle={styles.createButton}
        titleStyle={styles.createButtonTitle}
        onPress={()=>{
          navigation.navigate("SignInSceen")
      }}>
        </Button>
      </View>
    </View>
    </KeyboardAvoidingView>
    
 );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  createButton: {
    backgroundColor: "white",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ff8c52",
    height: 40,
    paddingHorizontal: 20,
    marginTop: 50,
    marginLeft: 'auto',
    marginRight: 'auto'
  },

  createButtonTitle: {
    color: "#ff8c52",
    fontSize: 16,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    marginTop:-3
  }
});
