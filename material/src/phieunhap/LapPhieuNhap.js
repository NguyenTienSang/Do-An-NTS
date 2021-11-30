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
  Alert,
  TouchableOpacity
  } from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
// import DatePicker from 'react-native-datepicker'
import {Icon,Button} from 'react-native-elements';
import NumericInput from 'react-native-numeric-input'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import { APIPN } from '../api/API';
import { APICTPN } from '../api/API';
import { APIVattu } from '../api/API';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import { GlobalState } from '../GlobalState';

export default function LapPhieuNhap({navigation,route}){

  const state = useContext(GlobalState);
  const [inforuser] = state.userAPI.inforuser;
  const [token] = state.token;
  console.log('token : ',token);
  console.log('inforuser : ',inforuser)
  const [importbills] = state.importbillAPI.importbills;
  const [detailimportbill, setDetailImportBill] = useState([]);
  const [callback, setCallback] = state.importbillAPI.callback;
  const [datacart, setDataCart] = useState([]);
  const [loading, setLoading] = useState(true);
  // var [makh,setMaKH] = useState('');
  // const [tenpn,setTenPN] = useState('');
  const [id,setID] = useState('');
  var [madl,setMaDL] = useState('');
  const [datehdn,setDateHDN] = useState(new Date());
  const [onSearch, setOnSearch] = useState(false);
  const [importbill, setImportBill] = useState({
    tenpn: "",
    ngay: moment(),
    manv: inforuser._id,
    makho: ""
  });


  const [date, setDate] = useState(moment());
  const [show, setShow] = useState(false);


  //Set mã kho
  AsyncStorage.getItem('kt').then(async kt => {
    console.log('Chọn kho  : ',kt)
    if(kt == 'chonkho')
    {
   
      // importbill.makho = route.params.kho._id;
      setImportBill({...importbill,makho : route.params.kho._id})
      setLoading(!loading);
      console.log('Set loading lại')
      AsyncStorage.setItem('kt','none');
    }
  })




    //Set ngày lập
    const onDateChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShow(false)
      setDate(moment(currentDate));
      console.log('currentDate : ',currentDate);
      setImportBill({...importbill,ngay : moment(currentDate)})
      console.log('importbill.ngay : ',importbill.ngay)
    };



  //Load lại trang khi thêm vật tư
  AsyncStorage.getItem('kt').then(kt => {
    if(kt == 'themvt')
    {
      setLoading(!loading);
      AsyncStorage.setItem('kt','none');
    }
  })

  const Format = (number) => {
    return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.') + " VND"
  }


  useEffect(()=>{
    console.log('Load lại')
    AsyncStorage.getItem('cart').then((data)=>{
      // if (data !== null) {
        data = JSON.parse(data);
        setDataCart(data);
        // }
      })
      .catch((err)=>{
        alert(err)
      })
  },[loading])
  

  useEffect(() => {
    setImportBill({
      tenpn:'PN' + (importbills.length+1),
      ngay: moment(new Date()).format('MM-DD-yyy'),
      manv: inforuser._id,
      makho:"",
      ctpn: []
    })
    setDetailImportBill([])
  },[importbills])




  useEffect(async () => {

    // importbills

    setImportBill({...importbill,tenpn : 'PN' + (importbills.length+1)})

  },[])



   return (
      <View style={{flex:1}}>   
      <Header title="Trở về" type="arrow-left"navigation={navigation} />          
      <ScrollView style={{ paddingLeft:7,paddingRight:7}}>
        <View>
           <Text style={{marginLeft:'auto',marginRight:'auto',marginTop:20,marginBottom:20,fontSize:20,fontWeight:'500'}}>Nhập Thông Tin Phiếu Nhập</Text>
       </View>
        <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginBottom:10}}>
          <Text>Tên phiếu nhập   </Text>
          <TextInput style={styles.textInput} 
                value={importbill.tenpn}
                editable = {false}
          />
       </View>
       <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginBottom:10}}>
         <Text>Ngày lập      </Text>
         {
           show &&
           (
            <DateTimePicker
            value={new Date(date)}
            mode='date'
            minimumDate={new Date(moment().subtract(30,'d'))}
            maximumDate={new Date(moment())}
            onChange={onDateChange}
             />
           )
         }
         
       
          <Text>{date.format('DD/MM/YYYY')}</Text>
          <Button buttonStyle={styles.buttonAction} title="Chọn ngày" onPress={()=> setShow(true)}/>
       </View>

       <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginBottom:10}}>
         <Text>Mã nhân viên      </Text>
         <TextInput style={styles.textInput} 
                // placeholder="Mã nhân viên"
                value={importbill.manv}
                editable = {false}
          />
       </View>

                    <View style={styles.rowInput}>
                        <Text>Kho              </Text>
                        <TextInput style={styles.textInput} 
                             placeholder="Vui lòng chọn kho"
                             value={route.params !== undefined ? route.params.kho.tenkho : ''}
                             editable={false}
                        />
                    </View>

                    <View style={{marginLeft:'auto',marginRight:'auto',marginBottom:30}}>
                        <Button buttonStyle={styles.buttonAction} title="Chọn kho"
                                onPress={() => {
                                    // navigation.navigate("DanhSachKho",{page: 'LapPhieuNhap'})
                                    console.log('mã đại lý : ',madl);
                                    navigation.navigate("DanhSachKho",{madl: madl,page: 'LapPhieuNhap'})
                                    }}
                            />
                    </View>    

        <View style={{display:'flex',justifyContent:'center',flexDirection:'row',marginTop:15,marginBottom:15}}>
          <Text style={{fontSize:20,fontWeight:'300'}}>Danh sách vật tư</Text>
        </View>
        <View style={{borderWidth:1,borderStyle:'solid',borderColor:'#999'}}>
                <View style={{display:'flex',justifyContent:'space-between',textAlign:'center',alignItems:'center',flexDirection:'row',paddingLeft:10,paddingRight:10,height:40}}>
                <Text style={{display:'flex',justifyContent:'center',textAlign:'center'}}>Mã VT</Text>
                <Text>Tên VT</Text>
                <Text>Giá</Text>
                <Text>Số Lượng</Text>
        </View>
           {
            
              datacart?.map((item,i)=>{
                return (
                 <View style={{borderTopWidth:1,borderStyle:'solid',borderColor:'#999',paddingTop:7,paddingBottom:7}}>
                 <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',paddingLeft:10,paddingRight:10}}>
                      <Text>{item.material.tenvt}</Text>
                       <Text>{Format(item.material.gianhap)}</Text>
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
        datacart !== null ?
              datacart.length > 0
              ?  <View style={{borderTopWidth:1,borderStyle:'solid',borderColor:'#999',paddingTop:7,paddingBottom:7}}>
                      <Text style={{marginLeft:'auto',marginRight:'auto'}}>Tổng cộng : {Format(onLoadTotal())}</Text>
                </View>
              :  <View style={{borderTopWidth:1,borderStyle:'solid',borderColor:'#999',paddingTop:7,paddingBottom:7}}>
                       <Text style={{marginLeft:'auto',marginRight:'auto'}}>Tổng cộng : 0 VND</Text>
                  </View>
                  : <View style={{borderTopWidth:1,borderStyle:'solid',borderColor:'#999',paddingTop:7,paddingBottom:7}}>
                  <Text style={{marginLeft:'auto',marginRight:'auto'}}>Tổng cộng : 0 VND</Text>
             </View>
      }

          

          </View>
       
       <View style={styles.groupButtonAction}>
       <Button disabled={importbill.makho === "" ? true : false} buttonStyle={[styles.buttonAction,{width: 250}]} title="Thêm Vật Tư Vào Danh Sách"
                                onPress={() => {
                                  navigation.navigate("BangGiaNhap",{makho: importbill.makho})
                                    }
                                  }
                        />
       </View>

      <View style={styles.groupButtonAction}>
                    <Button  disabled={datacart === null ||  datacart.length == 0 ? true : false} buttonStyle={styles.buttonAction} title="Lập Hóa Đơn"
                            onPress={async () => {
                              console.log('Tên phiếu : ',importbill.tenpn);
                              console.log('Ngày lập : ',JSON.stringify(importbill.ngay).slice(0,11));
                              console.log('Mã nhân viên : ',importbill.manv);
                              console.log('Mã kho : ',importbill.makho);
                              console.log('datacart : ',datacart);

                              try {
                                const res = await axios.post(
                                         "http://192.168.1.4:5000/api/phieunhap",
                                         {...importbill,ctpn: datacart.map(item => ({
                                          mavt : item.material._id, gianhap : item.material.gianhap,soluong : item.quantity
                                        })) },
                                         {
                                           headers: { Authorization: token },
                                         }
                                       );
                                       console.log('importbill nè : ',importbill)
                                       
                                       Alert.alert(
                                        'Thông báo',
                                        res.data.message,
                                        [
                                          { text: "OK", onPress: () => {
                                            setCallback(!callback);
                                            navigation.navigate("PhieuNhap");
                        
                                          } }
                                        ],
                                        );
                                      
                                       
                               } catch (err) {
                                   alert(err.response.data.message);
                               }
                                }
                              }
                    />

                    <Button buttonStyle={styles.buttonAction} title="Hủy"
                         onPress={()=>{
                            navigation.navigate("PhieuNhap")
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
        total = total + (cart[i].material.gianhap*cart[i].quantity);
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
        return setLoading(!loading);
      }

      function removeProduct(i)
      {
        datacart.splice(i,1);
         AsyncStorage.setItem('cart',JSON.stringify(datacart));
         setDataCart(datacart);
        return setLoading(!loading);
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