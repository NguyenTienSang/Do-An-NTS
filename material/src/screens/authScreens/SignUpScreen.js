import React,{useState} from 'react';
import { Button ,TextInput} from 'react-native-paper';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupScreen = (props) => {

  const [manv,setMaNV] = useState('');
  const [hoten,setHoTen] = useState('');
  const [madl,setMaDL] = useState('');
  const [diachi,setDiaChi] = useState('');
  const [username,setUserName] = useState('');
  const [password,setPassword]=useState('')
  const [role,setRole]=useState('')
  const [images,setImages]=useState('')

  const sendCred= async ()=>{
      console.log("manv : ",manv);
      console.log("hoten : ",hoten);
      console.log("madl : ",madl);
      console.log("diachi : ",diachi);
      console.log("username : ",username);
      console.log("password : ",password);
      console.log("role : ",role);
      console.log("images : ",images);
     fetch("https://material-manage.herokuapp.com/api/auth/register",{
       method:"POST",
       headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        "manv":manv,
        "hoten":hoten,
        "madl":'611e7931e5b90b181409477a',
        "diachi":diachi,
        "username":username,
        "password":password,
        "role":role,
        "images":images
      })
     })
     .then(res=>res.json())
     .then(async (data)=>{
            try {
              // console.log("Thành công");
              // props.navigation.replace("SignInScreen")
              Alert.alert('Thông báo',data.message);
            } catch (e) {
              Alert.alert('Thông báo',data.message);
            }
     })
  }
  return (
   <> 
   <ScrollView>
   {/* <KeyboardAvoidingView behavior="position"> */}
     <StatusBar backgroundColor="blue" barStyle="light-content" />
      <Text 
      style={{fontSize:35,marginLeft:18,marginTop:10,color:"#3b3b3b"}}>welcome to</Text>
      <Text 
      style={{fontSize:30,marginLeft:18,color:"blue"}}
      >Coders Never Quit</Text>
      <View
      style={{
        borderBottomColor:"blue",
        borderBottomWidth:4,
        borderRadius:10,
        marginLeft:20,
        marginRight:150,
        marginTop:4
      }}
       />
      <Text
      style={{
        fontSize:20,marginLeft:18,marginTop:20
      }}
      >Thêm nhân viên</Text>

      <TextInput
        label='Mã NV'
        mode="outlined"
        value={manv}
        style={{marginLeft:18,marginRight:18,marginTop:18}}
        theme={{colors:{primary:"blue"}}}
        onChangeText={(text)=>setMaNV(text)}
      />

    <TextInput
        label='Họ tên'
        mode="outlined"
        value={hoten}
        style={{marginLeft:18,marginRight:18,marginTop:18}}
        theme={{colors:{primary:"blue"}}}
        onChangeText={(text)=>setHoTen(text)}
      />
      <TextInput
        label='Mã ĐL'
        mode="outlined"
        value={madl}
        style={{marginLeft:18,marginRight:18,marginTop:18}}
        theme={{colors:{primary:"blue"}}}
        onChangeText={(text)=>setMaDL(text)}
      />

    <TextInput
        label='Địa chỉ'
        mode="outlined"
        value={diachi}
        style={{marginLeft:18,marginRight:18,marginTop:18}}
        theme={{colors:{primary:"blue"}}}
        onChangeText={(text)=>setDiaChi(text)}
      />

    <TextInput
        label='Username'
        mode="outlined"
        value={username}
        style={{marginLeft:18,marginRight:18,marginTop:18}}
        theme={{colors:{primary:"blue"}}}
        onChangeText={(text)=>setUserName(text)}
      />

      <TextInput
        label='Mật khẩu'
        mode="outlined"
        value={password}
        style={{marginLeft:18,marginRight:18,marginTop:18}}
        theme={{colors:{primary:"blue"}}}
        onChangeText={(text)=>setPassword(text)}
      />

      <TextInput
        label='Quyền'
        mode="outlined"
        value={role}
        style={{marginLeft:18,marginRight:18,marginTop:18}}
        theme={{colors:{primary:"blue"}}}
        onChangeText={(text)=>setRole(text)}
      />

      <TextInput
        label='Ảnh'
        mode="outlined"
        value={images}
        style={{marginLeft:18,marginRight:18,marginTop:18}}
        theme={{colors:{primary:"blue"}}}
        onChangeText={(text)=>setImages(text)}
      />

      <Button 
        mode="contained"
        style={{marginLeft:18,marginRight:18,marginTop:18}}
       onPress={() => sendCred()}>
        signup
      </Button>
      <TouchableOpacity>
        <Text
      style={{
        fontSize:18,marginLeft:18,marginTop:20
      }}
      onPress={()=>
        props.navigation.replace("SignInScreen")}
      >already have a account ?</Text>
      </TouchableOpacity>
      
      {/* </KeyboardAvoidingView> */}
      </ScrollView>
   </>
  );
};



export default SignupScreen;