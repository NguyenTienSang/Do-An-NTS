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

import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { launchImageLibrary} from 'react-native-image-picker';
import CheckBox from '@react-native-community/checkbox';
import { APINhanVien } from '../api/API';

export default function EditEmployee({navigation,route}){

    const [iddl,setIDDL] = useState('');
    const [id,setID] = useState(route.params.id);
    const [hoten,setHoTen] = useState(route.params.hoten);
    var [madaily,setMaDL] = useState(route.params.madl);
    const [diachi,setDiaChi] = useState(route.params.diachi);
    const [username,setUserName] = useState(route.params.username);
    const [password,setPassWord] = useState(route.params.password);
    const [sodienthoai,setSDT] = useState(route.params.sodienthoai);
    const [cmnd, setCMND] = useState(route.params.cmnd);
    const [role, setRole] = useState(route.params.role);
    const [imageShow, setImageShow] = useState(route.params.images);
    const [imageData, setImageData] = useState(route.params.images);
    const [toggleAdmin, setToggleAdmin] = useState(false);
    const [toggleUser, setToggleUser] = useState(false);
    const [loading, setLoading] = useState(0);

    useEffect(async ()=>{
    if(route.params.role == 'admin')
    {
        setToggleAdmin(true);
    }
    else if(route.params.role == 'user')
    {
        setToggleUser(true);
    }
      },[])

      AsyncStorage.getItem('kt').then(kt => {
          console.log('load 1');
        if(kt == 1)
        {
            madaily = route.params.madl;
            setMaDL(madaily);
          AsyncStorage.setItem('kt','0');
            
        }
      })
    

  
    const SuaNhanVien = async ()=>{
        const token = await AsyncStorage.getItem("token");
        console.log('id  nè : ',route.params.id);
        console.log('token : ',token);
       fetch(`${APINhanVien}/${id}`,{
         method:"PUT",
         headers: {
        'Content-Type': 'application/json',
          Authorization :'Bearer '+token
        },
        body:JSON.stringify({
            "hoten":hoten,
            "madaily":madaily,
            "diachi":diachi,
            "username":username,
            "password":password,
            "sodienthoai": sodienthoai,
            "cmnd":cmnd,
            "tinhtrang": true,
            "role":role,
            "images":imageData
        })
       })
       .then(res=>res.json())
       .then(async (data)=>{
              try {
                Alert.alert(
                    'Thông báo',
                    data.message,
                    [
                      { text: "OK", onPress: () => {
                        navigation.replace('NhanVien');  
                      } }
                    ],
                    );
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
        <View>
            <ScrollView>
                <Text style={{display:'flex',marginTop:20,marginBottom:20,marginLeft:'auto',marginRight:'auto',fontSize:20,fontWeight:'300',}}>Sửa Thông Tin Nhân Viên</Text>
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
                             value={madaily}
                             editable={false}
                            //  onChangeText={(text) =>  setMaDL(text)}
                        />
                    </View>

                    <View style={{marginLeft:'auto',marginRight:'auto',marginBottom:30}}>
                        <Button buttonStyle={styles.buttonAction} title="Chọn đại lý"
                                onPress={() => {
                                    navigation.navigate("DanhSachDaiLy",{page: 'EditEmployee'})
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
                        <Text>SĐT   </Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Số điện thoại"
                             value={sodienthoai}
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


                    {/* <View style={styles.rowInput}>
                        <Text>Quyền   </Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Quyền"
                             value={role}
                             onChangeText={(text) =>  setRole(text)}
                        />
                    </View> */}

                    <View>
                            <Button title="Thêm Ảnh" buttonStyle={styles.buttonAddPicture} 
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
                    <Button buttonStyle={styles.buttonAction} title="Cập nhật"
                            onPress={() => {
                                SuaNhanVien();
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
        backgroundColor: '#ff8c52',
    },
    buttonAddPicture: {
        width: 120,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#ff8c52',
        marginRight:'auto',
        marginLeft:'auto'
    },
})