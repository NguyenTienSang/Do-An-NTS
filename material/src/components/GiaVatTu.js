import React from 'react';
import { View, Text,Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Pressable} from 'react-native';
import {Button} from 'react-native-elements';
import {
    Icon
} from 'react-native-elements';
import { GiaBan } from '../global/Data';

import { colors, parameters } from '../global/styles';

export default function GiaVatTu({TenSP,Gia,DonVi,images})
{
    return(
        <View>
            <View style={{display:'flex',flex:1, flexDirection:'row'}}>
                <Image 
                style={styles.image}
                source={{uri:images}}/>
                <View style={{display:'flex',flexDirection:'column',marginTop:14,marginBottom:14}}>
                        <Button 
                        title="Xóa"
                        buttonStyle={[styles.buttonOption,{marginBottom:40}]}
                        onPress={()=>{
                                this.props.navigation.navigate('DeleteMaterial')
                                }}
                        />

                        <Button 
                        title="Sửa"
                        buttonStyle={styles.buttonOption}
                            />
                </View>
            </View>
           <View style={styles.thonTinSP}>
               <View>
                    <Text style={{color:'#000',marginLeft:'auto',marginRight:'auto'}}>{TenSP}</Text>
               </View>
               <View>
                     <Text style={{color:'#000',marginLeft:'auto',marginRight:'auto'}}>
                            <Text>{Gia}</Text>
                            <Text>đ/</Text>
                            <Text>{DonVi}</Text>
                        </Text>
               </View>
           </View>
        </View>
    )
}

const styles = StyleSheet.create({
    image:{
        height:150,
        width:260,
        borderRadius: 5,
        marginRight:5
    },
    thonTinSP: {
        display: 'flex',
        flexDirection:'column',
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
        backgroundColor: '#1b94ff',
        marginRight:5,
        marginLeft:5
    },

})