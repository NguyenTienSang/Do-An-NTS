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

import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary} from 'react-native-image-picker';
import { GlobalState } from "../GlobalState";
import { APIVattu } from '../api/API';
import { APIUpload } from "../api/API";

export default function EditMaterial({navigation,route}){
    console.log('route.params.vattu : ',route.params.vattu);
    const state = useContext(GlobalState);
    const [token] = state.token;
    const [callback, setCallback] = state.materialAPI.callback;
    const [material, setMaterial] = useState({
        _id: route.params.vattu._id,
        tenvt: route.params.vattu.tenvt,
        donvi: route.params.vattu.donvi,
        soluong: route.params.vattu.soluong,
        gianhap: route.params.vattu.gianhap,
        giaxuat: route.params.vattu.giaxuat,
        trangthai:route.params.vattu.trangthai,
        images: route.params.vattu.images,
    });


    const Format = (number) => {
        return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.') + " VND"
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

                setMaterial({...material,images : res.data})
              } catch (err) {
                alert(err.response.data.message);
              }
        }   
   
        const SuaVatTu = async ()=>{
            axios.put(
             `${APIVattu}/${material._id}`,
             { ...material },
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
                     navigation.replace("ListMaterial");
                 } }
                 ],
                 );     
 
          
           }).catch(error => {
             Alert.alert('Thông báo',error.response.data.message);
           })
     }


    return(
        <View>
            <ScrollView>
                <Text style={{display:'flex',marginTop:20,marginBottom:20,marginLeft:'auto',marginRight:'auto',fontSize:20,fontWeight:'300',}}>Sửa Thông Tin Vật Tư</Text>
                <View style={{display:'flex',justifyContent:'flex-end'}}>

                    <View style={styles.rowInput}>
                        <Text>Tên vật tư</Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Tên vật tư"
                             value={material.tenvt}
                            //  onChangeText={(text) =>  setTenVT(text)}
                            onChangeText={(text) =>  setMaterial({...material,tenvt: text})}
                        />
                    </View>

              

                    <View style={styles.rowInput}>
                        <Text>Số lượng</Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Số lượng"
                             value={material.soluong.toString()}
                             editable={false}
                             keyboardType = 'numeric'
                            //  onChangeText={(text) =>  setSoLuong(text)}
                             onChangeText={(text) =>  setMaterial({...material,soluong: text})}
                        />
                    </View>

                    <Text>Giá nhập : {material.gianhap}</Text>
                    <View style={styles.rowInput}>
                        <Text>Giá nhập</Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Giá nhập"
                             value={material.gianhap.toString()}
                             keyboardType = 'numeric'
                            //  onChangeText={(text) =>  setGiaNhap(text)}
                             onChangeText={(text) =>  setMaterial({...material,gianhap: text})}
                        />
                    </View>

                    <View style={styles.rowInput}>
                        <Text>Giá xuất</Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Giá xuất"
                             value={material.giaxuat.toString()}
                             keyboardType = 'numeric'
                             onChangeText={(text) =>  setMaterial({...material,giaxuat: text})}
                        />
                    </View>

                    <View style={styles.rowInput}>
                        <Text>Đơn vị tính       </Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Đơn vị tính"
                             value={material.donvi}
                             onChangeText={(text) =>  setDonVi(text)}
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
                                    source={{uri:material.images.url}}
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
                                SuaVatTu();
                                }}
                       
                    />

                        

                    <Button buttonStyle={styles.buttonAction} title="Hủy"
                         onPress={()=>{
                            navigation.navigate("ListMaterial")
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