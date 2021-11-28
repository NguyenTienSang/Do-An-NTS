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

import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APIVattu } from '../api/API';

export default function ThongKeTheoNamTungDaiLy({navigation,route}){
    const [year,setYear] = useState(0);
    var [madl,setMaDL] = useState('');
    var [tendaily,setTenDL] = useState('');
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

    if(route.params !== undefined)
    {
        madl = route.params.id;
        tendaily = route.params.tendl
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
                // console.log('Thông tin vật tư : ',datavattu[0]);    
                // datavattu[0].map(itemvattu => {
                //     console.log(itemvattu._id);
                //     })
            }
            )



        await fetch('http://192.168.1.6:3000/api/ctphieunhap',{
                headers:new Headers({
                  Authorization:"Bearer "+token
                })
                }).then(res=>res.json())
                .then(ctpn=>{
                    // console.log('pn : ',ctpn.ctphieunhap[0].mapn);
                    // console.log('vt : ',ctpn.ctphieunhap[0].mavt);
                    // console.log('pn : ',ctpn.ctphieunhap);
                    // console.log('ctpn : ',ctpn.ctphieunhap[0].mapn.manv.madl);
                    console.log('madl : ',madl);
                    for(var i=0; i< ctpn.ctphieunhap.length; i++)
                    {
                        console.log('daily : ',ctpn.ctphieunhap[i].mapn.manv.madaily);
                        // console.log('ctphieunhap : '+i+' : ',ctpn.ctphieunhap[i].mavt)
                        if(ctpn.ctphieunhap[i].mapn.manv.madaily == madl)
                        {
                            console.log('push pn');
                            datactpn.push(ctpn.ctphieunhap[i]);   
                        }
                    }
                    console.log('datactpn : ',datactpn);
                    setDataCTPN(datactpn);
                }
                )    

        await fetch('http://192.168.1.6:3000/api/ctphieuxuat',{
                    headers:new Headers({
                      Authorization:"Bearer "+token
                    })
                    }).then(res=>res.json())
                    .then(ctpx=>{
                        // datactpx.push(ctpx.ctphieuxuat);
                        for(var i=0; i< ctpx.ctphieuxuat.length; i++)
                        {
                            if(ctpx.ctphieuxuat[i].mapx.manv.madaily == madl)
                            {
                                console.log('push px');
                                datactpx.push(ctpx.ctphieuxuat[i]);   
                            }
                        }
                        console.log('datactpx : ',datactpx);
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

                    {/* <View style={styles.rowInput}>
                        <Text style={{display:'flex',alignItems:'center',textAlign:'center'}}>Mã đại lý</Text>
                        <TextInput style={{  display:'flex',justifyContent:'center',textAlign:'center',borderWidth:1,borderStyle:'solid',borderColor:'#999',borderRadius:5,width:240,height:38,marginTop:20}} 
                             placeholder="Mã đại lý"
                             value={madl}
                             editable={false}
                            //  onChangeText={(text) =>  setMaDL(text)}
                        />
                    </View> */}

                    <View style={styles.rowInput}>
                        <Text style={{display:'flex',alignItems:'center',textAlign:'center',marginTop:15,marginRight:15}}>Tên đại lý</Text>
                        <TextInput style={{  display:'flex',justifyContent:'center',textAlign:'center',alignItems:'center',borderWidth:1,borderStyle:'solid',borderColor:'#999',borderRadius:5,width:240,height:38,marginTop:20}} 
                             placeholder="Tên đại lý"
                             value={tendaily}
                             editable={false}
                            //  onChangeText={(text) =>  setMaDL(text)}
                        />
                    </View>

                    <View style={{marginLeft:'auto',marginRight:'auto',marginBottom:30}}>
                        <Button buttonStyle={styles.buttonAction} title="Chọn đại lý"
                                onPress={() => {
                                    navigation.navigate("DanhSachDaiLy",{page: 'ThongKeTheoNamTungDaiLy'})
                                    }}
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
                                                    if(route.params === undefined)
                                                    {
                                                        alert('Vui lòng chọn đại lý');
                                                    }
                                                    else if(route.params !== undefined)
                                                    {
                                                        await ThongKeDoanhThu();
                                                    }
                                                    
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
                                        //  console.log('ctpn : ',ctpn.ctphieunhap[0].mapn.manv.madl);
                                        datactpn.map(itemctpn => {
                                            if((itemvattu._id == itemctpn.mavt._id) && (year == parseInt((itemctpn.mapn.ngay).slice(0,4))))
                                            {
                                                thang = parseInt((itemctpn.mapn.ngay).slice(5,7));
                                                slnhap[thang-1] = slnhap[thang-1] + itemctpn.soluong; 
                                                console.log('Số lượng nhập tháng '+thang+' : ',slnhap[thang-1]);  
                                            }
                                        })
                                    }
                                    {
                                         datactpx.map(itemctpx => {
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
                            <Text style={{fontSize:20,fontWeight:'600'}}>Nhập năm, chọn đại lý và thực hiện thống kê</Text>
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
rowInput: {
    display: 'flex',
    justifyContent:'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    textAlign:'center',
    marginBottom:20,
    marginLeft:20
},  
  textInput: {
      display:'flex',
      justifyContent:'center',
      textAlign:'center',
      borderWidth:1,
      borderStyle:'solid',
      borderColor:'#999',
      borderRadius:5,
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