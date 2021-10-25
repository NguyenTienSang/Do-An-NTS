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
import PhieuXuat from '../screens/PhieuXuat';
import { DSPhieuXuat } from '../global/Data';
import AsyncStorage from '@react-native-community/async-storage';
import { APIPX } from '../api/API';

export default function DanhSachPhieuXuatUser({navigation,route}){

    const SCREEN_WIDTH = Dimensions.get('window').width;  

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState();
    var [iddl, setIDDL] = useState('');

        const Infor = async ()=>{
          AsyncStorage.getItem('_iddl').then((data)=>{
            iddl = JSON.parse(data)
        })
          const token = await AsyncStorage.getItem("token");
        fetch(`${APIPX}`,{
        headers:new Headers({
          Authorization:"Bearer "+token
        })
        }).then(res=>res.json())
        .then(px=>{
          var datapx = [];
          for(var i = 0 ;i<px.phieuxuat.length; i++)
          {
           
            if(px.phieuxuat[i].manv.infordl == route._id)
            {
                console.log('push nv');
                datapx.push(px.phieuxuat[i]);
            }
          }
        
            setData(datapx);
        }
        )
      }

      useEffect(()=>{
      Infor()
      if(data.length == 0)
      {
          setLoading("")
      } 

      },[loading])


      if(data.length > 0)
      {
        return(
          <View style={{marginLeft:3,marginRight:3}}>
                  <View style={{display:'flex',justifyContent:'center',alignItems:'center',height:40}}>
                  <Text style={{fontSize:20,fontWeight:'300'}}>Danh Sách Phiếu Xuất</Text>
                  </View>
                  <View style={{display:'flex',justifyContent:'center',alignItems:'center',height:60}}>
                          <Button 
                          title="Thêm"
                           buttonStyle={styles.buttonOption}
                           onPress={()=>{
                              navigation.navigate("LapPhieuXuat")
                          }}
                               />
                  </View>
                 
                  <View style={{display:'flex',justifyContent:'space-around',alignItems:'center',flexDirection:'row',height:40,borderWidth:1,borderStyle:'solid',borderColor:'#333',paddingLeft:5,paddingRight:5}}>
                          <Text style={{flex:1}}>Mã Phiếu</Text>
                          <Text style={{flex:1}}>Ngày Lập</Text>
                          <Text style={{flex:1}}>Mã Nhân Viên</Text>
                          <Text style={{flex:1}}></Text>
                    </View>       
                  <ScrollView style={{width:SCREEN_WIDTH*0.987}}>
                     <View>
                      {
                          data.map(item=>(
                              <View>
                                      <View style={{display:'flex',justifyContent:'space-around',flexDirection:'row',alignItems:'center',borderLeftWidth:1,borderRightWidth:1,borderBottomWidth:1,borderStyle:'solid',borderColor:'#333',paddingTop:5,paddingBottom:5,paddingLeft:5,paddingRight:5}}>
                                         <Text style={{flex:1}}>{item.mapx}</Text>
                                         <Text style={{flex:1}}>{(item.ngay).slice(8,10)}-{(item.ngay).slice(5,7)}-{(item.ngay).slice(0,4)}</Text>
                                         <Text style={{display:'flex',justifyContent:'center',flex:1,marginLeft:'auto',marginRight:'auto'}}>{item.manv.manv}</Text>
                                         <Button  
                                              title="Chi Tiết"
                                              buttonStyle={[styles.buttonOption,{flex:1}]}
                                              onPress={()=>{
                                                  navigation.navigate("ChiTietPhieuXuat",{id:item._id,mapx:item.mapx,ngay : item.ngay,manv : item.manv.manv})
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
            <Text style={{marginTop:350,marginLeft:'auto',marginRight:'auto'}}>Không có phiếu xuất</Text>
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