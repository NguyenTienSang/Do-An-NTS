import React, {useEffect,useState} from 'react';
import { View, StyleSheet} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import {
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper'
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer'

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-community/async-storage';
import { colors } from './../global/styles';
import { APIGetUser } from '../api/API';

export function DrawerContent({navigation,props}) {

    const [isDarkTheme, setIsDarkTheme] = React.useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState();
    // const [manv,setMaNV] = useState('');
   

    const Infor = async ()=>{
        const token = await AsyncStorage.getItem("token");
        const Username = await AsyncStorage.getItem("username");
      await fetch(`${APIGetUser}/${Username}`,{
      headers:new Headers({
        Authorization:"Bearer "+token
      })
      }).then(res=>res.json())
      .then(nv=>{
        data.push(nv.nhanvien[0]);
        AsyncStorage.setItem('nhanvien',JSON.stringify(nv.nhanvien[0]));
        setData(data);
      }
      )
     }

     useEffect(async ()=>{
        await Infor()
        if(data.length == 0)
        {
           console.log('loading');
            setLoading("")
        } 
      },[loading])
    

      console.log('Dữ liệu : ',data);

      console.log('Chiều dài : ',data.length);
      

     const logout = ()=>{
        AsyncStorage.removeItem("token").then(()=>{
          navigation.replace("SignInScreen")
        })
     }
   
    
        if(data.length > 0)
        {
            return (
                <View style={{flex:1}}>
                    <DrawerContentScrollView {...props}>
                        <View style={styles.drawerContent}>
                              <View style={styles.userInfoSection}>
                                       <View style={{flexDirection:'column',marginTop:15}}>
                                       <View style={{marginLeft:50}}>
                                       <Avatar.Image
                                           source={{
                                               uri: data[0].images
                                           }}
                                           size={90}
                                       />
                                       </View>
                                       <View style={{display:'flex',alignItems:'center',flexDirection:'row',marginTop:25}}>
                                                <Icon
                                               name="user-circle"
                                               iconStyle={{color: 'black',marginRight:10}}
                                               type="font-awesome"
                                               />
                                                <Text style={{fontSize:18}}>{data[0].username}</Text>   
                                       </View>
        
                                       <View style={{display:'flex',alignItems:'center',flexDirection:'row',marginTop:20}}>
                                                <Icon
                                               name="v-card"
                                               iconStyle={{color: 'black',marginRight:10}}
                                               type="entypo"
                                               />
                                                <Text style={{fontSize:18}}>{data[0].hoten}</Text>   
                                       </View>
        
                                       <View style={{display:'flex',alignItems:'center',flexDirection:'row',marginTop:20}}>
                                                <Icon
                                               name="store"
                                               iconStyle={{color: 'black',marginRight:10}}
                                               type="material"
                                               />
                                                <Text style={{fontSize:18}}>{data[0].madaily.tendl}</Text>   
                                       </View>
        
                                       <View style={{display:'flex',alignItems:'center',flexDirection:'row',marginTop:25}}>
                                                <Icon
                                               name="home"
                                               iconStyle={{color: 'black',marginRight:10}}
                                               type="entypo"
                                               />
                                                <Text style={{fontSize:18}}>{data[0].diachi}</Text>   
                                       </View>
        
                                    
        
                                       <View style={{display:'flex',alignItems:'center',flexDirection:'row',marginTop:25}}>
                                                <Icon
                                               name="table-account"
                                               iconStyle={{color: 'black',marginRight:10}}
                                               type="material-community"
                                               />
                                                <Text style={{fontSize:18}}>{data[0].role}</Text>   
                                       </View>
                                       <View style={{display:'flex',alignItems:'center',flexDirection:'row',marginTop:25}}>
                                                <Icon
                                               name="account-key-outline"
                                               iconStyle={{color: 'black',marginRight:10}}
                                               type="material-community"
                                               />

                                                <Text style={{fontSize:18}} onPress={()=> {
                                                    navigation.navigate("DoiMatKhau",{nhanvien: data[0]})
                                                }}>Đổi mật khẩu</Text>
                                               {/* <Button
                                                title="Đổi mật khẩu"
                                                // buttonStyle={styles.taskButton}
                                                // titleStyle={parameters.buttonTitle}
                                                onPress={()=>{
                                                    navigation.navigate("DSNhanVienUser")
                                                }}
                                            >
                                            </Button> */}
                                       </View>
                                   </View>
                                   
                              </View>
                                           
                              {/* <Drawer.Section title="Preferences"> */}
                                    {/* <DrawerItem
                                        icon={({color,size}) => (
                                            <Icon
                                            name="table-account"
                                            iconStyle={{color: 'black',marginRight:10}}
                                            type="material-community"
                                            />
                                        )}
                                        label="Đổi mật khẩu"
                                        onPress={() => {}}
                                    /> */}
                            {/* </Drawer.Section>   */}
                        </View>
                    </DrawerContentScrollView>

                    <Drawer.Section style={styles.bottomDrawerSection}>
                            <DrawerItem
                                icon={({color,size}) => (
                                    <Icon
                                        name="exit-to-app"
                                        color={color}
                                        size={size}
                                    />
                                )}
                                label="Đăng xuất"
                                onPress={() => {
                                    // props.navigation.navigate('SignInScreen')
                                    logout();
                                }}
                            />
                    </Drawer.Section>
                </View>
            )
        }
        else if(data.length == 0)
        {
          return (
            <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                   <Text>Đang Load dữ liệu</Text>
                </View>
            </DrawerContentScrollView>
        </View>
          )    
        }    
   
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14.
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});