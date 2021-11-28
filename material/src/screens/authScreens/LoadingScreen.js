import React,{useEffect} from 'react';
import { Button ,TextInput} from 'react-native-paper';
import {
  ActivityIndicator,
  View,
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoadingScreen(props) {
    
  const detectLogin= async ()=>{
    const token = await AsyncStorage.getItem('token')
        if(token){
             
              props.navigation.replace("DrawerNavigator")
        }else{
          console.log('hello2------------------------------------------');
            props.navigation.replace("SignInScreen")
        }
  }
  useEffect(()=>{
   detectLogin()
  },[])

  return (
   <View style={styles.loading}> 
    <ActivityIndicator size="large" color="red" />
   </View>
  );
};


const styles= StyleSheet.create({
    loading:{
     flex:1,
    justifyContent:"center",
    alignItems:"center" 
    }
    
  })

