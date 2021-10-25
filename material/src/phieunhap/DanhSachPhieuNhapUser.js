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
import PhieuNhap from '../screens/PhieuNhap';
import { DSPhieuNhap } from '../global/Data';
import AsyncStorage from '@react-native-community/async-storage';
import { APIPN } from '../api/API';

export default function DanhSachPhieuNhapUser({navigation}){

    const SCREEN_WIDTH = Dimensions.get('window').width;  

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState();
    var [iddl, setIDDL] = useState('');

        const Infor = async ()=>{
          AsyncStorage.getItem('_iddl').then((data)=>{
            iddl = JSON.parse(data)
        })
          const token = await AsyncStorage.getItem("token");
        await fetch(`${APIPN}`,{
        headers:new Headers({
          Authorization:"Bearer "+token
        })
        }).then(res=>res.json())
        .then(pn=>{
          var datapn = [];
          for(var i = 0 ;i<pn.phieunhap.length; i++)
          {
           
            if(pn.phieunhap[i].manv.madaily == iddl)
            {
                console.log('push nv');
                datapn.push(pn.phieunhap[i]);
            }
          }
        
            setData(datapn);
        }
        )
      }

      useEffect(()=>{
        if(data.length == 0)
        {
            Infor();
            setLoading("")
            // setLoading(loading+1)
          } 
      },[loading])

     
      if(data.length > 0)
      {
        return(
          <View style={{marginLeft:3,marginRight:3}}>
                  <View style={{display:'flex',justifyContent:'center',alignItems:'center',height:40}}>
                  <Text style={{fontSize:20,fontWeight:'300'}}>Danh Sách Phiếu Nhập</Text>
                  </View>
                  <View style={{display:'flex',justifyContent:'center',alignItems:'center',height:60}}>
                          <Button 
                          title="Thêm"
                           buttonStyle={styles.buttonOption}
                           onPress={()=>{
                              navigation.navigate("LapPhieuNhap")
                          }}
                               />
                  </View>
                 
                  <View style={{display:'flex',justifyContent:'space-around',alignItems:'center',flexDirection:'row',height:40,borderWidth:1,borderStyle:'solid',borderColor:'#333',paddingLeft:5,paddingRight:5}}>
                          <Text style={{flex:1}}>Tên Phiếu</Text>
                          <Text style={{flex:1}}>Ngày Lập</Text>
                          <Text style={{flex:1}}>Nhân Viên</Text>
                          <Text style={{flex:1}}></Text>
                    </View>       
                  <ScrollView style={{width:SCREEN_WIDTH*0.987}}>
                     <View>
                      {
                          data.map(item=>(
                              <View key={item._id}>
                                      <View style={{display:'flex',justifyContent:'space-around',flexDirection:'row',alignItems:'center',borderLeftWidth:1,borderRightWidth:1,borderBottomWidth:1,borderStyle:'solid',borderColor:'#333',paddingTop:5,paddingBottom:5,paddingLeft:5,paddingRight:5}}>
                                         <Text style={{flex:1}}>{item.tenpn}</Text>
                                         <Text style={{flex:1}}>{(item.ngay).slice(8,10)}-{(item.ngay).slice(5,7)}-{(item.ngay).slice(0,4)}</Text>
                                         <Text style={{display:'flex',justifyContent:'center',flex:1,marginLeft:'auto',marginRight:'auto'}}>{item.manv.hoten}</Text>
                                         <Button  
                                              title="Chi Tiết"
                                              buttonStyle={[styles.buttonOption,{flex:1}]}
                                              onPress={()=>{
                                                  navigation.navigate("ChiTietPhieuNhap",{id:item._id,tenpn:item.tenpx,ngay : item.ngay,manv : item.manv.manv})
                                              }}
                                        />
                                      </View>
                              </View>
                          ))
                      }
                  </View>
                  </ScrollView>
          </View>
      )
      }

      return (
        <View>
            <Text style={{marginTop:350,marginLeft:'auto',marginRight:'auto'}}>Không có phiếu nhập</Text>
        </View>
    )
 
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