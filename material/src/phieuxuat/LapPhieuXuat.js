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
  Alert,
  TouchableOpacity
  } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import DatePicker from 'react-native-datepicker'
import {Icon,Button} from 'react-native-elements';
import NumericInput from 'react-native-numeric-input'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APIPX } from '../api/API';
import { APICTPX } from '../api/API';
import { APIVattu } from '../api/API';
import Header from '../components/Header';

export default function LapPhieuXuat({navigation,route}){

  const [datacart, setDataCart] = useState([]);
  const [loading, setLoading] = useState(0);
  var [makh,setMaKH] = useState('');
  const [tenpx,setTenPX] = useState('');
  const [id,setID] = useState('');
  var [madl,setMaDL] = useState('');
  const [currentDate,setcurrentDate] = useState('');
  const [datehdx,setDateHDX] = useState('');
  var [token,setToken] = useState('');

  // AsyncStorage.getItem('dachonkho').then(dachonkho => {
  //   if(dachonkho == 1)
  //   {
  //     makh = route.params.idkho;
  //     setMaKH(makh);
  //     AsyncStorage.setItem('dachonkho','0');
  //   }
  // })
  if(route.params !== undefined)
  {
    makh = route.params.idkho;
  }
  var _idpx = "";
  const getToken = async () => {
    token =  await AsyncStorage.getItem("token");
    console.log("token1 : ",token);
  }
  AsyncStorage.getItem('kt').then(kt => {
    if(kt == 1)
    {
      setLoading(loading+1);
      AsyncStorage.setItem('kt','0');
    }
  })

  const Format = (number) => {
    return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.') + " VND"
  }


  const LapPX = async ()=>{
    console.log('Hi');
    await fetch(`${APIPX}`,{
      method:"POST",
      headers: {
     'Content-Type': 'application/json',
       Authorization :'Bearer '+token
     },
     body:JSON.stringify({
       "tenpx" : tenpx,
       "ngay" : (datehdx.slice(3,5) + '-' + datehdx.slice(0,2) + '-' + datehdx.slice(6,datehdx.length)),
       "manv" : id,
       "makho" : makh
     })
    })
    .then(res=>res.json())
    .then(async (data)=>{
           try {
             console.log('Thông báo',data.message);
           } catch (e) {
            Alert.alert('Thông báo',data.message);
           }
    })
  }



  const IDPX = async ()=>{
  await fetch(`${APIPX}`,{
  headers:new Headers({
    Authorization:"Bearer "+token
  })
  }).then(res=>res.json())
  .then(px=>{
    px.phieuxuat.some(item => {
      if(item.tenpx == tenpx)
      {
        _idpx = item._id;
        console.log('_idpx1 : ',item._id);
        console.log('_idpx2 : ',_idpx);
      }
    })
  }
  )
  }

 
  const LapCTPX = async () => {
    datacart.map(async ctpx => {
      console.log('mavt : ',ctpx.material.id);
      console.log('soluong : ',ctpx.quantity);
      const token = await AsyncStorage.getItem("token");
    await fetch(`${APICTPX}`,{
       method:"POST",
       headers: {
      'Content-Type': 'application/json',
        Authorization :'Bearer '+token
      },
      body:JSON.stringify({
        "mapx" : _idpx,
        "mavt" :ctpx.material.id,
        "soluong" : ctpx.quantity
      })
     })
     .then(res=>res.json())
     .then(async (data)=>{
            try {
              await fetch(`${APIVattu}`,{
                headers:new Headers({
                  Authorization:"Bearer "+token
                })
                }).then(res=>res.json())
                .then(async vt=>{
                  for(var i=0; i<vt.vattu.length; i++)
                  {
                    for(var j = 0; j<datacart.length; j++)
                    {
                          if(vt.vattu[i]._id == datacart[j].material.id)
                          {
                           
                            await fetch(`${APIVattu}/${vt.vattu[i]._id}`,{
                              method:"PUT",
                              headers: {
                            'Content-Type': 'application/json',
                              Authorization :'Bearer '+token
                            },
                            body:JSON.stringify({
                              "tenvt":vt.vattu[i].tenvt,
                              "soluong":vt.vattu[i].soluong - datacart[j].quantity,
                              "gianhap":vt.vattu[i].gianhap,
                              "giaxuat":vt.vattu[i].giaxuat,
                              "donvi":vt.vattu[i].donvi,
                              "images":vt.vattu[i].images
                            })
                            })
                            .then(res=>res.json())
                            .then(async (dataput)=>{
                                  try {
                                    console.log('Thông báo',dataput.message);
                                  } catch (e) {
                                    console.log('Thông báo',dataput.message);
                                  }
                            })
                            break;
                          }
                    }
                  }
                })


              Alert.alert(
                'Thông báo',
                'Lập phiếu xuất thành công',
                [
                  { text: "OK", onPress: () => {
                    navigation.navigate("PhieuXuat");
                  } }
                ],
                );
            } catch (e) {
            //  console.log('Thông báo',data.message);
              Alert.alert('Thông báo',data.message);
            }
     })
    })
  }



  

  useEffect(()=>{
    AsyncStorage.getItem('cart').then((data)=>{
      console.log('render');
      if (data !== null) {
        data = JSON.parse(data);
        setDataCart(data);
        }
      })
      .catch((err)=>{
        alert(err)
      })
  },[loading])

  useEffect(async () => {
    InforPX= async ()=>{
    await fetch(`${APIPX}`,{
    headers:new Headers({
      Authorization:"Bearer "+token
    })
    }).then(res=>res.json())
    .then(px=>{
      const newtenpx = 'PX' + (px.phieuxuat.length + 1);
      setTenPX(newtenpx);
    }
    )
   }
   await  getToken();
   await InforPX();

    
      const day = new Date().getDate();
      const month = new Date().getMonth()+1;
      const year = new Date().getFullYear();
  
      setToken(token);
      setcurrentDate(
        day+'-'+month+'-'+year
      )
      setDateHDX(currentDate);
      setID(await  AsyncStorage.getItem('nhanvien').then((nhanvien)=>{
        const  thongtinnv = JSON.parse(nhanvien);
        // console.log('id1 : ',thongtinnv._id);
        return thongtinnv._id;
     }));

     setMaDL(await  AsyncStorage.getItem('nhanvien').then((nhanvien)=>{
      const  thongtinnv = JSON.parse(nhanvien);
      // console.log('hi');
      madl = thongtinnv.madaily._id;
      console.log('id1 : ',madl);
      return thongtinnv.madaily._id;
   }));
   
  },[])

   return (
      <View>             
        <Header title="Trở về" type="arrow-left"navigation={navigation} />     
      <ScrollView style={{ paddingLeft:7,paddingRight:7}}>
        <View>
           <Text style={{marginLeft:'auto',marginRight:'auto',marginTop:20,marginBottom:20,fontSize:20,fontWeight:'500'}}>Nhập Thông Tin Phiếu Xuất</Text>
       </View>
        <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginBottom:10}}>
          <Text>Tên phiếu xuất   </Text>
          <TextInput style={styles.textInput} 
                value={tenpx}
                editable = {false}
          />
       </View>
       <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginBottom:10}}>
         <Text>Ngày lập     </Text>
          <DatePicker
            style={{width: 300}}
            date={datehdx}
            mode="date"
            placeholder= "Vui lòng chọn ngày"
            format="DD-MM-YYYY"
            minDate="01-07-2021"
            maxDate= {currentDate}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 40,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 29,
                borderWidth:1,
                borderStyle:'solid',
                borderColor:'#999'
              }
            }}
            onDateChange={(datechange) => {
              setDateHDX(datechange);
              console.log('Ngày : ',datechange);
            }}
          />
       </View>
       <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginBottom:10}}>
         <Text>Mã nhân viên     </Text>
         <TextInput style={styles.textInput} 
                // placeholder="Mã nhân viên"
                value={id}
                editable = {false}
          />
       </View>

       <View style={styles.rowInput}>
                        <Text>Mã kho            </Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Mã kho"
                             value={makh}
                             editable={false}
                            //  onChangeText={(text) =>  setMaDL(text)}
                        />
                    </View>

                    <View style={{marginLeft:'auto',marginRight:'auto',marginBottom:30}}>
                        <Button buttonStyle={styles.buttonAction} title="Chọn kho"
                                onPress={() => {
                                    navigation.navigate("DanhSachKho",{madl: madl,page: 'LapPhieuXuat'})
                                    // navigation.navigate("DanhSachDaiLy",{page: 'AddKho'})
                                    }}
                            />
        </View>    

        <View style={{display:'flex',justifyContent:'center',flexDirection:'row',marginTop:15,marginBottom:15}}>
          <Text style={{fontSize:20,fontWeight:'300'}}>Danh sách vật tư</Text>
        </View>
        <View style={{borderWidth:1,borderStyle:'solid',borderColor:'#999'}}>
                <View style={{display:'flex',justifyContent:'space-between',textAlign:'center',alignItems:'center',flexDirection:'row',paddingLeft:10,paddingRight:10,height:40}}>
                <Text>Tên VT</Text>
                <Text>Giá</Text>
                <Text>Số Lượng</Text>
        </View>
           {
            
              datacart.map((item,i)=>{
                return (
                 <View style={{borderTopWidth:1,borderStyle:'solid',borderColor:'#999',paddingTop:7,paddingBottom:7}}>
                 <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',paddingLeft:10,paddingRight:10}}>
                       <Text>{item.material.tenvt}</Text>
                       <Text>{Format(item.material.giaxuat)}</Text>
                       <TouchableOpacity onPress={()=>{
                                  onChangeQual(i,false)
                           }}>
                           <MaterialCommunityIcons name="minus-circle-outline" size={15} color="black" />
                       </TouchableOpacity>
                           <Text>{item.quantity}</Text>
                           <TouchableOpacity onPress={()=>{
                                  onChangeQual(i,true)
                           }}>
                           <MaterialCommunityIcons name="plus-circle-outline" size={15} color="black" />
                       </TouchableOpacity>
                 </View>
                 <View style={{marginLeft:'auto',marginRight:'auto' }}>
                         <Icon
                           name="delete"
                           iconStyle={{color:"#1b94ff"}}
                           type="material"
                           onPress={() => {
                             removeProduct(i)
                           }}
                         />
                 </View>
          </View>
                )
              }
              )
             
      }
      {
              datacart.length > 0
              ?  <View style={{borderTopWidth:1,borderStyle:'solid',borderColor:'#999',paddingTop:7,paddingBottom:7}}>
                      <Text style={{marginLeft:'auto',marginRight:'auto'}}>Tổng cộng : {Format(onLoadTotal())}</Text>
                </View>
              :  <View style={{borderTopWidth:1,borderStyle:'solid',borderColor:'#999',paddingTop:7,paddingBottom:7}}>
                       <Text style={{marginLeft:'auto',marginRight:'auto'}}>Tổng cộng : 0 VND</Text>
                  </View>
      }

          

          </View>
       
       <View style={styles.groupButtonAction}>
          <Button buttonStyle={[styles.buttonAction,{width: 250}]} title="Thêm Vật Tư Vào Danh Sách"
                                onPress={() => {
                                   if(makh == '')
                                   {
                                     alert('Vui lòng chọn kho')
                                   } 
                                   else if(makh != '')
                                   {
                                     navigation.navigate("BangGiaXuat",{id : makh})
                                   }
                                    }
                                  }
                        />
       </View>

      <View style={styles.groupButtonAction}>
                    <Button buttonStyle={styles.buttonAction} title="Lập Hóa Đơn"
                            onPress={async () => {
                              if(datacart.length == 0)
                              {
                                alert('Chưa có vật tư không thể lập hóa đơn')
                              }
                              else {
                                const ktsoluongton =  datacart.some(giohang => {
                                   return (giohang.quantity > giohang.material.soluong);
                                 })
                                 if(ktsoluongton)
                                 {
                                    alert('Số lượng tồn không đủ');
                                 }
                                 else if(!ktsoluongton)
                                 {
                                    await LapPX();
                                    await IDPX();
                                    await LapCTPX();
                                 }
                              }
                                }
                              }
                    />

                    <Button buttonStyle={styles.buttonAction} title="Hủy"
                         onPress={()=>{
                            navigation.navigate("PhieuXuat")
                        }}
                    />
        </View>
        </ScrollView> 
     </View>
      );
               
  
    function onLoadTotal()
    {
      var total = 0;
      const cart = datacart;
      for(var i =0; i< cart.length; i++)
      {
        total = total + (cart[i].material.giaxuat*cart[i].quantity);
      }
      return total;
    }

      function onChangeQual(i,type)
      {
        let cantd = datacart[i].quantity;
        if (type==true) {
         cantd = cantd + 1
         datacart[i].quantity = cantd;
        //  alert(data[i].quantity);
        AsyncStorage.setItem('cart',JSON.stringify(datacart));
         setDataCart(datacart);
        }
        else if (type==false&&cantd>=2){
         cantd = cantd - 1
         datacart[i].quantity = cantd;
         AsyncStorage.setItem('cart',JSON.stringify(datacart));
         setDataCart(datacart);
        }
        else if (type==false&&cantd==1){
         datacart.splice(i,1);
         AsyncStorage.setItem('cart',JSON.stringify(datacart));
         setDataCart(datacart);
        } 
        return setLoading(loading+1);
      }

      function removeProduct(i)
      {
        datacart.splice(i,1);
         AsyncStorage.setItem('cart',JSON.stringify(datacart));
         setDataCart(datacart);
        return setLoading(loading+1);
      }

}


const styles = StyleSheet.create({
  image:{
    height:140,
    width:160,
},
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
    backgroundColor: '#1b94ff',
},
 
})