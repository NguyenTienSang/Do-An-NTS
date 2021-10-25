import React, {useState,useEffect} from 'react';

import {View, Text, ScrollView , StyleSheet,Dimensions,Image,Alert,TextInput} from 'react-native';
// import BangGia from './BangGia';
import {Button} from 'react-native-elements';
import { GiaBan } from '../global/Data';
import Header from '../components/Header';
// import { DSNhapVien } from '../global/Data';
import EditEmployee from '../nhanvien/EditEmployee';
import AsyncStorage from '@react-native-community/async-storage';
import { APINhanVien } from '../api/API';
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
const SCREEN_WIDTH = Dimensions.get('window').width;  

export default function DSNhanVienUser({navigation}){

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState();
    var [iddl, setIDDL] = useState('');
    const [search,setSearch] = useState('');
    const [textInputFocussed, setTeInputFocussed] = useState(false);
   
  
    const Infor = async ()=>{
        // setIDDL(AsyncStorage.getItem("_iddl"));
        AsyncStorage.getItem('_iddl').then( data=>{
            iddl = JSON.parse(data)
            // console.log('Đại lý : ',iddl);
        })
       
        const token = await AsyncStorage.getItem("token");
      await fetch(`${APINhanVien}`,{
      headers:new Headers({
        Authorization:"Bearer "+token
      })
      }).then(res=>res.json())
      .then(nv=>{
        console.log('NV : ',nv);
        for(var i = 0 ;i<nv.nhanvien.length; i++)
        {
           console.log('id : ',nv.nhanvien[i].madaily._id);
            if(nv.nhanvien[i].madaily._id == iddl)
            {
                console.log('push nv');
                data.push(nv.nhanvien[i]);
            }
        }
          setData(data);
          console.log('data : ',data);
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

  console.log('Nhân Viên : ',data);
  if(data.length > 0)
  {
    
    //   console.log('DATA : '+data[0].infordl.madl);
    return(
        <View style={{flex:1}}>
                  <Header title="Trở về" type="arrow-left" navigation={navigation} />
                 <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                <Text style={styles.title} >Danh Sách Nhân Viên</Text>

                <View style={styles.TextInput2}>
                    <TextInput
                        style={{width: '80%'}}
                        placeholder="Nhập tên đại lý"
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

                <ScrollView>
                <View style={styles.listPrice}>
                    {
                        data.filter(item=>{
                            if(search == "") 
                            {
                                return item;
                            }
                            else if(item.hoten.toLowerCase().includes(search.toLowerCase()))
                            {
                                return item;
                            }
                        }).map(item=>
                            <View key={item._id}>
                                    <View>
                                       <View style={{display:'flex',flexDirection:'column',borderWidth:1,borderColor:'#ff8c52',borderRadius:5,marginLeft:3,marginRight:3,marginBottom:20,paddingTop:7,paddingBottom:7}}>
                                           <View style={styles.thongTinNV}>
                                                <Image 
                                                    style={styles.image}
                                                    source={{uri: item.images}}/>
                                                    <View>
                                                        <Text>Tên đại lý: {item.madaily.tendl}</Text>   
                                                       
                                                       <Text>Quyền: {item.role}</Text>   
                                                    </View>
                                                

                                           </View>
                                           <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:10,marginLeft:15,marginRight:15}}>
                                                <Text style={{marginLeft:15}}>Họ tên: {item.hoten}</Text>
                                                <Text>Địa chỉ:{item.diachi}</Text>
                                           </View>
                                           <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:10,marginLeft:15,marginRight:15}}>
                                                <Text style={{marginLeft:15}}>SĐT:{item.sodienthoai}</Text>
                                           </View>
                                       </View>
                                    </View> 
                            </View>
                        )
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
                 <Text style={{marginTop:350,marginLeft:'auto',marginRight:'auto'}}>Danh sách nhân viên trống</Text>
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
    thongTinNV: {
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row',
        paddingLeft:2,
        paddingRight:2
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
        // alignItems: 'center',
        // flexWrap: 'wrap',
        // flexDirection: "row",
    },
    image:{
        height:150,
        width:150,
        borderRadius: 100,
        marginRight:5
    },
    thonTinSP: {
        display: 'flex',
        flexDirection:'column',
        marginBottom: 10
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
        width: 70,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#ff8c52',
        marginRight:5,
        marginLeft:5
    },
})