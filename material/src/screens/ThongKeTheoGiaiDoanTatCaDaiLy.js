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

import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import { APIVattu } from '../api/API';
import { APICTPN } from '../api/API';
import { APICTPX } from '../api/API';

export default function ThongKeTheoGiaiDoanTatCaDaiLy({navigation}){
    var [yearbd,setYearBD] = useState(0);
    var [yearkt,setYearKT] = useState(0);
    const [loading,setLoading] = useState(0);
    const [datavattu,setDataVatTu] = useState([]);
    const [datactpn,setDataCTPN] = useState([]);
    const [datactpx,setDataCTPX] = useState([]);
    const [sonam,setSoNam] = useState([]); 
    var nam = 0;
    const slnhap = [];
    const slxuat = [];
    const currentyear = new Date().getFullYear();

    var totalcost = 0;
    const Format = (number) => {
            return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.') + " VND"
    }
    const ThongKeDoanhThu = async ()=>{
        const token = await AsyncStorage.getItem("token");
        await fetch(`${APIVattu}`,{
            headers:new Headers({
              Authorization:"Bearer "+token
            })
            }).then(res=>res.json())
            .then(vt=>{
                datavattu.push(vt.vattu);
                setDataVatTu(vt.vattu);
                // console.log('Thông tin vật tư : ',datavattu[0]);    
                // datavattu[0].map(itemvattu => {
                //     console.log(itemvattu.mavt);
                //     })
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
    }

    return(
        <View style={{flex:1}}>
            <Header title="Trở về" type="arrow-left" navigation={navigation} />
            <ScrollView>
                <View style={{marginBottom:20}}>
                    <View style={{display:'flex',justifyContent:'center',alignItems:'center',height:60}}>
                        <Text style={{ fontSize:20,fontWeight: '600'}}>Thống kê lợi nhuận từ năm </Text>
                    </View>
                    <View style={{display:'flex',justifyContent:'center',flexDirection:'row',alignItems:'center',textAlign:'center',marginBottom:20}}>
                        <TextInput style={[styles.textInput]} 
                                placeholder="năm bắt đầu"
                                value={yearbd}
                                keyboardType="numeric"
                                onChangeText={(text) =>  setYearBD(text)}
                            />
                            <Text> - </Text>
                            <TextInput style={[styles.textInput]} 
                                placeholder="năm kết thúc"
                                value={yearkt}
                                keyboardType="numeric"
                                onChangeText={(text) =>  setYearKT(text)}
                            />
                    </View>
                    <View style={{display:'flex',justifyContent:'center',flexDirection:'row',alignItems:'center',marginTop:20,marginBottom:20}}>
                                <Button buttonStyle={styles.buttonAction} title="Thống kê"
                                        onPress={ async () => {

                                            if(yearbd == '' && yearkt == '')
                                            {
                                                Alert.alert('Thông báo','Vui lòng nhập thời gian');
                                            }
                                            else if(yearbd == '')
                                            {
                                                Alert.alert('Thông báo','Vui lòng nhập thời gian bắt đầu');
                                            }
                                            else if(yearkt == '')
                                            {
                                                Alert.alert('Thông báo','Vui lòng nhập thời gian kết thúc');
                                            }
                                            else if(yearbd > yearkt)
                                            {
                                                Alert.alert('Lỗi Thời Gian','Thời gian bắt đầu phải nhỏ hơn kết thúc');
                                            }
                                            else if(yearbd > currentyear)
                                            {
                                                Alert.alert('Lỗi Thời Gian','Thời gian bắt đầu lớn hơn năm hiện tại'); 
                                            }
                                            else if(yearkt > currentyear)
                                            {
                                                Alert.alert('Lỗi Thời Gian','Thời gian kết thúc lớn hơn năm hiện tại'); 
                                            }
                                            else if(yearbd != '' && yearkt != '')
                                            {
                                                await ThongKeDoanhThu();
                                                yearbd =  parseInt(yearbd);
                                                yearkt =  parseInt(yearkt);
                                                setSoNam([])
                                                console.log('Chiều dài : ',sonam.length);
                                                for(var i =yearbd; i <= yearkt; i++)
                                                {
                                                    sonam.push(i);
                                                }
                                                setSoNam(sonam);
                                                setLoading(loading+1);
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
                                <View key={itemvattu._id} style={{marginBottom:20}}>
                                    <View style={{display:'flex',justifyContent:'space-around',alignItems:'center',flexDirection:'row',height:40,borderTopWidth:1,borderBottomWidth:1,borderStyle:'solid',borderColor:'#333',paddingLeft:5,paddingRight:5}}>
                                        <Text>Tên VT: {itemvattu.tenvt}</Text>
                                        <Text>SL tồn: {itemvattu.soluong} {itemvattu.donvi}</Text>
                                      
                                    </View>
                                    <View style={{display:'flex',justifyContent:'space-around',alignItems:'center',flexDirection:'row',height:40,borderBottomWidth:1,borderStyle:'solid',borderColor:'#333',paddingLeft:5,paddingRight:5}}>
                                        <Text style={{display:'flex',flex:1,justifyContent:'center',alignItems:'center',textAlign:'center',height:40,paddingTop:10}}>Giá nhập:  {Format(itemvattu.gianhap)}</Text>
                                        <Text style={{display:'flex',flex:1,justifyContent:'center',alignItems:'center',textAlign:'center',borderLeftWidth:1,height:40,paddingTop:10}}>Giá xuất: {Format(itemvattu.giaxuat)}</Text>
                                    
                                    </View>
                                    <View style={{display:'flex',justifyContent:'space-around',alignItems:'center',flexDirection:'row',height:40,borderBottomWidth:1,borderStyle:'solid',borderColor:'#333',paddingLeft:5,paddingRight:5}}>
                                        <Text style={{flex:0.7}}>Năm</Text>
                                        <Text style={{display:'flex',flex:1.1,justifyContent:'center',alignItems:'center',textAlign:'center',borderLeftWidth:1,height:40,paddingTop:10}}>Số lượng nhập</Text>
                                        <Text style={{display:'flex',flex:1.1,justifyContent:'center',alignItems:'center',textAlign:'center',borderLeftWidth:1,height:40,paddingTop:10}}>Số lượng xuất</Text>
                                        <Text style={{display:'flex',flex:1.1,justifyContent:'center',alignItems:'center',textAlign:'center',borderLeftWidth:1,height:40,paddingTop:10}}>Doanh thu</Text>
                                    </View>
                                    {
                                        sonam.map((itemsonam) =>{
                                            slnhap[itemsonam] = 0;
                                            slxuat[itemsonam] = 0;
                                        })
                                    }
                                    {
                                        datactpn[0].map(itemctpn => {
                                            if((itemvattu._id == itemctpn.mavt._id) && (parseInt((itemctpn.mapn.ngay).slice(0,4)) >= yearbd && parseInt((itemctpn.mapn.ngay).slice(0,4)) <=yearkt))
                                            {
                                                nam = parseInt((itemctpn.mapn.ngay).slice(0,4));
                                                slnhap[nam] = slnhap[nam] + itemctpn.soluong; 
                                                // console.log('Số lượng nhập tháng '+thang+' : ',slnhap[thang-1]);  
                                            }
                                        })
                                    }
                                    {
                                         datactpx[0].map(itemctpx => {
                                            if((itemvattu._id == itemctpx.mavt._id) && (parseInt((itemctpx.mapx.ngay).slice(0,4)) >= yearbd && parseInt((itemctpx.mapx.ngay).slice(0,4)) <=yearkt))
                                            {
                                                nam = parseInt((itemctpx.mapx.ngay).slice(0,4));
                                                slxuat[nam] = slxuat[nam] + itemctpx.soluong; 
                                            }
                                        })    
                                    }
                                    {
                                         sonam.map(itemsonam =>
                                             (
                                            <View style={{display:'flex',justifyContent:'space-around',alignItems:'center',flexDirection:'row',height:40,borderBottomWidth:1,borderStyle:'solid',borderColor:'#333',paddingLeft:5,paddingRight:5}}>
                                                <Text style={{flex:0.7}}>{itemsonam}</Text>
                                                <Text style={{display:'flex',flex:1.1,justifyContent:'center',alignItems:'center',textAlign:'center',borderLeftWidth:1,height:40,paddingTop:10}}>{slnhap[itemsonam]} </Text>
                                                <Text style={{display:'flex',flex:1.1,justifyContent:'center',alignItems:'center',textAlign:'center',borderLeftWidth:1,height:40,paddingTop:10}}>{slxuat[itemsonam]}</Text>
                                                <Text style={{display:'flex',flex:1.1,justifyContent:'center',alignItems:'center',textAlign:'center',borderLeftWidth:1,height:40,paddingTop:10}}>{Format((slxuat[itemsonam]*itemvattu.giaxuat)-(slnhap[itemsonam]*itemvattu.gianhap))}</Text>
                                            </View>
                                         ))
                                    }
                                    {
                                        <View style={{display:'flex',justifyContent:'space-around',alignItems:'center',flexDirection:'row',height:40,borderBottomWidth:1,borderStyle:'solid',borderColor:'#333',paddingLeft:5,paddingRight:5}}>
                                            <Text style={{flex:0.7}}>Tổng doanh thu vật tư: {Format(onLoadTotal(itemvattu))} </Text>
                                        </View>
                                    }
                                </View>
                            ))
                        }
                        {
                                <View style={{display:'flex',justifyContent:'center',alignItems:'center',textAlign:'center',marginBottom:20}}>
                                <Text>Tổng doanh thu từ {yearbd} - {yearkt} : {Format(totalcost)}</Text>
                            </View>
                        }
                            </View>
                            : <View style={{display:'flex',justifyContent:'center',marginTop:20,marginLeft:'auto',marginRight:'auto'}}>
                                <Text style={{fontSize:20,fontWeight:'600'}}>Nhập năm và thực hiện thống kê</Text>
                            </View>
                    } 
                </View>
            </ScrollView>
        </View>
    )
 
    function onLoadTotal(itemvattu)
    {
        var total = 0;
        sonam.map(itemsonam =>
            {
               total+= (slxuat[itemsonam]*itemvattu.giaxuat)-(slnhap[itemsonam]*itemvattu.gianhap);
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
    width:100,
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
    backgroundColor: '#1b94ff',
},
buttonOption:{
        width:90,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#1b94ff',
        marginRight:'auto',
        marginLeft:'auto'
    },
 
})