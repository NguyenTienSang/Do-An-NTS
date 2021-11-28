import React, {useState, useEffect} from 'react';
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
  Alert
  } from 'react-native';

import Header from '../components/Header';
import DatePicker from 'react-native-datepicker'
import {Icon,Button} from 'react-native-elements';
import NumericInput from 'react-native-numeric-input'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APIChangePass } from '../api/API';
const argon2 = require('argon2');

export default function DoiMatKhau({navigation,route}){

    const [iddl,setIDDL] = useState('');
    const [hoten,setHoTen] = useState(route.params.nhanvien.hoten);
    const [madl,setMaDL] = useState(route.params.nhanvien.madaily);
    const [diachi,setDiaChi] = useState(route.params.nhanvien.diachi);
    const [username,setUserName] = useState(route.params.nhanvien.username);
    const [role, setRole] = useState(route.params.nhanvien.role);
    const [imageData, setImageData] = useState(route.params.nhanvien.images);

    const [mkht,setMKHT] = useState('');
    const [mkm,setMKM] = useState('');
    const [nlmkm,setNLMKM] = useState('');


    const DoiMatKhau = async ()=>{
        const token = await AsyncStorage.getItem("token");
        console.log('id  nè : ',route.params.nhanvien._id);
        console.log('token : ',token);
        await fetch(`${APIChangePass}/${route.params.nhanvien._id}`,{
         method:"PUT",
         headers: {
        'Content-Type': 'application/json',
          Authorization :'Bearer '+token
        },
        body:JSON.stringify({
            "hoten":hoten,
            "madaily":madl,
            "diachi":diachi,
            "username":username,
            "mkht" : mkht,
            "mkm" : mkm,
            "nlmkm": nlmkm,
            "role":role,
            "images":imageData
        })
       })
       .then(res=>res.json())
       .then(async (data)=>{
              try {
                Alert.alert('Thông báo',data.message);
              } catch (e) {
                Alert.alert('Thông báo',data.message);
              }
       })
    }

  return (
    <View style={styles.container}>
    <Header title="Trở về" type="arrow-left"
    navigation={navigation} />
        <View style={{display:'flex',flexDirection:'row',marginLeft:'auto',marginRight:'auto',marginBottom:30,marginTop:20}}>
            <Text style={{fontSize:25,fontWeight:'normal'}}>Đổi Mật Khẩu</Text>
        </View>
        <View style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:20}}>
                    <Text style={{fontSize:20,textAlign:'center',marginBottom:15}}>Mật khẩu hiện tại</Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Mật khẩu hiện tại"
                             value={mkht}
                             onChangeText={(text) =>  setMKHT(text)}
                        />
        </View>
        <View style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:20}}>
                    <Text style={{fontSize:20,textAlign:'center',marginBottom:15}}>Mật khẩu mới</Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Mật khẩu mới"
                             value={mkm}
                             onChangeText={(text) =>  setMKM(text)}
                        />
        </View>
        <View style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:30}}>
                    <Text style={{fontSize:20,textAlign:'center',marginBottom:15}}>Nhập lại mật khẩu mới</Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Nhập lại mật khẩu mới"
                             value={nlmkm}
                             onChangeText={(text) =>  setNLMKM(text)}
                        />
        </View>

        <View style={styles.groupButtonAction}>
                    <Button buttonStyle={styles.buttonAction} title="Thay đổi"
                            onPress={async () => {
                               await DoiMatKhau();
                                }}
                       
                    />

                    <Button buttonStyle={styles.buttonAction} title="Hủy"
                         onPress={()=>{
                            navigation.navigate("HomeScreen")
                        }}
                    />
                </View>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
    rowInput: {
        display: 'flex',
        justifyContent:'space-evenly',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom:20
    },  
    textInput: {
        display:'flex',
        justifyContent:'center',
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#333',
        borderRadius:5,
        width:300,
        height:50
    },
    groupButtonAction: {
        display:'flex',
        justifyContent:'space-evenly',
        flexDirection:'row'
    },
    buttonAction: {
        width: 150,
        height: 50,
        borderRadius: 5,
        backgroundColor: '#1b94ff',
    }
})