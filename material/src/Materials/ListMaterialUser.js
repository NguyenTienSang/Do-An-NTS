import React, {useState,useEffect} from 'react';

import {View, Text, ScrollView , StyleSheet,Dimensions,Image,Alert,TextInput} from 'react-native';
// import BangGia from './BangGia';
import {Button} from 'react-native-elements';
import { VatTu } from '../global/Data';
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../components/Header';
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import { APIVattu } from '../api/API';
const SCREEN_WIDTH = Dimensions.get('window').width;  


export default function ListMaterialUser({navigation}){

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState();
    const [search,setSearch] = useState('');
    const [textInputFocussed, setTeInputFocussed] = useState(false);

    const Format = (number) => {
        return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.') + " VND"
    }

  
    const Infor = async ()=>{
        const token = await AsyncStorage.getItem("token");
      await fetch(`${APIVattu}`,{
      headers:new Headers({
        Authorization:"Bearer "+token
      })
      }).then(res=>res.json())
      .then(vt=>{
        //   console.log('NV : ',nv);
          setData(vt.vattu);
      }
      )
     }
  useEffect(async ()=>{
    if(data.length == 0)
    {
        await Infor();
        setLoading("")
    } 
    
  },[loading])
  console.log('data : ',data);
  if(data.length > 0)
  {
    return(
        <View style={{flex:1}}>
             <Header title="Trở về" type="arrow-left" navigation={navigation} />
                 <View style={{
            flex:1, alignItems:'center', justifyContent:'center',
        }}>
                <Text style={styles.title} >Danh Sách Vật Tư</Text>
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
                <ScrollView style={{ paddingLeft:5,paddingRight:5}}>
                <View style={styles.listPrice}>
                    {
                        data.filter(item=>{
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
                                    <View style={{borderWidth:1,borderStyle:'solid',borderColor:'#ff8c52',borderRadius:5,marginBottom:20,width:SCREEN_WIDTH*0.97}}>
                                        <View style={{display:'flex',flex:1, flexDirection:'row'}}>
                                            <Image 
                                            style={styles.image}
                                            source={{uri: item.images}}/>
                                        </View>
                                        <View style={styles.thonTinSP}>
                                            <View>
                                                <Text style={{color:'#000',marginLeft:'auto',marginRight:'auto'}}>Tên VT: {item.tenvt}</Text>
                                           </View>
                                           <View>
                                                <Text style={{color:'#000',marginLeft:'auto',marginRight:'auto'}}>SL Tồn: {item.soluong} {item.donvi}</Text>
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
      if(data.length == 0)
      {
          return (
              <View style={{flex:1}}>
                   <Header title="Trở về" type="arrow-left" navigation={navigation} />
                 <Text style={{marginTop:350,marginLeft:'auto',marginRight:'auto'}}>Danh sách vật tư trống</Text>
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
        // width: SCREEN_WIDTH,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexDirection: "row",
    },
    image:{
        height:150,
        width:350,
        borderRadius: 5,
        marginLeft:'auto',
        marginRight:'auto',
        marginTop:10,
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