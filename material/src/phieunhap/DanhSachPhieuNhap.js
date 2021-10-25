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
  Dimensions,
  Alert,
  } from 'react-native';
import DatePicker from 'react-native-datepicker'
import {Icon,Button} from 'react-native-elements';
import NumericInput from 'react-native-numeric-input'
import PhieuNhap from './../screens/PhieuNhap';
import { DSPhieuNhap } from '../global/Data';
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../components/Header';
import { APIPN } from '../api/API';
import * as Animatable from 'react-native-animatable';
const SCREEN_WIDTH = Dimensions.get('window').width;  

export default function DanhSachPhieuNhap({navigation}){



    const [data, setData] = useState([]);
    const [loading, setLoading] = useState();
    const [search,setSearch] = useState('');
    const [textInputFocussed, setTeInputFocussed] = useState(false);

        const Infor = async ()=>{
        const token = await AsyncStorage.getItem("token");
        await fetch(`${APIPN}`,{
        headers:new Headers({
          Authorization:"Bearer "+token
        })
        }).then(res=>res.json())
        .then(pn=>{
          AsyncStorage.getItem('nhanvien').then((nhanvien)=>{
             const thongtinnv = JSON.parse(nhanvien);
            
              if(thongtinnv.role == 'admin')
                {
                  //  navigation.navigate("DanhSachPhieuNhap")
                   setData(pn.phieunhap);
                }
                else if(thongtinnv.role == 'user')
                {
                  var datapn = [];
                  for(var i = 0 ;i<pn.phieunhap.length; i++)
                  {
                    // console.log('px : ',pn.phieunhap[i]);
                      if(pn.phieunhap[i].manv.madaily == thongtinnv.madaily._id)
                      {
                          console.log('push pn');
                          datapn.push(pn.phieunhap[i]);
                      }
                  }
                
                    setData(datapn);
                }
          })
            
        }
        )
      }

      useEffect(async ()=>{
      if(data.length == 0)
      {
        await Infor();
        setLoading("");
      } 
      },[loading])


      if(data.length > 0)
      {
        return(
          <View style={{flex:1}}>
                  <Header title="Trở về" type="arrow-left"
                    navigation={navigation} />
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Text style={styles.title} >Danh Sách Phiếu Nhập</Text>
            <View style={styles.optionsSelect}>
                    <Button 
                    title="Thêm"
                     buttonStyle={styles.buttonOption}
                     onPress={()=>{
                        navigation.navigate("LapPhieuNhap")
                    }}
                         />
            </View>

            <View style={styles.TextInput2}>
                    <TextInput
                        style={{width: '80%'}}
                        placeholder="Nhập tên phiếu nhập"
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
                 
                  <View style={{display:'flex',justifyContent:'space-around',alignItems:'center',flexDirection:'row',height:40,borderWidth:1,borderStyle:'solid',borderColor:'#333',paddingLeft:5,paddingRight:5}}>
                          <Text style={{flex:0.8}}>Tên Phiếu</Text>
                          <Text style={{flex:1.1,marginLeft:10}}>Ngày Lập</Text>
                          <Text style={{flex:1.1,marginLeft:15}}>Nhân Viên</Text>
                          <Text style={{flex:1.1}}>Kho</Text>
                  </View>       
                  <ScrollView>
                     <View style={styles.listPrice}>
                      {
                          data.filter(item=>{
                            if(search == "") 
                            {
                                return item;
                            }
                            // item.makho.tenkho
                             else if(item.makho.tenkho.toLowerCase().includes(search.toLowerCase()))
                            {
                                return item;
                            }
                            // else if(item.tenpn.toLowerCase().includes(search.toLowerCase()))
                            // {
                            //     return item;
                            // }
                        }).map(item=>(
                              <View key={item._id}>
                                      <View style={{display:'flex',justifyContent:'space-around',flexDirection:'column',alignItems:'center',height:100,borderLeftWidth:1,borderRightWidth:1,borderBottomWidth:1,borderStyle:'solid',borderColor:'#333',paddingTop:5,paddingBottom:5,paddingLeft:5,paddingRight:5}}>
                                         <View style={{display:'flex',flexDirection:'row'}}>
                                            <Text style={{flex:0.8,marginLeft:10}}>{item.tenpn}</Text>
                                            <Text style={{flex:1.1,marginLeft:-20}}>{(item.ngay).slice(8,10)}-{(item.ngay).slice(5,7)}-{(item.ngay).slice(0,4)}</Text>
                                            <Text style={{display:'flex',justifyContent:'center',flex:1.1,marginLeft:'auto',marginRight:'auto'}}>{item.manv.hoten}</Text>
                                            <Text style={{display:'flex',justifyContent:'center',flex:1.1,marginLeft:'auto',marginRight:'auto'}}>{item.makho.tenkho}</Text>
                                         </View>
                                         <View>
                                            <Button  
                                                  title="Chi Tiết"
                                                  buttonStyle={[styles.buttonOption]}
                                                  onPress={()=>{
                                                      navigation.navigate("ChiTietPhieuNhap",{id:item._id,tenpn:item.tenpn,ngay : item.ngay,username: item.manv.username,hoten : item.manv.hoten})
                                                  }}
                                            /> 
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
          if(data.length == 0)
          {
              return (
                  <View style={{flex:1}}>
                     <Header title="Trở về" type="arrow-left" navigation={navigation} />
                     <Text style={{marginTop:300,marginLeft:'auto',marginRight:'auto',fontSize:20}}>Đại lý này chưa có phiếu nhập</Text>
                  </View>
              )
          }
      }
      if(loading === undefined)
      {
          if(data.length == 0)
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
  image:{
    height:140,
    width:160,
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
  flex: 1,
  width: SCREEN_WIDTH,
  justifyContent: 'space-between',
},
  textInput: {
      borderWidth:1,
      borderStyle:'solid',
      borderColor:'#999',
      width:270,
      height:40
  },
  groupButtonAction: {
    display:'flex',
    justifyContent:'space-evenly',
    flexDirection:'row',
    marginTop: 30,
    marginBottom: 30,
},
buttonAction: {
    width: 120,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#ff8c52',
},
buttonOption:{
        width:90,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#ff8c52',
        marginRight:'auto',
        marginLeft:'auto'
    },
 
})