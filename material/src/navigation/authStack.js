import React, {useEffect,useState} from 'react';

import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import SignInScreen from '../screens/authScreens/SignInScreen';
import LoadingScreen from '../screens/authScreens/LoadingScreen';
import DrawerNavigator from './DrawerNavigator';

// import RootClientTabs from './ClientTabs';
import RestaurantMapScreen from '../screens/RestaurantsMapScreen';
import DaiLy from './../screens/DaiLy';
import LoiNhuan from './../screens/LoiNhuan';

import ListMaterial from '../Materials/ListMaterial';
import AddPriceMaterial from '../Materials/AddMaterial';
import EditMaterial from '../Materials/EditMaterial';

import MyOrdersScreen from '../screens/MyOrdersScreen';

import AddStore from '../store/AddStore';
import EditStore from '../store/EditStore';

import Kho from './../screens/Kho';
import AddKho from '../kho/AddKho';
import EditKho from '../kho/EditKho';

import NhanVien from './../screens/NhanVien';
import AddEmployee from '../nhanvien/AddEmployee';
import EditEmployee from '../nhanvien/EditEmployee';


import BangGiaNhap from '../phieunhap/BangGiaNhap';
import PhieuNhap from '../screens/PhieuNhap';
import LapPhieuNhap from './../phieunhap/LapPhieuNhap';
import DanhSachPhieuNhap from './../phieunhap/DanhSachPhieuNhap';
import ChiTietPhieuNhap from './../phieunhap/ChiTietPhieuNhap';


import BangGiaXuat from '../phieuxuat/BangGiaXuat';
import PhieuXuat from '../screens/PhieuXuat';
import LapPhieuXuat from './../phieuxuat/LapPhieuXuat';
import DanhSachPhieuXuat from './../phieuxuat/DanhSachPhieuXuat';
import ChiTietPhieuXuat from './../phieuxuat/ChiTietPhieuXuat';
import SignUpScreen from './../screens/authScreens/SignUpScreen';



// import { AsyncStorage } from '@react-native-async-storage/async-storage';
import UserHomeScreen from './../User/UserHomeScreen';
import DSNhanVienUser from './../User/DSNhanVienUser';
import DanhSachPhieuNhapUser from './../phieunhap/DanhSachPhieuNhapUser';
import DanhSachPhieuXuatUser from './../phieuxuat/DanhSachPhieuXuatUser';
import ListMaterialUser from './../Materials/ListMaterialUser';
import DanhSachDaiLy from './../store/DanhSachDaiLy';
import DoiMatKhau from './../screens/DoiMatKhau';
import DanhSachKho from './../kho/DanhSachKho';

import ThongKe from '../screens/ThongKe';
import ThongKeTheoNam from '../screens/ThongKeTheoNam';
import ThongKeTheoGiaiDoan from '../screens/ThongKeTheoGiaiDoan';
import ThongKeTheoNamTatCaDaiLy from './../screens/ThongKeTheoNamTatCaDaiLy';
import ThongKeTheoGiaiDoanTatCaDaiLy from './../screens/ThongKeTheoGiaiDoanTatCaDaiLy';
import ThongKeTheoNamTungDaiLy from '../screens/ThongKeTheoNamTungDaiLy';
import ThongKeTheoGiaiDoanTungDaiLy from '../screens/ThongKeTheoGiaiDoanTungDaiLy';
import SoLuongTonKho from './../kho/SoLuongTonKho';





const Stack = createStackNavigator();

export function AuthStack() {
    // const [isloggedin,setLogged] = useState(null)

    // const detectLogin = async ()=>{
    //     // const token = await AsyncStorage.getItem('@storage_Key');
    //     const token ='';
    //     if(token){
    //        setLogged(true) 
    //     } else {
    //         setLogged(false)
    //     }
    // }

    // useEffect(async ()=>{
    //     detectLogin();
    // },[])

    return(
        <Stack.Navigator>
                

              <Stack.Screen
                name="SignInScreen"
                component = {SignInScreen}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />

            <Stack.Screen
                name="SignUpScreen"
                component = {SignUpScreen}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />
          

            <Stack.Screen
                    name="LoadingScreen"
                    component = {LoadingScreen}
                    options = {{
                        headerShown: false,
                        ...TransitionPresets.RevealFromBottomAndroid
                    }}
            />

                <Stack.Screen
                    name="DrawerNavigator"
                    component = {DrawerNavigator}
                    options = {{
                        headerShown: false,
                        ...TransitionPresets.RevealFromBottomAndroid
                    }}
                />


            

       

            <Stack.Screen
                name="RestaurantMapScreen"
                component = {RestaurantMapScreen}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />     


             <Stack.Screen
                name="DaiLy"
                component = {DaiLy}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />   

            <Stack.Screen
                name="Kho"
                component = {Kho}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />   

            {/* PHIẾU NHẬP  */}
            <Stack.Screen
                name="PhieuNhap"
                component = {PhieuNhap}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />   

            <Stack.Screen
                name="BangGiaNhap"
                component = {BangGiaNhap}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />   

            <Stack.Screen
                name="DanhSachPhieuNhap"
                component = {DanhSachPhieuNhap}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />  

            <Stack.Screen
                name="LapPhieuNhap"
                component = {LapPhieuNhap}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />   

            <Stack.Screen
                name="ChiTietPhieuNhap"
                component = {ChiTietPhieuNhap}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />   

              {/* PHIẾU XUẤT  */}        
              <Stack.Screen
                name="PhieuXuat"
                component = {PhieuXuat}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />   

            <Stack.Screen
                name="BangGiaXuat"
                component = {BangGiaXuat}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />   



            <Stack.Screen
                name="DanhSachPhieuXuat"
                component = {DanhSachPhieuXuat}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />  

            <Stack.Screen
                name="LapPhieuXuat"
                component = {LapPhieuXuat}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />   

            <Stack.Screen
                name="ChiTietPhieuXuat"
                component = {ChiTietPhieuXuat}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />   

           
            <Stack.Screen
                name="ListMaterial"
                component = {ListMaterial}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            /> 


            <Stack.Screen
                name="AddPriceMaterial"
                component = {AddPriceMaterial}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />   


                <Stack.Screen
                name="EditMaterial"
                component = {EditMaterial}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />   
            {/* Quản lý đại lý */}
            <Stack.Screen
                name="AddStore"
                component = {AddStore}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />   

            <Stack.Screen
                name="EditStore"
                component = {EditStore}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />   


             {/* Quản lý kho */}
             <Stack.Screen
                name="DanhSachKho"
                component = {DanhSachKho}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />    

             <Stack.Screen
                name="AddKho"
                component = {AddKho}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />   

            <Stack.Screen
                name="EditKho"
                component = {EditKho}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />       

             <Stack.Screen
                name="SoLuongTonKho"
                component = {SoLuongTonKho}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />       


         {/* Quản lý nhân  viên  */}
         <Stack.Screen
                name="NhanVien"
                component = {NhanVien}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />   

         <Stack.Screen
                name="AddEmployee"
                component = {AddEmployee}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />   

            <Stack.Screen
                name="EditEmployee"
                component = {EditEmployee}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />   


            <Stack.Screen
                name="MyOrdersScreen"
                component = {MyOrdersScreen}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            /> 

                <Stack.Screen
                name="ThongKe"
                component = {ThongKe}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            /> 

        <Stack.Screen
                name="ThongKeTheoNam"
                component = {ThongKeTheoNam}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            /> 

            <Stack.Screen
                name="ThongKeTheoGiaiDoan"
                component = {ThongKeTheoGiaiDoan}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            /> 

                    <Stack.Screen
                name="ThongKeTheoNamTungDaiLy"
                component = {ThongKeTheoNamTungDaiLy}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            /> 

            <Stack.Screen
                name="ThongKeTheoNamTatCaDaiLy"
                component = {ThongKeTheoNamTatCaDaiLy}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            /> 

            <Stack.Screen
                name="ThongKeTheoGiaiDoanTungDaiLy"
                component = {ThongKeTheoGiaiDoanTungDaiLy}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            /> 

            <Stack.Screen
                name="ThongKeTheoGiaiDoanTatCaDaiLy"
                component = {ThongKeTheoGiaiDoanTatCaDaiLy}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            /> 

            <Stack.Screen
                name="UserHomeScreen"
                component = {UserHomeScreen}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            /> 

            <Stack.Screen
                name="DSNhanVienUser"
                component = {DSNhanVienUser}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />    

            <Stack.Screen
                name="DanhSachPhieuNhapUser"
                component = {DanhSachPhieuNhapUser}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />   

             <Stack.Screen
                name="DanhSachPhieuXuatUser"
                component = {DanhSachPhieuXuatUser}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />   

            <Stack.Screen
                name="ListMaterialUser"
                component = {ListMaterialUser}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />   

                <Stack.Screen
                name="DanhSachDaiLy"
                component = {DanhSachDaiLy}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />   


            <Stack.Screen
                name="DoiMatKhau"
                component = {DoiMatKhau}
                options = {{
                    headerShown: false,
                    ...TransitionPresets.RevealFromBottomAndroid
                }}
            />   


        </Stack.Navigator>
    )
}