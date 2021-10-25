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
import AsyncStorage from '@react-native-community/async-storage';
import { launchImageLibrary} from 'react-native-image-picker';
import { APIVattu } from '../api/API';

export default function EditMaterial({navigation,route}){

    
        const [tenvt,setTenVT] = useState(route.params.tenvt);
        const [soluong,setSoLuong] = useState(route.params.soluong);
        const [gianhap,setGiaNhap] = useState(route.params.gianhap);
        const [giaxuat,setGiaXuat] = useState(route.params.giaxuat);
        const [donvi,setDonVi] = useState(route.params.donvi);
        const [imageShow, setImageShow] = useState(route.params.images);
        const [imageData, setImageData] = useState(route.params.images);
        
        const SuaVatTu = async ()=>{
            const token = await AsyncStorage.getItem("token");
           fetch(`${APIVattu}/${route.params.id}`,{
             method:"PUT",
             headers: {
            'Content-Type': 'application/json',
              Authorization :'Bearer '+token
            },
            body:JSON.stringify({
              "tenvt":tenvt,
              "soluong":parseInt(soluong),
              "gianhap":parseInt(gianhap),
              "giaxuat":parseInt(giaxuat),
              "donvi":donvi,
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
                            navigation.replace("ListMaterial");
                          } }
                        ],
                        );
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
                <Text style={{display:'flex',marginTop:20,marginBottom:20,marginLeft:'auto',marginRight:'auto',fontSize:20,fontWeight:'300',}}>Sửa Thông Tin Vật Tư</Text>
                <View style={{display:'flex',justifyContent:'flex-end'}}>

                    <View style={styles.rowInput}>
                        <Text>Tên vật tư</Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Tên vật tư"
                             value={tenvt}
                             onChangeText={(text) =>  setTenVT(text)}
                        />
                    </View>


                    <View style={styles.rowInput}>
                        <Text>Số lượng</Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Số lượng"
                             value={soluong}
                             editable={false}
                             onChangeText={(text) =>  setSoLuong(text)}
                        />
                    </View>

                    <View style={styles.rowInput}>
                        <Text>Giá nhập</Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Giá nhập"
                             value={gianhap}
                             onChangeText={(text) =>  setGiaNhap(text)}
                        />
                    </View>


                    <View style={styles.rowInput}>
                        <Text>Giá xuất</Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Giá xuất"
                             value={giaxuat}
                             onChangeText={(text) =>  setGiaXuat(text)}
                        />
                    </View>

                    <View style={styles.rowInput}>
                        <Text>Đơn vị tính       </Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Đơn vị tính"
                             value={donvi}
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