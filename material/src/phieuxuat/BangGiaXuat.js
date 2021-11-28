import React, {useState,useEffect} from 'react';

import {View, Text, ScrollView , StyleSheet,Dimensions,Image,Alert} from 'react-native';
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APICTPN } from '../api/API';
import { APICTPX } from '../api/API';

const SCREEN_WIDTH = Dimensions.get('window').width;  




export default function BangGiaXuat({navigation,route}){
    const [dsvttonkho, setDSVTTonKho] = useState([]);
    const [loading, setLoading] = useState();

    const Format = (number) => {
        return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.') + " VND"
    }

    function  onClickAddCart(data){
      AsyncStorage.setItem('kt','1');
        const itemcart = {
          material: data,
          quantity:  1
        }
        // SetGiaTri();
        AsyncStorage.getItem('cart').then((datacart)=>{
         
            if (datacart !== null) {
              let check = 0;
              const cart = JSON.parse(datacart)
              cart.map(item => {
                if(item.material.id == itemcart.material.id)
                {
                  item.quantity++;
                  check = 1;
                }
              })
              if(check == 0)
              {
                cart.push(itemcart);
              }
              console.log('Giỏ hàng : ',cart);
              AsyncStorage.setItem('cart',JSON.stringify(cart));
            }
            else{
              const cart  = []
              cart.push(itemcart);
              console.log('Giỏ hàng : ',cart);
              AsyncStorage.setItem('cart',JSON.stringify(cart));
            }
            // alert("Add Cart")
          })
          .catch((err)=>{
            alert(err)
          })
      }


// Truyền vô id kho
// Thống kê trong một kho
// thống kê số lượng tồn trong kho
// Duyệt chi tiết phiếu nhập, phiếu xuất
// Trong phiếu có mã kho -> nếu phieu.makho = idkho 
function product(id, tenvt,soluong,donvi,gianhap,giaxuat,images){
    this.id = id;
    this.tenvt = tenvt;
    this.soluong = soluong;
    this.donvi = donvi;
    this.gianhap = gianhap;
    this.giaxuat = giaxuat;
    this.images = images;
  }
  

// const dsvttonkho = [
// ];


// dsvttonkho.push(new product('vt1', 'Thùng giấy',50))

// console.log('Danh sách vật tư tồn kho : ',dsvttonkho)

// duyệt chi tiết phiếu 
 
    
const ThongKeSoLuongTon = async ()=>{
                    const token = await AsyncStorage.getItem("token");
                    //Duyet phieu nhap
                    await fetch(`${APICTPN}`,{
                    headers:new Headers({
                    Authorization:"Bearer "+token
                    })
                    }).then(res=>res.json())
                    .then(ctpn=>{
                        // console.log('id : ',route.params.id);   
                        for(var i=0; i< ctpn.ctphieunhap.length; i++)
                        {
                            //  console.log('ctpn : '+i+' : ',ctpn.ctphieunhap[i].mapn.makho._id);   
                             if(ctpn.ctphieunhap[i].mapn.makho._id == route.params.id)//So sánh id kho -> nếu bằng id
                             {
                                    //Duyệt số lượng thống kê
                                    var timvattu = dsvttonkho.some(vttk => {
                                        if(vttk.id === ctpn.ctphieunhap[i].mavt._id)
                                        {
                                            // console.log('Tìm thấy');
                                            // console.log('Số lượng 1 : '+ctpn.ctphieunhap[i].mavt._id+' : ',ctpn.ctphieunhap[i].soluong);
                                            vttk.soluong = parseInt(vttk.soluong) + parseInt(ctpn.ctphieunhap[i].soluong);
                                        }
                                        return vttk.id === ctpn.ctphieunhap[i].mavt._id;
                                    });
                                    if(!timvattu)
                                    {
                                        // console.log('VTM N'+ctpn.ctphieunhap[i].mavt._id+' : ',ctpn.ctphieunhap[i].soluong);
                                        dsvttonkho.push(new product(ctpn.ctphieunhap[i].mavt._id, ctpn.ctphieunhap[i].mavt.tenvt,ctpn.ctphieunhap[i].soluong,
                                            ctpn.ctphieunhap[i].mavt.donvi,ctpn.ctphieunhap[i].mavt.gianhap,ctpn.ctphieunhap[i].mavt.giaxuat,ctpn.ctphieunhap[i].mavt.images))
                                        // console.log('Danh sách vật tư tồn kho : ',dsvttonkho);
                                    }
                             }
                            // console.log('mavatu : ',ctpn.ctphieunhap[i].mavt);
                            // console.log('soluong : ',ctpn.ctphieunhap[i].soluong);
                        }
                        setDSVTTonKho(dsvttonkho);
                        console.log('danh sách vật tư tồn kho : ',dsvttonkho);
                    }
                    )

                    await fetch(`${APICTPX}`,{
                    headers:new Headers({
                    Authorization:"Bearer "+token
                    })
                    }).then(res=>res.json())
                    .then(ctpx=>{
                        for(var i=0; i< ctpx.ctphieuxuat.length; i++)
                        {
                             if(ctpx.ctphieuxuat[i].mapx.makho._id == route.params.id)//So sánh id kho -> nếu bằng id
                             {
                                    var timvattu = dsvttonkho.some(vttk => {
                                        if(vttk.id === ctpx.ctphieuxuat[i].mavt._id)
                                        {
                                            // console.log('Số lượng 2 : '+ctpx.ctphieuxuat[i].mavt._id+' : ',ctpx.ctphieuxuat[i].soluong);
                                            vttk.soluong = parseInt(vttk.soluong) - parseInt(ctpx.ctphieuxuat[i].soluong);
                                        }
                                        return vttk.id === ctpx.ctphieuxuat[i].mavt._id;
                                    });
                                    if(!timvattu)
                                    {
                                        // console.log('VTM X'+ctpx.ctphieuxuat[i].mavt._id+' : ',ctpx.ctphieuxuat[i].soluong);
                                        dsvttonkho.push(new product(ctpx.ctphieuxuat[i].mavt._id, ctpx.ctphieuxuat[i].mavt.tenvt,ctpx.ctphieuxuat[i].soluong,
                                            ctpx.ctphieuxuat[i].mavt.donvi,ctpx.ctphieuxuat[i].mavt.gianhap,ctpx.ctphieuxuat[i].mavt.giaxuat,ctpx.ctphieuxuat[i].mavt.images))
                                   }
                             }
                        }
                        setDSVTTonKho(dsvttonkho);
                        // console.log('danh sách vật tư tồn kho : ',dsvttonkho);
                        console.log('Thực hiện xong');
                    }
                    )
               
}

useEffect(async ()=>{
  console.log('loading 1 : ',loading);
    if(dsvttonkho.length == 0)
    {
        await ThongKeSoLuongTon();
        setLoading("");
        console.log('loading 2 : ',loading);
    } 
  },[loading])



  if(dsvttonkho.length > 0)
  {
    return(
        <View style={{
            flex:1, alignItems:'center', justifyContent:'center',
        }}>
                <Text style={styles.title} >Bảng Giá Xuất</Text>

                <ScrollView style={{ paddingLeft:5,paddingRight:5}}>
                <View style={styles.listPrice}>
                    {
                        dsvttonkho.map(item=>(
                            <View key={item._id}>
                                    <View style={{borderWidth:1,borderStyle:'solid',borderColor:'#1b94ff',borderRadius:5,marginBottom:20}}>
                                        <View style={{display:'flex',flex:1, flexDirection:'row'}}>
                                            <Image 
                                            style={styles.image}
                                            source={{uri: item.images}}/>
                                            
                                            <View style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                                                    <Button 
                                                    title="Thêm Vào Phiếu"
                                                    buttonStyle={styles.buttonOption}
                                                    onPress={async ()=>{
                                                        await onClickAddCart(item) 
                                                        navigation.navigate('LapPhieuXuat',{id : item._id})
                                                        }}
                                                        />
                                            </View>
                                        </View>
                                       <View style={styles.thonTinSP}>
                                           <View>
                                                <Text style={{color:'#000',marginLeft:'auto',marginRight:'auto'}}>Tên: {item.tenvt}</Text>
                                           </View>
                                       </View>
                                       <View style={styles.thonTinSP}>
                                            <View>
                                                <Text style={{color:'#000',marginLeft:'auto',marginRight:'auto'}}>SL Tồn: {item.soluong} {item.donvi}</Text>
                                           </View>
                                           <View>
                                                 <View style={{display:'flex',flexDirection:'row',color:'#000',marginLeft:'auto',marginRight:'auto'}}>
                                                        <Text>Giá Nhập : {Format(item.gianhap)}</Text>
                                                        <Text>/{item.donvi}</Text>
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
    )
  }
if(loading === undefined)
{
    if(dsvttonkho.length == 0)
    {
        return (
            <View>
                <Text style={{marginTop:350,marginLeft:'auto',marginRight:'auto'}}>Đang load dữ liệu</Text>
            </View>
        )
    }
}
if(loading == '')
{
    if(dsvttonkho.length == 0)
    {
        return (
            <View>
               <Text style={{marginTop:350,marginLeft:'auto',marginRight:'auto'}}>Dữ liệu trống</Text>
            </View>
        )
    }
}
}


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
      height:150,
      width:260,
      borderRadius: 5,
      marginLeft:5,
      marginRight:3,
      marginTop:5,
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
      height: 60,
      borderRadius: 5,
      backgroundColor: '#1b94ff',
      marginRight:5,
      marginLeft:5
  },
})