import React from 'react'
import { useState } from 'react';
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
    } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import ChiTietPhieuXuat from './ChiTietPhieuXuat';

const SCREEN_WIDTH = Dimensions.get('window').width;  
function PhieuXuatItem({phieuxuat,stt}) {

    const [ctpx,setCTPX] = useState(false);

    // console('Có gọi nè -----------------------------------------------')
    // const [detailimport,setDetailImport] = useState(false);

    const Format = (number) => {
        if (number >= 0) {
          return String(number).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND";
        } else
          return (
            "-" + String(number * -1).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND"
          );
      };

    return (
        <>
        <View style={styles.itemphieu}>
            <View style={styles.itemfield}>
                <Text style={styles.label}>STT : </Text>
               <Text style={styles.content}>{stt+1}</Text>
            </View>

            <View style={styles.itemfield}>
                <Text style={styles.label}>ID : </Text>
                <Text style={styles.content}>{phieuxuat._id}</Text>
            </View>

            

            <View style={styles.itemfield}>
                <Text style={styles.label}>Ngày Lập :</Text>
                <Text style={styles.content}>
                {(phieuxuat.ngay).slice(8,10)}-{(phieuxuat.ngay).slice(5,7)}-{(phieuxuat.ngay).slice(0,4)}
                </Text>
            </View>

            <View style={styles.itemfield}>
                <Text style={styles.label}>Nhân Viên :</Text>
                <Text style={styles.content}> {phieuxuat.manv.hoten}</Text>
            </View>

            <View style={styles.itemfield}>
                <Text style={styles.label}>Đại Lý : </Text>
                <Text style={styles.content}>{phieuxuat.manv.madaily.tendl}</Text>
            </View>
            
            <View style={styles.itemfield}>
                <Text style={styles.label}>Kho : </Text>
                <Text style={styles.content}>{phieuxuat.makho.tenkho}</Text>
            </View>
            
            <View style={styles.itemfield}>
                <Text style={styles.label}>Tổng Tiền : </Text>
                <Text style={styles.content}>{Format(onLoadTotal())}</Text>
            </View>
            <View View style={styles.option}>
                {/* <MaterialCommunityIcons name="file-document-edit-outline" size={25} color="#fff" /> */}
                <View><MaterialCommunityIcons name={ctpx ? "eye" : "eye-off"} size={25} color="#fff"
                    onPress={() => {
                        setCTPX(!ctpx)
                    }}
                /></View>
               
            </View>
        </View>


        {
            ctpx ? <ChiTietPhieuXuat key={phieuxuat._id} phieuxuat={phieuxuat}
            // tongtien={Format(onLoadTotal())}
            /> : <></>
        }
        </>
    )
    function onLoadTotal() {
      var totalcost = 0;
      phieuxuat?.ctpx?.map(epbill => {
  totalcost+= epbill.giaxuat*epbill.soluong;
  })
  return totalcost;
    }
     
}

export default PhieuXuatItem;

const styles = StyleSheet.create({
itemphieu: {
        borderLeftWidth:1,
        borderRightWidth:1,
        // borderTopWidth:1,
        borderBottomWidth:1,
        borderStyle:'solid',
        borderColor:'#fff',
        borderRadius:8,
        marginBottom:5,
        marginLeft:2,
        marginRight:2,
        backgroundColor: '#1b94ff',
        // paddingTop:5,
        // paddingBottom:5,
        // paddingLeft:10,
        // paddingRight:5
    },
listPrice: {
    flex: 1,
    width: SCREEN_WIDTH,
    justifyContent: 'space-between',
  },
  itemfield: {
      display:'flex',
      flexDirection:'row',
      flex:1,
      borderTopWidth:1,
      borderTopRightRadius:8,
      borderTopLeftRadius:8,
      borderStyle:'solid',
      borderColor:'#e5e5e5',
      height:25,
      color:"#fff"
    //   justifyContent:'space-around',
    //   width:400
  },
  label: {
      width:85,
    //   backgroundColor:"#999",
      paddingLeft:7,
      color:"#fff"
  }
  ,
  content: {
      color:"#fff"
  },
  option: {
    display:'flex',
  flexDirection:'row',
  alignItems:'center',
  justifyContent:'space-around',
  height:40,
  borderTopWidth:1,
  borderColor:'#fff'
}
 

})


