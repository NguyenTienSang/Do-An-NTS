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
  Dimensions,
  Alert,
  Button
  } from 'react-native';

import { GlobalState } from "../GlobalState";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import { APICTPN } from '../api/API';
import { APICTPX } from '../api/API';

const SCREEN_WIDTH = Dimensions.get('window').width;  




export default function SoLuongTonKho({navigation,route}){
    const [dsvttonkho, setDSVTTonKho] = useState([]);
    const [loading, setLoading] = useState();
    const state = useContext(GlobalState);
    // const [token] = state.token;
    const [materialsfilter,setMaterialsFilter] = useState(null);


    const Format = (number) => {
        return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.') + " VND"
    }
// Truyền vô id kho
// Thống kê trong một kho
// thống kê số lượng tồn trong kho
// Duyệt chi tiết phiếu nhập, phiếu xuất
// Trong phiếu có mã kho -> nếu phieu.makho = idkho 


// const dsvttonkho = [
// ];


// dsvttonkho.push(new product('vt1', 'Thùng giấy',50))

// console.log('Danh sách vật tư tồn kho : ',dsvttonkho)

// duyệt chi tiết phiếu 
 




useEffect(async ()=>{
  console.log('loading 1 : ',loading);
    if(dsvttonkho.length == 0)
    {
        await ThongKeSoLuongTon();
        setLoading("");
        console.log('loading 2 : ',loading);
    } 
  },[loading])

  useEffect(async ()=>{

    const res = await axios.post('http://192.168.1.5:5000/api/thongke/vattu',
              //  [JSON.parse(localStorage.getItem('inforuser')).madaily._id,exportbill.makho]
              {madailyfilter : "allstores",makhofilter: route.params.makho}
        );
        console.log('Dữ liệu thống kê : ',res.data)
    
        setMaterialsFilter(res.data);
        
  },[])


  return(
    <View style={{flex:1}}>
        <Header title="Trở về" type="arrow-left" navigation={navigation} />
                 <View style={{
        flex:1, alignItems:'center', justifyContent:'center',
    }}>
            <Text style={styles.title} >Danh Sách Vật Tư Tồn Kho</Text>
            

            <ScrollView style={{ paddingLeft:5,paddingRight:5}}>
            <View style={styles.listPrice}>
                {
                    materialsfilter?.map(item=>(
                        <View key={item._id}>
                                <View style={{borderWidth:1,borderStyle:'solid',borderColor:'#999',borderRadius:5,marginBottom:20}}>
                                    <View style={{display:'flex',flex:1, flexDirection:'row'}}>
                                        <Image 
                                        style={styles.image}
                                        source={{uri: item.images.url}}/>
                                    </View>
                                    <View style={styles.thonTinSP}>
                                       <View>
                                            <Text style={{color:'#000',marginLeft:'auto',marginRight:'auto'}}>Tên: {item.tenvt}</Text>
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


// if(dsvttonkho.length > 0)
// {
//     console.log('Hi2');
 
// if(loading === undefined)
// {
//     if(dsvttonkho.length == 0)
//     {
//         return (
//             <View>
//                 <Text style={{marginTop:350,marginLeft:'auto',marginRight:'auto'}}>Đang load dữ liệu</Text>
//             </View>
//         )
//     }
// }
// if(loading == '')
// {
//     if(dsvttonkho.length == 0)
//     {
//         return (
//             <View style={{flex:1}}>
//             <Header title="Trở về" type="arrow-left" navigation={navigation} />
//                <Text style={{marginTop:300,marginLeft:'auto',marginRight:'auto',fontSize:25}}>Kho chưa có vật tư</Text>
//             </View>
//         )
//     }
// }
// }


const styles = StyleSheet.create({
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
        height:170,
        width:340,
        borderRadius: 5,
        marginLeft:20,
        marginRight:22,
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
        backgroundColor: '#1b94ff',
        marginRight:5,
        marginLeft:5
    },
})