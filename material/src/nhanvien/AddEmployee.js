import React, {useState} from 'react';

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

import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import CheckBox from '@react-native-community/checkbox';
import { APIThemNhanVien } from '../api/API';
import Header from '../components/Header';

export default function AddEmployee({navigation,route}){
    
    const [iddl,setIDDL] = useState('');
    const [hoten,setHoTen] = useState('');
    var [madl,setMaDL] = useState('');
    const [diachi,setDiaChi] = useState('');
    const [username,setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [sdt,setSDT] = useState('');
    const [cmnd, setCMND] = useState('');
    const [role, setRole] = useState('admin');
    const [imageShow, setImageShow] = useState('https://icon-library.com/images/default-user-icon/default-user-icon-3.jpg');
    const [imageData, setImageData] = useState('https://icon-library.com/images/default-user-icon/default-user-icon-3.jpg');
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

    if(route.params !== undefined)
    {
        madl = route.params.id;
    }
    const ThemNhanVien = async ()=>{
        const token = await AsyncStorage.getItem("token");
       fetch(`${APIThemNhanVien}`,{
         method:"POST",
         headers: {
        'Content-Type': 'application/json',
          Authorization :'Bearer '+token
        },
        body:JSON.stringify({
            "hoten":hoten,
            "madaily":madl,
            "diachi":diachi,
            "username":username,
            "password":password,
            "sodienthoai": sdt,
            "cmnd":cmnd,
            "tinhtrang": true,
            "role":role,
            "images":imageData
        })
       })
       .then(res=>res.json())
       .then(async (data)=>{
              try {
                if(data.success)
                {
                  Alert.alert(
                      'Thông báo',
                      data.message,
                      [
                        { text: "OK", onPress: () => {
                          navigation.replace("NhanVien");
      
                        } }
                      ],
                      );
                }
                else if(!data.success)
                {
                  Alert.alert(
                      'Thông báo',
                      data.message,
                      [
                        { text: "OK", onPress: () => {
                         console.log(data.message);
                        } }
                      ],
                      );
                }
              } catch (e) {
                Alert.alert('Thông báo',data.message);
              }
       })
    }

  
        const openGallery = () => {
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
        // You can also display the image using data:
        const uri = response.assets[0].uri ;
        const type = response.assets[0].type;
        const name = response.assets[0].fileName;
        const source = {uri,type,name};
            handleUpload(source);
        }
        });
        };


        const handleUpload = (photo) => {
            const data = new FormData()
            data.append('file',photo);
            data.append('upload_preset','material');
            data.append("cloud_name","ntsit1999")
            
            fetch("https://api.cloudinary.com/v1_1/ntsit1999/image/upload", {
                method: "POST",
                body: data,
                headers:{
                    'Accept' : 'application/json',
                    'Content-Type':'multipart/form-data'
                }
            }).then(res => res.json())
            .then(data => {
                // setimageUriGallary(photo.uri);
                setImageShow(photo.uri);
                setImageData(data.secure_url)
                console.log('Cloud : ',data.secure_url);
            }).catch(err => {
                Alert.alert("Lỗi trong khi upload")
            })
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
                             value={hoten}
                             onChangeText={(text) =>  setHoTen(text)}
                        />
                    </View>

                    <View style={styles.rowInput}>
                        <Text>Mã đại lý</Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Mã đại lý"
                             value={madl}
                             editable={false}
                            //  onChangeText={(text) =>  setMaDL(text)}
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
                             value={diachi}
                             onChangeText={(text) =>  setDiaChi(text)}
                        />
                    </View>

                  
                    <View style={styles.rowInput}>
                        <Text>Username</Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Username"
                             value={username}
                             onChangeText={(text) =>  setUserName(text)}
                        />
                    </View>

                    <View style={styles.rowInput}>
                        <Text>Mật khẩu   </Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Mật khẩu"
                             value={password}
                             secureTextEntry={true}
                             onChangeText={(text) =>  setPassword(text)}
                        />
                    </View>

                    <View style={styles.rowInput}>
                        <Text>SĐT           </Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Số điện thoại"
                             value={sdt}
                             maxLength={10}
                             keyboardType = 'numeric'
                             onChangeText={(text) =>  setSDT(text)}
                        />
                    </View>

                    <View style={styles.rowInput}>
                        <Text>CMND        </Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Chứng minh nhân dân"
                             value={cmnd}
                             maxLength={9}
                             keyboardType = 'numeric'
                             onChangeText={(text) =>  setCMND(text)}
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
                                        setRole('user')
                                    }
                                    else if(toggleAdmin == false)
                                    {
                                        setToggleAdmin(true);
                                        setToggleUser(false);
                                        setRole('admin')
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
                                        setRole('admin')
                                    }
                                    else if(toggleUser == false)
                                    {
                                        setToggleAdmin(false);
                                        setToggleUser(true);
                                        setRole('user')
                                    }
                                }
                            }
                        />
                    </View>

           

                    <View>
                            <Button title="Thêm Ảnh" buttonStyle={styles.buttonAddPicutre} 
                                    onPress={() => {
                                        openGallery();
                                        }}
                            
                            />
                    </View>


                <View style={{width:300, height:240,display:'flex',justifyContent:'center',textAlign:'center',alignItems:'center',marginLeft:'auto',marginRight:'auto',marginTop:40,marginBottom:40, borderWidth:1, borderStyle:'solid',borderColor:'#333'}}>
                                <Image
                                    source={{uri:imageShow}}
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
        marginBottom:20
    },  
    textInput: {
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'#333',
        width:220,
        height:40
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
        backgroundColor: '#ff8c52',
    },
    buttonAddPicutre: {
        width: 120,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#ff8c52',
        marginRight:'auto',
        marginLeft:'auto'
    },
})