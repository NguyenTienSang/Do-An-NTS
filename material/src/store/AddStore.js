import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
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

import { GlobalState } from '../GlobalState';    
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import { APIDaiLy } from '../api/API';
import { APIUpload } from "../api/API";
import Header from '../components/Header';

export default function AddStore({navigation}){

    const state = useContext(GlobalState);
   
    const [madl,setMaDL] = useState('');
    const [tendl,setTenDL] = useState('');
    const [diachi,setDiaChi] = useState('');
    const [sodienthoai,setSDT] = useState('');
    const [imageShow, setImageShow] = useState('');
    const [imageData, setImageData] = useState('');
    const [token] = state.token;

    const [store, setStore] = useState({
        tendl: "",
        diachi: "",
        sodienthoai: ""
    });


    const ThemDaiLy = async ()=>{

        // const token = await AsyncStorage.getItem("token");
        // console.log('Data store : ',{ ...store,images: imageData });
        // console.log('token : ',token);
     

        axios.post(
            "http://192.168.1.5:5000/api/daily",
            {...store,images: imageData},
            {
              headers: { Authorization: token },
            }
          ).then(res => {
              console.log('res : ',res)
            //   Alert.alert('Thông báo',res.data.message);
               Alert.alert(
                    'Thông báo',
                    res.data.message,
                    [
                        { text: "OK", onPress: () => {
                        navigation.replace("DaiLy");
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

                const res = await axios.post("http://192.168.1.5:5000/api/upload", formData, {
                  headers: {
                    "content-type": "multipart/form-data",
                    Authorization: token,
                  },
                });
                // setLoading(false);
                console.log('dữ liệu ảnh : ',res.data);
                console.log('dữ liệu ảnh url : ',res.data.url);

                setImageShow(res.data.url);
                setImageData(res.data)
              } catch (err) {
                alert(err.response.data.message);
              }
        }

    return(
        <View style={{flex:1}}>
                <Header title="Trở về" type="arrow-left"navigation={navigation} />
                <ScrollView>
        <View>
                <Text style={{display:'flex',marginTop:20,marginBottom:20,marginLeft:'auto',marginRight:'auto',fontSize:20,fontWeight:'300',}}>Thêm đại lý</Text>
                <View style={{display:'flex',justifyContent:'flex-end'}}>

                    <View style={styles.rowInput}>
                        <Text style={styles.label}>Tên đại lý</Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Tên đại lý"
                             value={store.tendl}
                            //  onChangeText={(text) =>  setTenDL(text)}


                            //  const [store, setStore] = useState({
                            //     tendl: "",
                            //     diachi: "",
                            //     sodienthoai: "",
                            //     imageData: "",
                            // });

                             onChangeText={(text) => setStore({...store,tendl : text})}
                        />
                    </View>

                    <View style={styles.rowInput}>
                        <Text style={styles.label}>Địa chỉ</Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Địa chỉ"
                             value={store.diachi}
                            //  onChangeText={(text) =>  setDiaChi(text)}
                            onChangeText={(text) => setStore({...store,diachi : text})}
                        />
                    </View>

                    <View style={styles.rowInput}>
                        <Text style={styles.label}>SĐT</Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Số điện thoại"
                             value={store.sodienthoai}
                             maxLength={10}
                             keyboardType = 'numeric'
                            //  onChangeText={(text) =>  setSDT(text)}

                            onChangeText={(text) => setStore({...store,sodienthoai : text})}

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
                                 ThemDaiLy();
                                }}
                    />

                        

                    <Button buttonStyle={styles.buttonAction} title="Hủy"
                         onPress={()=>{
                            navigation.navigate("DaiLy")
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
    label: {
        display:'flex',
        alignItems:'center',
        width: 60
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
        flexDirection:'row'
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