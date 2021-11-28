import React, {useState} from 'react';

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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import { APIKho } from '../api/API';
import Header from '../components/Header';

export default function AddStore({navigation,route}){
    const [iddl,setIDDL] = useState('');
    var [madl,setMaDL] = useState('');
    const [tenkho,setTenKho] = useState('');
    const [diachi,setDiaChi] = useState('');
    const [sodienthoai,setSDT] = useState('');
    const [imageShow, setImageShow] = useState('');
    const [imageData, setImageData] = useState('');
  
    if(route.params !== undefined)
    {
        madl = route.params.id;
    }


    const ThemKho = async ()=>{
        const token = await AsyncStorage.getItem("token");
       fetch(`${APIKho}`,{
         method:"POST",
         headers: {
        'Content-Type': 'application/json',
          Authorization :'Bearer '+token
        },
        body:JSON.stringify({
          "tenkho":tenkho,
          "madaily":madl,
          "diachi":diachi,
          "sodienthoai":sodienthoai,
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
                          navigation.replace("Kho");
      
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
        
        const uri = response.assets[0].uri ;
        const type = response.assets[0].type;
        const name = response.assets[0].fileName;
        const source = {uri,type,name};
        // console.log('source',source);
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
                setImageShow(photo.uri);
                setImageData(data.secure_url)
            }).catch(err => {
                Alert.alert("Lỗi trong khi upload")
            })
        }

    return(
        <View style={{flex:1}}>
             <Header title="Trở về" type="arrow-left"navigation={navigation} />
             <ScrollView>
        <View>
                <Text style={{display:'flex',marginTop:20,marginBottom:20,marginLeft:'auto',marginRight:'auto',fontSize:20,fontWeight:'300',}}>Thêm Kho</Text>
                <View style={{display:'flex',justifyContent:'flex-end'}}>
                   

                    <View style={styles.rowInput}>
                        <Text>Tên kho</Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Tên kho"
                             value={tenkho}
                             onChangeText={(text) =>  setTenKho(text)}
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
                                    navigation.navigate("DanhSachDaiLy",{page: 'AddKho'})
                                    }}
                            />
                    </View>


                    <View style={styles.rowInput}>
                        <Text>Địa chỉ</Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Địa chỉ"
                             value={diachi}
                             onChangeText={(text) =>  setDiaChi(text)}
                        />
                    </View>
                   
                    <View style={styles.rowInput}>
                        <Text>SĐT     </Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Số điện thoại"
                             value={sodienthoai}
                             maxLength={10}
                             keyboardType = 'numeric'
                             onChangeText={(text) =>  setSDT(text)}
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
                                ThemKho();
                                }}
                    />

                    <Button buttonStyle={styles.buttonAction} title="Hủy"
                         onPress={()=>{
                            navigation.navigate("Kho")
                        }}
                    />
                </View>
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
})