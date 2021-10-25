import React, {useState,useEffect} from 'react';

import {View, Text, ScrollView , StyleSheet,Dimensions,Image,Alert,TextInput} from 'react-native';
// import BangGia from './BangGia';
import {Button} from 'react-native-elements';
import { VatTu } from '../global/Data';
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../components/Header';
import { APIVattu } from '../api/API';
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
const SCREEN_WIDTH = Dimensions.get('window').width;  

export default function ListMaterial({navigation}){

    const [dsvttonkho, setDSVTTonKho] = useState([]);
    const [loading, setLoading] = useState();
    const [search,setSearch] = useState('');
    const [textInputFocussed, setTeInputFocussed] = useState(false);

    const Format = (number) => {
        return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.') + " VND"
    }

    const Delete = async (id) => {
        const token = await AsyncStorage.getItem("token");
        await fetch(`${APIVattu}/${id}`,{
            method:"DELETE",
            headers: {
                'Content-Type': 'application/json',
                  Authorization :'Bearer '+token
                }
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
                          navigation.replace("ListMaterial");
      
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
                         console.log('Xóa thất bại');
      
                        } }
                      ],
                      );
                }
              } catch (e) {
                Alert.alert('Thông báo',data.message);
              }
       })
    }    
  
    const Infor = async ()=>{
        const token = await AsyncStorage.getItem("token");
    await fetch(`${APIVattu}`,{
      headers:new Headers({
        Authorization:"Bearer "+token
      })
      }).then(res=>res.json())
      .then(vt=>{
        setDSVTTonKho(vt.vattu);
      }
      )
     }
  useEffect(async ()=>{
   
    if(dsvttonkho.length == 0)
    {
        await Infor();
        setLoading("");
    } 
    
  },[loading])
  console.log('data : ',dsvttonkho);
  if(dsvttonkho.length > 0)
  {
    return(
        <View style={{flex:1}}>
            <View style={styles.header}>
            <View style={{marginLeft: 20}}>
                <Icon
                type="material-community"
                name="arrow-left"
                color='white'
                size={28}
                onPress={()=>{navigation.navigate("HomeScreen")}}
                />
            </View>
            <View>
                <Text style={styles.headerText}>Trở về</Text>
            </View>
            </View>

                     <View style={{
            flex:1, alignItems:'center', justifyContent:'center',
        }}>
                <Text style={styles.title} >Danh Sách Vật Tư</Text>
                
                <View style={styles.optionsSelect}>
                        <Button 
                        title="Thêm"
                         buttonStyle={styles.buttonOption}
                         onPress={()=>{
                            navigation.navigate("AddPriceMaterial")
                        }}
                             />
                </View>

                <View style={styles.TextInput2}>
            <TextInput
                style={{width: '80%'}}
                placeholder="Nhập tên vật tư"
                onChangeText={(text) =>  setSearch(text)}

                onFocus={() => {
                setTeInputFocussed(false);
                }}
                onBlur={() => {
                setTeInputFocussed(true);
                }}
            />

          <Animatable.View
            animation={textInputFocussed ? '' : 'fadeInLeft'}
            duration={400}>
            <Icon
              name="search"
              iconStyle={{color: "#86939e"}}
              type="fontisto"
              style={{marginRight: 100}}
              onPress={() => console.log('hello')}
            />
          </Animatable.View>
        </View>  
               

                <ScrollView style={{ paddingLeft:5,paddingRight:5}}>
                <View style={styles.listPrice}>
                    {
                        dsvttonkho.filter(item=>{
                            if(search == "") 
                            {
                                return item;
                            }
                            else if(item.tenvt.toLowerCase().includes(search.toLowerCase()))
                            {
                                return item;
                            }
                        }).map(item=>(
                            <View key={item._id}>
                                    <View style={{borderWidth:1,borderStyle:'solid',borderColor:'#ff8c52',borderRadius:5,marginBottom:20}}>
                                        <View style={{display:'flex',flex:1, flexDirection:'row'}}>
                                            <Image 
                                            style={styles.image}
                                            source={{uri: item.images}}/>
                                            <View style={{display:'flex',flexDirection:'column',marginTop:14,marginBottom:14}}>
                                                    <Button 
                                                    title="Cập nhật"
                                                    buttonStyle={[styles.buttonOption,{marginBottom:40}]}
                                                    onPress={()=>{
                                                        navigation.navigate('EditMaterial',{id : item._id,tenvt : item.tenvt,soluong : (item.soluong).toString(),
                                                            gianhap : (item.gianhap).toString(),giaxuat : (item.giaxuat).toString(),
                                                            donvi: item.donvi, images: item.images})
                                                        }}
                                                        />


                                        <Button 
                                                    title="Xóa"
                                                    buttonStyle={styles.buttonOption}
                                                    onPress={()=>{
                                                        Delete(item._id);
                                                            }}
                                                    />
                                            </View>
                                        </View>
                                        <View style={styles.thonTinSP}>
                                           <View>
                                                <Text style={{color:'#000',marginLeft:'auto',marginRight:'auto'}}>Tên: {item.tenvt}</Text>
                                           </View>
                                            <View>
                                                <Text style={{color:'#000',marginLeft:'auto',marginRight:'auto'}}>SL Tồn: {item.soluong}/{item.donvi}</Text>
                                           </View>
                                       </View>
                                       <View style={styles.thonTinSP}>
                                           <View>
                                                 <View style={{display:'flex',flexDirection:'row',color:'#000',marginLeft:'auto',marginRight:'auto'}}>
                                                       <View style={{display:'flex',flexDirection:'row',marginRight:20}}>
                                                        <Text>Giá Nhập : {Format(item.gianhap)}</Text>
                                                            <Text>/</Text>
                                                            <Text>{item.donvi}</Text>
                                                       </View>
                                                        <View style={{display:'flex',flexDirection:'row',marginRight:20}}>
                                                                <Text>Giá Xuất : {Format(item.giaxuat)}</Text>
                                                                <Text>/</Text>
                                                                <Text>{item.donvi}</Text>
                                                         </View>
                                                </View>
                                           </View>
                                       </View>
                                    </View>   
                            </View>
                        ))
                    }
                </View>
                </ScrollView>
        </View>
    
        </View>
    )
  }
  if(loading == '')
  {
      if(dsvttonkho.length == 0)
      {
          return (
              <View>
                 <Text style={{marginTop:350,marginLeft:'auto',marginRight:'auto'}}>Danh sách vật tư trống</Text>
              </View>
          )
      }
  }
  if(loading === undefined)
  {
      if(dsvttonkho.length == 0)
      {
          return (
              <View>
                  <Text style={{marginTop:350,marginLeft:'auto',marginRight:'auto'}}>Đang load dữ liệu</Text>
              </View>
          )
      }
  }
}

const styles = StyleSheet.create({
    TextInput1: {
        borderWidth: 1,
        borderColor: '#86939e',
        marginHorizontal: 20,
        borderRadius: 12,
        marginBottom: 20,
        paddingLeft: 15,
      },
      TextInput2: {
        borderWidth: 1,
        borderRadius: 12,
        marginHorizontal: 20,
        borderColor: '#86939e',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom:15
      },
    header: {
        flexDirection: 'row',
        backgroundColor: '#ff8c52',
        height: 40,
      },
      headerText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 30,
      },
    title: {
        fontSize:30,
        fontWeight: '400',
        paddingTop:10,
        paddingBottom:10,
    },
    optionsSelect:{
        display: 'flex',
        justifyContent:'space-evenly',
        flexDirection:'row',
        paddingBottom:15
    },
    listPrice: {
        width: SCREEN_WIDTH,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: "row",
    },
    image:{
        height:150,
        width:260,
        borderRadius: 5,
        marginLeft:5,
        marginRight:3,
        marginTop:5,
        marginBottom:5
    },
    thonTinSP: {
        display: 'flex',
        flexDirection:'row',
        justifyContent:'space-around',
        marginBottom: 10,
    },
    giaSP:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        textAlign: 'center',
        alignItems:'center',
        color: 'red'
    },
    buttonOption:{
        width: 100,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#ff8c52',
        marginRight:5,
        marginLeft:5
    },
})