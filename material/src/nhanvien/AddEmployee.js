import axios from "axios";
import React, { useContext, useState, useEffect  } from "react";
import {Picker} from "@react-native-picker/picker";

import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Image,
    TextInput,
    ScrollView,
    Alert,
    TouchableOpacity,
    } from 'react-native';

import { GlobalState } from "../GlobalState";    
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import CheckBox from '@react-native-community/checkbox';
import { APIThemNhanVien } from '../api/API';
import { APIUpload } from "../api/API";
import { APIDestroy } from "../api/API";
import Header from '../components/Header';


const initialEmployee = {
    hoten:"",
    madaily:"",
    diachi:"",
    username:"",
    password:"",
    role:"admin",
    sodienthoai:"",
    cmnd:"",
    tinhtrang:"Đang làm",
    images: {
        public_id: "",
        url: "https://icon-library.com/images/default-user-icon/default-user-icon-3.jpg"
    }
  };

export default function AddEmployee({navigation,route}){
    
    const state = useContext(GlobalState);
    const [employee, setEmployee] = useState(initialEmployee);
    const [employees] = state.employeeAPI.employees;
    const [callback, setCallback] = state.employeeAPI.callback;
    const [images, setImages] = useState(false);
    const [token] = state.token;

    // const [iddl,setIDDL] = useState('');
    // const [hoten,setHoTen] = useState('');
    // var [madl,setMaDL] = useState('');
    // const [diachi,setDiaChi] = useState('');
    // const [username,setUserName] = useState('');
    // const [password, setPassword] = useState('');
    // const [sdt,setSDT] = useState('');
    // const [cmnd, setCMND] = useState('');
    // const [role, setRole] = useState('admin');
    // const [imageShow, setImageShow] = useState('https://icon-library.com/images/default-user-icon/default-user-icon-3.jpg');
    // const [imageData, setImageData] = useState('https://icon-library.com/images/default-user-icon/default-user-icon-3.jpg');
    const [toggleAdmin, setToggleAdmin] = useState(true);
    const [toggleUser, setToggleUser] = useState(false);
    // var iddl = '';

    // AsyncStorage.getItem('kt').then(kt => {
    //     if(kt == 1)
    //     {
    //         setMaDL(route.params.id);
    //       setLoading(loading+1);
    //       AsyncStorage.setItem('kt','0');
    //     }
    //   })

// console.log('route.params.daily : ',route.params.daily)
    //Kiểm tra nếu có truyền vào param thì gắn mã đại lý
    if(route.params !== undefined)
    {
        employee.madaily = route.params.daily._id;
        console.log('route.params.daily._id : ',route.params.daily._id)
    }
    const ThemNhanVien = async ()=>{

        axios.post(
            `${APIThemNhanVien}`,
            { ...employee },
            {
              headers: { Authorization: token },
            }
          ).then((res) => {

            Alert.alert(
                    'Thông báo',
                    res.data.message,
                [
                { text: "OK", onPress: () => {
                    setCallback(!callback);
                navigation.replace("NhanVien");
                } }
                ],
                );     

         
          }).catch(error => {
            Alert.alert('Thông báo',error.response.data.message);
          })
         


    }

  
    const openGallery = async () => {
        const options = {
        storageOptions: {
        path: 'images',
        mediaType: 'photo',
        },
        includeBase64: true,
        };
        
        launchImageLibrary(options, response => {
        console.log('Response = ', response);
        if (response.didCancel) {
        console.log('User cancelled image picker');
        } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        } else {
        
        // console.log('data response.assets : ',response.assets[0]);    

        const uri = response.assets[0].uri;
        const type = response.assets[0].type;
        const size = response.assets[0].fileSize;
        const name = response.assets[0].fileName;
        const source = {uri,type,size,name};
        console.log('source',source);
            handleUpload(source);
        }
        });
        };


        //---------------------------------------//

        const handleUpload = async (file) => {
            const token = await AsyncStorage.getItem("token");
            console.log('token : ',token);
            console.log('file data : ',file);

            try {
                // if (!isAdmin) return alert("Bạn không phải là Admin");
                // const file = e.target.files[0];
          
                if (!file) return alert("File không tồn tài");
          
                if (file.size > 1024 * 1024)
                  return alert("Size quá lớn");//1mb
          
                if (file.type !== "image/jpeg" && file.type !== "image/png")
                  return alert("Định dạng file không đúng");
          
                let formData = new FormData();
                formData.append("file", file);
                console.log('data file : ',file)
                // setLoading(true);
                console.log('-------------- test --------------');

                const res = await axios.post(`${APIUpload}`, formData, {
                  headers: {
                    "content-type": "multipart/form-data",
                    Authorization: token,
                  },
                });
                // setLoading(false);
                console.log('dữ liệu ảnh : ',res.data);
                console.log('dữ liệu ảnh url : ',res.data.url);

                // setImageShow(res.data.url);
                // setImageData(res.data)

                setEmployee({...employee,images : res.data})
              } catch (err) {
                alert(err.response.data.message);
              }
        }


       
    return(
        <View style={{flex:1}}>
            <Header title="Trở về" type="arrow-left"navigation={navigation} />
            <ScrollView>
                <Text style={{display:'flex',marginTop:20,marginBottom:20,marginLeft:'auto',marginRight:'auto',fontSize:20,fontWeight:'300',}}>Thêm Nhân Viên</Text>
                <View style={{display:'flex',justifyContent:'flex-end'}}>

                    <View style={styles.rowInput}>
                        <Text>Họ tên   </Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Họ tên"
                             value={employee.hoten}
                             onChangeText={(text) =>  setEmployee({...employee,hoten : text})}
                        />
                    </View>

                    <View style={styles.rowInput}>
                        <Text>Đại lý</Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Tên đại lý"
                             value={route.params === undefined ? '' : route.params.daily.tendl}
                             editable={false}
                            //  onChangeText={(text) =>  setEmployee({...employee,madaily : text})}
                        />
                    </View>

                    <View style={{marginLeft:'auto',marginRight:'auto',marginBottom:30}}>
                        <Button buttonStyle={styles.buttonAction} title="Chọn đại lý"
                                onPress={() => {
                                    navigation.navigate("DanhSachDaiLy",{page: 'AddEmployee'})
                                    }}
                            />
                    </View>

                    <View style={styles.rowInput}>
                        <Text>Địa chỉ   </Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Địa chỉ"
                             value={employee.diachi}
                             onChangeText={(text) =>  setEmployee({...employee,diachi : text})}
                        />
                    </View>

                  
                    <View style={styles.rowInput}>
                        <Text>Username</Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Username"
                             value={employee.username}
                             onChangeText={(text) =>  setEmployee({...employee,username : text})}
                        />
                    </View>

                    <View style={styles.rowInput}>
                        <Text>Mật khẩu   </Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Mật khẩu"
                             value={employee.password}
                             secureTextEntry={true}
                             onChangeText={(text) =>  setEmployee({...employee,password : text})}
                        />
                    </View>


                  
                    <View style={styles.rowInput}>
                        <Text>SĐT           </Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Số điện thoại"
                             value={employee.sodienthoai}
                             maxLength={10}
                             keyboardType = 'numeric'
                             onChangeText={(text) =>  setEmployee({...employee,sodienthoai : text})}
                        />
                    </View>

                    <View style={styles.rowInput}>
                        <Text>CMND        </Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Chứng minh nhân dân"
                             value={employee.cmnd}
                             maxLength={9}
                             keyboardType = 'numeric'
                             onChangeText={(text) =>  setEmployee({...employee,cmnd : text})}
                        />
                    </View>

                    <View style={styles.rowInput}>
                        <Text>Quyền   </Text>
                        <Text>Admin</Text>
                        <CheckBox
                            disabled={false}
                            value={toggleAdmin}
                            onValueChange={() => 
                                {
                                    if(toggleAdmin == true)
                                    {
                                        setToggleAdmin(false);
                                        setToggleUser(true);
                                        // setRole('user')
                                        setEmployee({...employee,role : 'user'})
                                    }
                                    else if(toggleAdmin == false)
                                    {
                                        setToggleAdmin(true);
                                        setToggleUser(false);
                                        setEmployee({...employee,role : 'admin'})
                                    }
                                
                                }
                            }
                        />
                        <Text>User</Text>
                        <CheckBox
                            disabled={false}
                            value={toggleUser}
                            onValueChange={() => 
                                {
                                    if(toggleUser == true)
                                    {
                                        setToggleAdmin(true);
                                        setToggleUser(false);
                                        setEmployee({...employee,role : 'admin'})
                                    }
                                    else if(toggleUser == false)
                                    {
                                        setToggleAdmin(false);
                                        setToggleUser(true);
                                        setEmployee({...employee,role : 'user'})
                                    }
                                }
                            }
                        />
                    </View>

                {/* <View style={styles.rowInput}>
                    <Text>Tình trạng</Text>
                    <Picker
                            style={styles.pickerDropdown}
                            selectedValue={employee.tinhtrang}
                            onValueChange={(itemValue) => setEmployee({...employee,tinhtrang: itemValue})}
                        >
                                <Picker.Item label="Đang làm" value="Đang làm"/>
                                <Picker.Item label="Chuyển công tác" value="Chuyển công tác"/>
                                <Picker.Item label="Nghỉ việc" value="Nghỉ việc"/>
                                
                        </Picker>         
                </View> */}
               

                    <View>
                            <Button title="Thêm Ảnh" buttonStyle={styles.buttonAddPicutre} 
                                    onPress={() => {
                                        openGallery();
                                        }}
                            
                            />
                    </View>


                <View style={{width:300, height:240,display:'flex',justifyContent:'center',textAlign:'center',alignItems:'center',marginLeft:'auto',marginRight:'auto',marginTop:40,marginBottom:40, borderWidth:1, borderStyle:'solid',borderColor:'#333'}}>
                                <Image
                                    source={{uri:employee.images.url}}
                                        style={{
                                            width:300, 
                                            height:240,
                                            display:'flex',
                                            justifyContent:'center',
                                            textAlign:'center',
                                            alignItems:'center',
                                            marginLeft:'auto',
                                            marginRight:'auto',
                                            marginTop:40, 
                                            marginBottom:40, 
                                        }}
                                />         
                    </View>
                </View>

                <View style={styles.groupButtonAction}>
                    <Button buttonStyle={styles.buttonAction} title="Thêm"
                            onPress={() => {
                                ThemNhanVien();
                                }}
                    />

                    <Button buttonStyle={styles.buttonAction} title="Hủy"
                         onPress={()=>{
                            navigation.navigate("NhanVien")
                        }}
                    />
                </View>
        </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    rowInput: {
        display: 'flex',
        justifyContent:'space-evenly',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom:20,
    },  
    textInput: {
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#999',
        borderRadius:8,
        width:240,
        height:40,
        paddingLeft:10
    },
    groupButtonAction: {
        display:'flex',
        justifyContent:'space-evenly',
        flexDirection:'row',
        marginBottom:20
    },
    buttonAction: {
        width: 120,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#1b94ff',
    },
    buttonAddPicutre: {
        width: 120,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#1b94ff',
        marginRight:'auto',
        marginLeft:'auto'
    },
    pickerDropdown: {
        width:230,
        height:50,
        borderWidth:1,
        borderStyle:'solid',
        borderRadius:8,
        borderColor:'#000',
        backgroundColor:'#dbdbdb',
        color:'#000'
    }
})