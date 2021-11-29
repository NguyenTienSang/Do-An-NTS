import axios from "axios";
import React, { useContext, useState, useEffect  } from "react";
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

import {GlobalState} from "../GlobalState";    
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary} from 'react-native-image-picker';
import CheckBox from '@react-native-community/checkbox';
import { APINhanVien } from '../api/API';
import { APIUpload } from '../api/API';


export default function EditEmployee({navigation,route}){

    const state = useContext(GlobalState);
    const [token] = state.token;

    const [callback, setCallback] = state.employeeAPI.callback;
    const [toggleRole, setToggleRole] = useState(false);

    const [loading, setLoading] = useState(0);

    const [employee, setEmployee] = useState({
        _id: route.params.nhanvien._id,
        hoten: route.params.nhanvien.hoten,
        madaily: route.params.nhanvien.madaily._id,
        diachi: route.params.nhanvien.diachi,
        username: route.params.nhanvien.username,
        password: route.params.nhanvien.password,
        role: route.params.nhanvien.role,
        sodienthoai: route.params.nhanvien.sodienthoai,
        cmnd: route.params.nhanvien.cmnd,
        tinhtrang: route.params.nhanvien.tinhtrang,
        images: route.params.nhanvien.images,
    })

    if(route.params.nhanvien.role === 'admin')
    {
        // setToggleRole(true);
        toggleRole = true;
    }


    if(route.params.daily !== undefined)
    {
        // setEmployee({...employee,madaily: route.params.daily._id})
        employee.madaily = route.params.daily._id;
    }


    

    // useEffect(async ()=>{
    // if(route.params.role == 'admin')
    // {
    //     setToggleAdmin(true);
    // }
    // else if(route.params.role == 'user')
    // {
    //     setToggleUser(true);
    // }
    //   },[])

    //   AsyncStorage.getItem('kt').then(kt => {
    //       console.log('load 1');
    //     if(kt == 1)
    //     {
    //         madaily = route.params.madl;
    //         setMaDL(madaily);
    //       AsyncStorage.setItem('kt','0');
            
    //     }
    //   })
    

  
    const SuaNhanVien = async ()=>{
        // const token = await AsyncStorage.getItem("token");
        // console.log('id  nè : ',route.params.id);
        console.log('token : ',token);
        console.log('employee : ',employee);


        axios.put(
            `${APINhanVien}/${employee._id}`,
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
        <View>
            <ScrollView>
                <Text style={{display:'flex',marginTop:20,marginBottom:20,marginLeft:'auto',marginRight:'auto',fontSize:20,fontWeight:'300',}}>Sửa Thông Tin Nhân Viên</Text>
                <View style={{display:'flex',justifyContent:'flex-end'}}>
                   

                    <View style={styles.rowInput}>
                        <Text>Họ tên   </Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Họ tên"
                             value={employee.hoten}
                            //  onChangeText={(text) =>  setHoTen(text)
                                onChangeText={(text) =>  setEmployee({...employee,hoten : text})}
                        />
                    </View>

                    <View style={styles.rowInput}>
                        <Text>Đại lý</Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Tên đại lý"
                             value={route.params.daily === undefined ?  route.params.nhanvien.madaily.tendl : route.params.daily.tendl}
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
                             value={employee.diachi}
                            //  onChangeText={(text) =>  setDiaChi(text)}
                             onChangeText={(text) =>  setEmployee({...employee,diachi : text})}
                        />
                    </View>

                    <View style={styles.rowInput}>
                        <Text>SĐT   </Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Số điện thoại"
                             value={employee.sodienthoai}
                            //  onChangeText={(text) =>  setSDT(text)}
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
                            //  onChangeText={(text) =>  setCMND(text)}
                             onChangeText={(text) =>  setEmployee({...employee,cmnd : text})}
                             
                        />
                    </View>                   
                  
                    <View style={styles.rowInput}>
                        <Text>Quyền   </Text>
                        <Text>Admin</Text>
                        <CheckBox
                            disabled={false}
                            value={toggleRole}
                            onValueChange={() => 
                                {
                                    if(employee.role === 'admin')
                                    {
                                        setEmployee({...employee,role : 'user'})
                                        setToggleRole(false);
                                        // setToggleAdmin(false);
                                        // setToggleUser(true);
                                        // setRole('user')
                                    }
                                    else if(employee.role === 'user')
                                    {
                                        setEmployee({...employee,role : 'admin'})
                                        setToggleRole(true);
                                        // setToggleAdmin(true);
                                        // setToggleUser(false);
                                        // setRole('admin')
                                    }
                                
                                }
                            }
                        />
                        <Text>User</Text>
                        <CheckBox
                            disabled={false}
                            value={!toggleRole}
                            onValueChange={() => 
                                {
                                    if(employee.role === 'admin')
                                    {
                                        setEmployee({...employee,role : 'user'})
                                        setToggleRole(false);
                                        // setToggleAdmin(false);
                                        // setToggleUser(true);
                                        // setRole('user')
                                    }
                                    else if(employee.role === 'user')
                                    {
                                        setEmployee({...employee,role : 'admin'})
                                        setToggleRole(true);
                                        // setToggleAdmin(true);
                                        // setToggleUser(false);
                                        // setRole('admin')
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
        backgroundColor: '#1b94ff',
    },
    buttonAddPicture: {
        width: 120,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#1b94ff',
        marginRight:'auto',
        marginLeft:'auto'
    },
})