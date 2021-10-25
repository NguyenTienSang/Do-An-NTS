import React, {useState,useEffect} from 'react';

import {View, Text, ScrollView , StyleSheet,Dimensions,Image,Alert,TextInput} from 'react-native';
// import BangGia from './BangGia';
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../components/Header';
import { APIKho } from '../api/API';
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
const SCREEN_WIDTH = Dimensions.get('window').width;  


export default function Kho({navigation,route}){

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState();
    const [search,setSearch] = useState('');
    const [textInputFocussed, setTeInputFocussed] = useState(false);

    const Delete = async (id) => {
        console.log('Xóa');
        const token = await AsyncStorage.getItem("token");
        fetch(`${APIKho}/${id}`,{
            method:"DELETE",
            headers: {
                'Content-Type': 'application/json',
                  Authorization :'Bearer '+token
                }
            })
            .then(res=>res.json())
            .then(async (data)=>{
              try {
                if(data.success)
                  {
                    Alert.alert(
                        'Thông báo',
                        data.message,
                        [
                          { text: "OK", onPress: () => {
                            navigation.replace("Kho");
        
                          } }
                        ],
                        );
                  }
                  else if(!data.success)
                  {
                    Alert.alert(
                        'Thông báo',
                        data.message,
                        [
                          { text: "OK", onPress: () => {
                           console.log('Xóa thất bại');
        
                          } }
                        ],
                        );
                  }
              } catch (e) {
                Alert.alert('Thông báo',data.message);
              }
       })
    }    
  
    const Infor = async ()=>{
        const token = await AsyncStorage.getItem("token");
      await fetch(`${APIKho}`,{
      headers:new Headers({
        Authorization:"Bearer "+token
      })
      }).then(res=>res.json())
      .then(kh=>{
          if(route.params.page == "UserHomeScreen")
          {
              console.log('hi');
              for(var i=0; i<kh.kho.length;i++)
              {
                //   console.log('daily1 : ',route.params.madl);
                //   console.log('daily2 : ',kh.kho[i].madaily._id);
                  if(route.params.madl == kh.kho[i].madaily._id)
                  {
                    data.push(kh.kho[i]);
                  }
              }
            setData(data);
          }
          else if(route.params.page == "HomeScreen")
          {
            setData(kh.kho);
          }
      }
      )
     }

  useEffect(async ()=>{
    
    if(data.length == 0)
    {
        await Infor()
        setLoading("");
    } 
    
  },[loading])

  if(route.params.page == "HomeScreen")
  {
    if(data.length > 0)
    {
        
      return(
          <View style={{
              flex:1
          }}>
                   <View style={styles.header}>
              <View style={{marginLeft: 20}}>
                  <Icon
                  type="material-community"
                  name="arrow-left"
                  color='white'
                  size={28}
                  onPress={()=>{navigation.navigate("HomeScreen")}}
                  />
              </View>
              <View>
                  <Text style={styles.headerText}>Trở về</Text>
              </View>
              </View>
  
                  <Text style={styles.title} >Danh Sách Kho</Text>
                  
                  <View style={styles.optionsSelect}>
                          <Button 
                          title="Thêm"
                           buttonStyle={styles.buttonOption}
                           onPress={()=>{
                              navigation.navigate("AddKho")
                          }}
                               />
                  </View>
  
                  <View style={styles.TextInput2}>
                      <TextInput
                          style={{width: '80%'}}
                          placeholder="Nhập tên kho"
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
                 
  
                  <ScrollView>
                  <View style={styles.listPrice}>
                      {
                          data.filter(item=>{
                              if(search == "") 
                              {
                                  return item;
                              }
                              else if(item.tenkho.toLowerCase().includes(search.toLowerCase()))
                              {
                                  return item;
                              }
                          }).map((item)=>(
                              <View key={item._id}>
                                  <View style={{display:'flex',flexDirection:'column',borderWidth:1,borderColor:'#ff8c52',borderRadius:5,marginLeft:3,marginBottom:20,paddingTop:7,paddingBottom:7}}>
                                          <View style={{display:'flex',flex:1, flexDirection:'row'}}>
                                              <Image 
                                              style={styles.image}
                                              source={{uri: item.images}}/>
                                              <View style={{display:'flex',flexDirection:'column',marginTop:14,marginBottom:14}}>
                                                      <Button 
                                                          title="Cập nhật"
                                                          buttonStyle={[styles.buttonOption,{marginBottom:40}]}
                                                          onPress={()=>{
                                                          navigation.navigate('EditKho',{id : item._id,tenkho : item.tenkho,
                                                              madaily: item.madaily._id, diachi : item.diachi,
                                                              sodienthoai: item.sodienthoai,images: item.images})
                                                          }}
                                                          />
                                                      <Button 
                                                      title="Xóa"
                                                      buttonStyle={styles.buttonOption}
                                                      onPress={()=>{
                                                              Delete(item._id);
                                                              setLoading("");
                                                              }}
                                                      />
                                              </View>
                                          </View>
                                         <View style={styles.thontinkho}>
                                             <View>
                                                  <Text style={{color:'#000',marginLeft:'auto',marginRight:'auto'}}>{item.tenkho}</Text>
                                             </View>
                                             <View>
                                                  <Text style={{color:'#000',marginLeft:'auto',marginRight:'auto'}}>
                                                          <Text>Địa chỉ : {item.diachi}</Text>
                                                  </Text>
                                             </View>
                                         </View>
                                         <View style={styles.thontinkho}>
                                             <View>
                                                  <Text style={{color:'#000',marginLeft:'auto',marginRight:'auto'}}>Thuộc : {item.madaily.tendl}</Text>
                                             </View>
                                             <View>
                                                  <Text style={{color:'#000',marginLeft:'auto',marginRight:'auto'}}>
                                                          <Text>SĐT : {item.sodienthoai}</Text>
                                                  </Text>
                                             </View>
                                         </View>
                                         <View style={styles.thontinkho}>
                                          <Button 
                                                          title="Số lượng tồn"
                                                          buttonStyle={{ width: 150,height: 40,borderRadius: 5,backgroundColor: '#ff8c52',marginRight:5,marginLeft:5}}
                                                          onPress={()=>{
                                                          navigation.navigate('SoLuongTonKho',{id : item._id})
                                                          }}
                                                          />
                                         </View>
                                      </View> 
                              </View>
                          ))
                      }
                  </View>
                  </ScrollView>
          </View>
      )
    }

    if(loading == '')
        {
            if(data.length == 0)
            {
                return (
                    <View style={{
                        flex:1
                    }}>
                        <View style={styles.header}>
                    <View style={{marginLeft: 20}}>
                        <Icon
                        type="material-community"
                        name="arrow-left"
                        color='white'
                        size={28}
                        onPress={()=>{navigation.navigate("HomeScreen")}}
                        />
                    </View>
                    <View>
                        <Text style={styles.headerText}>Trở về</Text>
                    </View>
                    </View>
                            <View style={styles.optionsSelect}>
                                    <Button 
                                    title="Thêm"
                                    buttonStyle={styles.buttonOption}
                                    onPress={()=>{
                                        navigation.navigate("AddKho")
                                    }}
                                        />
                            </View>
                        <Text style={{marginTop:250,marginLeft:'auto',marginRight:'auto'}}>Danh sách kho trống</Text>
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

  

  else if(route.params.page == "UserHomeScreen")
  {
    if(data.length > 0)
    {
        
      return(
          <View style={{
              flex:1
          }}>
                   <View style={styles.header}>
              <View style={{marginLeft: 20}}>
                  <Icon
                  type="material-community"
                  name="arrow-left"
                  color='white'
                  size={28}
                  onPress={()=>{navigation.navigate("UserHomeScreen")}}
                  />
              </View>
              <View>
                  <Text style={styles.headerText}>Trở về</Text>
              </View>
              </View>
  
                  <Text style={styles.title} >Danh Sách Kho</Text>
  
                  <View style={styles.TextInput2}>
                      <TextInput
                          style={{width: '80%'}}
                          placeholder="Nhập tên kho"
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
                 
  
                  <ScrollView>
                  <View style={styles.listPrice}>
                      {
                          data.filter(item=>{
                              if(search == "") 
                              {
                                  return item;
                              }
                              else if(item.tenkho.toLowerCase().includes(search.toLowerCase()))
                              {
                                  return item;
                              }
                          }).map((item)=>(
                              <View key={item._id}>
                                  <View style={{display:'flex',flexDirection:'column',borderWidth:1,borderColor:'#ff8c52',borderRadius:5,marginLeft:3,marginBottom:20,paddingTop:7,paddingBottom:7}}>
                                          <View style={{display:'flex',flex:1, flexDirection:'row'}}>
                                              <Image 
                                              style={styles.image}
                                              source={{uri: item.images}}/>
                                          </View>
                                         <View style={styles.thontinkho}>
                                             <View>
                                                  <Text style={{color:'#000',marginLeft:'auto',marginRight:'auto'}}>{item.tenkho}</Text>
                                             </View>
                                             <View>
                                                  <Text style={{color:'#000',marginLeft:'auto',marginRight:'auto'}}>
                                                          <Text>Địa chỉ : {item.diachi}</Text>
                                                  </Text>
                                             </View>
                                         </View>
                                         <View style={styles.thontinkho}>
                                             <View>
                                                  <Text style={{color:'#000',marginLeft:'auto',marginRight:'auto'}}>Thuộc : {item.madaily.tendl}</Text>
                                             </View>
                                             <View>
                                                  <Text style={{color:'#000',marginLeft:'auto',marginRight:'auto'}}>
                                                          <Text>SĐT : {item.sodienthoai}</Text>
                                                  </Text>
                                             </View>
                                         </View>
                                         <View style={styles.thontinkho}>
                                          <Button 
                                                          title="Số lượng tồn"
                                                          buttonStyle={{ width: 150,height: 40,borderRadius: 5,backgroundColor: '#ff8c52',marginRight:5,marginLeft:5}}
                                                          onPress={()=>{
                                                          navigation.navigate('SoLuongTonKho',{id : item._id})
                                                          }}
                                                          />
                                         </View>
                                      </View> 
                              </View>
                          ))
                      }
                  </View>
                  </ScrollView>
          </View>
      )
    }

    if(loading == '')
  {
      if(data.length == 0)
      {
          return (
            <View style={{
                flex:1
            }}>
                 <View style={styles.header}>
            <View style={{marginLeft: 20}}>
                <Icon
                type="material-community"
                name="arrow-left"
                color='white'
                size={28}
                onPress={()=>{navigation.navigate("HomeScreen")}}
                />
            </View>
            <View>
                <Text style={styles.headerText}>Trở về</Text>
            </View>
            </View>
                    <View style={styles.optionsSelect}>
                            <Button 
                            title="Thêm"
                             buttonStyle={styles.buttonOption}
                             onPress={()=>{
                                navigation.navigate("AddKho")
                            }}
                                 />
                    </View>
                 <Text style={{marginTop:250,marginLeft:'auto',marginRight:'auto'}}>Danh sách kho trống</Text>
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
    header: {
        flexDirection: 'row',
        backgroundColor: '#ff8c52',
        height: 40,
      },
      headerText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 30,
      },
    title: {
        display:'flex',
        marginLeft:'auto',
        marginRight:'auto',
        fontSize:30,
        fontWeight: '400',
        paddingTop:10,
        paddingBottom:10,
    },
    optionsSelect:{
        display: 'flex',
        justifyContent:'space-evenly',
        flexDirection:'row',
        marginTop:15,
        paddingBottom:15
    },
    buttonOption:{
        width: 120,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#ff8c52',
        marginRight:5,
        marginLeft:5
    },
    listPrice: {
        // flex: 1,
        width: SCREEN_WIDTH,
        justifyContent: 'space-between'
    },
    image:{
        height:150,
        width:260,
        borderRadius: 5,
        marginRight:5
    },
    thontinkho: {
        display: 'flex',
        justifyContent:'space-around',
        flexDirection:'row',
        marginTop:10,
        marginBottom: 10
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