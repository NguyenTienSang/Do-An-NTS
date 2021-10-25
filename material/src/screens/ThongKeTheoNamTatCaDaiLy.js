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
  Button
  } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Header from '../components/Header';
import { APIVattu } from '../api/API';
import { CTPhieuNhap } from '../global/Data';
import { CTPhieuXuat } from '../global/Data';
import { APICTPX, APICTPN } from './../api/API';

export default function ThongKeTheoNamTatCaDaiLy({navigation}){
    const [year,setYear] = useState(0);
    const [loading,setLoading] = useState(0);
    const [datavattu,setDataVatTu] = useState([]);
    const [datactpn,setDataCTPN] = useState([]);
    const [datactpx,setDataCTPX] = useState([]);
    const [sothang,setSoThang] = useState([]); 
    const slnhap = [];
    const slxuat = [];
    const currentyear = new Date().getFullYear();
    var totalcost = 0;
    var thang = 0;

    const Format = (number) => {
        return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.') + " VND"
    }

    useEffect(()=>{
        for(var i =0; i< 12; i++)
        {
            sothang.push(i);
        }
        setSoThang(sothang);
      },[])
   
    const ThongKeDoanhThu = async ()=>{
        console.log('Thống kê doanh thu');
        const token = await AsyncStorage.getItem("token");
        await fetch(`${APIVattu}`,{
            headers:new Headers({
              Authorization:"Bearer "+token
            })
            }).then(res=>res.json())
            .then(vt=>{
                datavattu.push(vt.vattu);
                setDataVatTu(vt.vattu);
                console.log('Thông tin vật tư : ',datavattu[0]);    
                datavattu[0].map(itemvattu => {
                    console.log(itemvattu._id);
                    })
            }
            )



        await fetch(`${APICTPN}`,{
                headers:new Headers({
                  Authorization:"Bearer "+token
                })
                }).then(res=>res.json())
                .then(ctpn=>{
                    datactpn.push(ctpn.ctphieunhap);
                    setDataCTPN(datactpn);
                }
                )    

        await fetch(`${APICTPX}`,{
                    headers:new Headers({
                      Authorization:"Bearer "+token
                    })
                    }).then(res=>res.json())
                    .then(ctpx=>{
                        datactpx.push(ctpx.ctphieuxuat);
                        setDataCTPX(datactpx);
                    }
                    )           
                     
        if(year != 0)
        {
            setLoading(loading+1);
        }
    }


    return(
        <View style={{flex:1}}>
             <Header title="Trở về" type="arrow-left" navigation={navigation} />
              <ScrollView>
                    <View style={{display:'flex',justifyContent:'center',flexDirection:'row',alignItems:'center',height:40,marginTop:20,marginBottom:0}}>
                        <Text style={{display:'flex', fontSize:20,fontWeight: '600',marginRight:10}}>Thống kê lợi nhuận năm</Text>
                        <TextInput style={[styles.textInput]} 
                             placeholder="nhập năm"
                             value={year}
                             keyboardType="numeric"
                             onChangeText={(text) =>  setYear(text)}
                        />
                    </View>
                    <View style={{display:'flex',justifyContent:'center',flexDirection:'row',alignItems:'center',marginTop:20,marginBottom:20}}>
                                <Button buttonStyle={styles.buttonAction} title="Thống kê"
                                        onPress={ async () => {
                                                if(year > currentyear)
                                                {
                                                    alert('Thời gian lớn hơn năm hiện tại');
                                                }
                                                else {
                                                    await ThongKeDoanhThu();
                                                }
                                            }
                                        }
                                />
                    </View>
                {
                   loading > 0
                   ? 
                   <View>
                       {
                         
                            datavattu.map((itemvattu)=>(
                                <View key={itemvattu.mavt} style={{marginBottom:20}}>
                                    <View style={{display:'flex',justifyContent:'space-around',alignItems:'center',flexDirection:'row',height:40,borderTopWidth:1,borderBottomWidth:1,borderStyle:'solid',borderColor:'#333',paddingLeft:5,paddingRight:5}}>
                                       <Text>Tên VT: {itemvattu.tenvt}</Text>
                                        <Text>SL tồn: {itemvattu.soluong}  {itemvattu.donvi}</Text>
                                      
                                    </View>
                                    <View style={{display:'flex',justifyContent:'space-around',alignItems:'center',flexDirection:'row',height:40,borderBottomWidth:1,borderStyle:'solid',borderColor:'#333',paddingLeft:5,paddingRight:5}}>
                                        <Text style={{display:'flex',flex:1,justifyContent:'center',alignItems:'center',textAlign:'center',height:40,paddingTop:10}}>Giá nhập: {Format(itemvattu.gianhap)}</Text>
                                        <Text style={{display:'flex',flex:1,justifyContent:'center',alignItems:'center',textAlign:'center',borderLeftWidth:1,height:40,paddingTop:10}}>Giá xuất: {Format(itemvattu.giaxuat)}</Text>
                                    
                                    </View>
                                    <View style={{display:'flex',justifyContent:'space-around',alignItems:'center',flexDirection:'row',height:40,borderBottomWidth:1,borderStyle:'solid',borderColor:'#333',paddingLeft:5,paddingRight:5}}>
                                        <Text style={{flex:0.7}}></Text>
                                        <Text style={{display:'flex',flex:1.1,justifyContent:'center',alignItems:'center',textAlign:'center',borderLeftWidth:1,height:40,paddingTop:10}}>Số lượng nhập</Text>
                                        <Text style={{display:'flex',flex:1.1,justifyContent:'center',alignItems:'center',textAlign:'center',borderLeftWidth:1,height:40,paddingTop:10}}>Số lượng xuất</Text>
                                        <Text style={{display:'flex',flex:1.1,justifyContent:'center',alignItems:'center',textAlign:'center',borderLeftWidth:1,height:40,paddingTop:10}}>Doanh thu</Text>
                                    </View>
                                    {
                                        sothang.map((itemsothang) =>{
                                            slnhap[itemsothang] = 0;
                                            slxuat[itemsothang] = 0;
                                        })
                                    }
                                    {
                                        datactpn[0].map(itemctpn => {
                                            if((itemvattu._id == itemctpn.mavt._id) && (year == parseInt((itemctpn.mapn.ngay).slice(0,4))))
                                            {
                                                thang = parseInt((itemctpn.mapn.ngay).slice(5,7));
                                                slnhap[thang-1] = slnhap[thang-1] + itemctpn.soluong; 
                                                console.log('Số lượng nhập tháng '+thang+' : ',slnhap[thang-1]);  
                                            }
                                        })
                                    }
                                    {
                                         datactpx[0].map(itemctpx => {
                                            if((itemvattu._id == itemctpx.mavt._id) && (year == parseInt((itemctpx.mapx.ngay).slice(0,4))))
                                            {
                                                thang = parseInt((itemctpx.mapx.ngay).slice(5,7));
                                                slxuat[thang-1] = slxuat[thang-1] + itemctpx.soluong;   
                                            }
                                        })    
                                    }
                                    {
                                         sothang.map(itemsothang =>
                                             (
                                            <View style={{display:'flex',justifyContent:'space-around',alignItems:'center',flexDirection:'row',height:40,borderBottomWidth:1,borderStyle:'solid',borderColor:'#333',paddingLeft:5,paddingRight:5}}>
                                                <Text style={{flex:0.7}}>Tháng {itemsothang + 1}</Text>
                                                <Text style={{display:'flex',flex:1.1,justifyContent:'center',alignItems:'center',textAlign:'center',borderLeftWidth:1,height:40,paddingTop:10}}>{slnhap[itemsothang]}</Text>
                                                <Text style={{display:'flex',flex:1.1,justifyContent:'center',alignItems:'center',textAlign:'center',borderLeftWidth:1,height:40,paddingTop:10}}>{slxuat[itemsothang]}</Text>
                                                <Text style={{display:'flex',flex:1.1,justifyContent:'center',alignItems:'center',textAlign:'center',borderLeftWidth:1,height:40,paddingTop:10}}>{Format((slxuat[itemsothang]*itemvattu.giaxuat)-(slnhap[itemsothang]*itemvattu.gianhap))}</Text>
                                            </View>
                                         ))
                                    }
                                    {
                                        <View style={{display:'flex',justifyContent:'space-around',alignItems:'center',flexDirection:'row',height:40,borderBottomWidth:1,borderStyle:'solid',borderColor:'#333',paddingLeft:5,paddingRight:5}}>
                                            <Text style={{flex:0.7}}>Tổng doanh thu vật tư: {Format(onLoadTotal(itemvattu))}</Text>
                                        </View>
                                    }
                                </View>
                            ))
                       }
                       {
                            <View style={{display:'flex',justifyContent:'center',alignItems:'center',textAlign:'center',marginBottom:20}}>
                                <Text>Doanh thu cả năm : {Format(totalcost)}</Text>
                            </View>
                       }
                        </View>
                        : <View style={{display:'flex',justifyContent:'center',marginTop:20,marginLeft:'auto',marginRight:'auto'}}>
                            <Text style={{fontSize:20,fontWeight:'600'}}>Nhập năm và thực hiện thống kê</Text>
                        </View>
                }
            </ScrollView>
        </View>
    )
 

    function onLoadTotal(itemvattu)
    {
        var total = 0;
        sothang.map(itemsothang =>
            {
               total+= (slxuat[itemsothang]*itemvattu.giaxuat)-(slnhap[itemsothang]*itemvattu.gianhap);
            })
            totalcost += total;   
        return total;
    }


}


const styles = StyleSheet.create({
  image:{
    height:140,
    width:160,
},
  textInput: {
      display:'flex',
      justifyContent:'center',
      textAlign:'center',
      borderWidth:1,
      borderStyle:'solid',
      borderColor:'#999',
      width:80,
      height:38
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