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
  Alert
  } from 'react-native';
import DatePicker from 'react-native-datepicker'
import {Icon,Button} from 'react-native-elements';
import NumericInput from 'react-native-numeric-input'
import PhieuXuat from './../screens/PhieuXuat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APICTPX } from '../api/API';
import Header from '../components/Header';

export default function ChiTietPhieuNhap({navigation,route}){

  const SCREEN_WIDTH = Dimensions.get('window').width;  

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();

  const Format = (number) => {
    return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.') + " VND"
  }

        const Infor = async ()=>{
          console.log('Mã phiếu xuất : ',route.params.id);
          console.log('Ngày : ',route.params.ngay);
          const token = await AsyncStorage.getItem("token");
        await fetch(`${APICTPX}/${route.params.id}`,{
        headers:new Headers({
          Authorization:"Bearer "+token
        })
        }).then(res=>res.json())
        .then(ctpx=>{
          console.log('Thông tin : ',ctpx);
            setData(ctpx.ctphieuxuat);//Lưu object danh sách phiếu nhập
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
              <Header title="Trở về" type="arrow-left"navigation={navigation} />
              <View style={{marginLeft:3,marginRight:3}}>
                  <View style={{display:'flex',justifyContent:'center',alignItems:'center',height:40}}>
                          <Text style={{fontSize:20,fontWeight:'300'}}>Chi Tiết Phiếu Xuất :{route.params.tenpx}</Text>
                  </View>
                  <View style={{display:'flex',justifyContent:'space-around',flexDirection:'row',marginBottom:10}}>
                      <Text>Username: {route.params.username}</Text>
                      <Text>Ngày Lập : {(route.params.ngay).slice(8,10)}-{(route.params.ngay).slice(5,7)}-{(route.params.ngay).slice(0,4)}</Text>
                  </View>  
      
                  <View style={{display:'flex',justifyContent:'space-around',alignItems:'center',flexDirection:'row',height:40,borderWidth:1,borderStyle:'solid',borderColor:'#333',paddingLeft:5,paddingRight:5}}>
                          <Text style={{flex:1}}>Mã VT</Text>
                          <Text style={{flex:1}}>Giá</Text>
                          <Text style={{flex:1}}>Số Lượng</Text>
                          <Text style={{flex:1}}>Thành Tiền</Text>
                    </View>  
                       
                  <ScrollView style={{width:SCREEN_WIDTH*0.987}}>
                     <View>
                      {
                          data.map(item=>
                         <View>
                            <View style={{display:'flex',justifyContent:'space-around',flexDirection:'row',alignItems:'center',borderLeftWidth:1,borderRightWidth:1,borderBottomWidth:1,borderStyle:'solid',borderColor:'#333',paddingTop:5,paddingBottom:5,paddingLeft:5,paddingRight:5}}>
                              <Text style={{flex:1}}>{item.mavt.tenvt}</Text>
                              <Text style={{flex:1}}>{item.mavt.giaxuat}</Text>
                               <Text style={{display:'flex',justifyContent:'center',flex:1,marginLeft:'auto',marginRight:'auto'}}>{item.soluong}</Text>
                              <Text style={{flex:1}}>{Format(item.mavt.giaxuat * item.soluong)}</Text>
                            </View>
                          </View>
                             )
                      }
                       {
                            <View style={{display:'flex',justifyContent:'flex-end',flexDirection:'row',alignItems:'center',borderLeftWidth:1,borderRightWidth:1,borderBottomWidth:1,borderStyle:'solid',borderColor:'#333',paddingTop:5,paddingBottom:5,paddingLeft:5,paddingRight:30}}>
                                <Text>Tổng cộng : {Format(onLoadTotal())}</Text>
                            </View>
                      }
                  </View>
                  </ScrollView>
          </View>
          </View>
        )
      }

    

      return (
        <View>
            <Text style={{marginTop:350,marginLeft:'auto',marginRight:'auto'}}>Đang load...</Text>
        </View>
    )
 
    function onLoadTotal()
    {
      var total = 0;
      data.map(item=>{
        total+= item.mavt.giaxuat * item.soluong;
      })

      return total;
    }

}


const styles = StyleSheet.create({
  image:{
    height:140,
    width:160,
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
buttonOption:{
        width:90,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#1b94ff',
        marginRight:'auto',
        marginLeft:'auto'
    },
 
})