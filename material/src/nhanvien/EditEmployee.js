import axios from 'axios';
import React, {useContext, useState, useEffect} from 'react';
import {Picker} from '@react-native-picker/picker';
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
  Alert,
} from 'react-native';

import {GlobalState} from '../GlobalState';
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import CheckBox from '@react-native-community/checkbox';
import {APINhanVien, APIUpload, APIDestroy} from '../api/API';

export default function EditEmployee({navigation, route}) {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [callback, setCallback] = state.employeeAPI.callback;
  let [inforuser, setInforUser] = useState('');
  const [employee, setEmployee] = useState({
    _id: route.params.nhanvien._id,
    hoten: route.params.nhanvien.hoten,
    madaily: route.params.nhanvien.madaily._id,
    diachi: route.params.nhanvien.diachi,
    username: route.params.nhanvien.username,
    password: route.params.nhanvien.password,
    gioitinh: route.params.nhanvien.gioitinh,
    role: route.params.nhanvien.role,
    sodienthoai: route.params.nhanvien.sodienthoai,
    cmnd: route.params.nhanvien.cmnd,
    email: route.params.nhanvien.email,
    trangthai: route.params.nhanvien.trangthai,
    images: route.params.nhanvien.images,
  });

  AsyncStorage.getItem('inforuser').then(async dataUser => {
    setInforUser(JSON.parse(dataUser));
  });

  const [storageemployee, setStorageEmployee] = useState(employee);

  const [toggleSex, setToggleSex] = useState(
    route.params.nhanvien.gioitinh === 'nam' ? true : false,
  );

  const [toggleRole, setToggleRole] = useState(
    route.params.nhanvien.role === 'admin' ? true : false,
  );

  if (route.params.daily !== undefined) {
    employee.madaily = route.params.daily._id;
  }

  const SuaNhanVien = async () => {
    console.log('employee.trangthai : ', employee.trangthai);
    console.log('storageemployee.trangthai : ', storageemployee.trangthai);
    console.log('employee.madaily : ', employee.madaily);
    console.log('storageemployee.madaily : ', storageemployee.madaily);

    await axios
      .put(
        `${APINhanVien}/${employee._id}`,
        {
          ...employee,
          // oldstore: storageemployee.madaily._id,
          // oldtrangthai: storageemployee.trangthai,
        },
        {
          headers: {Authorization: token},
        },
      )
      .then(res => {
        Alert.alert('Th??ng b??o', res.data.message, [
          {
            text: 'OK',
            onPress: () => {
              setCallback(!callback);
              navigation.replace('NhanVien');
            },
          },
        ]);
      })
      .catch(error => {
        Alert.alert('Th??ng b??o', error.response.data.message);
      });

    // if (
    //   employee.trangthai === 'Chuy???n c??ng t??c' &&
    //   storageemployee.madaily === employee.madaily
    // ) {
    //   Alert.alert('Th??ng b??o', 'Vui l??ng ch???n ?????i l?? m???i');
    // } else if (
    //   storageemployee.madaily !== employee.madaily &&
    //   employee.trangthai !== 'Chuy???n c??ng t??c'
    // ) {
    //   Alert.alert('Th??ng b??o', 'Vui l??ng ch???n tr???ng th??i chuy???n c??ng t??c');
    // } else if (
    //   employee.trangthai === 'Chuy???n c??ng t??c' &&
    //   storageemployee.trangthai === 'Ngh??? vi???c'
    // ) {
    //   Alert.alert('Th??ng b??o', 'Tr???ng th??i kh??ng ph?? h???p');
    // } else {

    // }
  };

  const openGallery = async () => {
    const options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
      includeBase64: true,
    };

    launchImageLibrary(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const uri = response.assets[0].uri;
        const type = response.assets[0].type;
        const size = response.assets[0].fileSize;
        const name = response.assets[0].fileName;
        const source = {uri, type, size, name};
        console.log('source', source);
        handleUpload(source);
      }
    });
  };

  //---------------------------------------//

  const handleUpload = async file => {
    const token = await AsyncStorage.getItem('token');

    try {
      if (!file) return alert('File kh??ng t???n t??i');

      if (file.size > 1024 * 1024) return alert('Size qu?? l???n'); //1mb

      if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        return alert('?????nh d???ng file kh??ng ????ng');

      let formData = new FormData();
      formData.append('file', file);

      //X??t n???u c?? ???? c?? ???nh v?? c???p nh???t ???nh m???i th?? x??a ???nh c?? tr??n cloudinary ??i
      if (employee.images.public_id !== '') {
        axios
          .post(
            `${APIDestroy}`,
            {
              public_id: employee.images.public_id,
            },
            {headers: {Authorization: token}},
          )
          .then(() => {});
      }

      const res = await axios.post(`${APIUpload}`, formData, {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: token,
        },
      });

      setEmployee({...employee, images: res.data});
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <View>
      <ScrollView>
        <Text
          style={{
            display: 'flex',
            marginTop: 20,
            marginBottom: 20,
            marginLeft: 'auto',
            marginRight: 'auto',
            fontSize: 20,
            fontWeight: '300',
          }}>
          C???p Nh???t Th??ng Tin Nh??n Vi??n
        </Text>
        <View style={{display: 'flex', justifyContent: 'flex-end'}}>
          <View style={styles.rowInput}>
            <Text>H??? t??n</Text>
            <TextInput
              style={styles.textInput}
              placeholder="H??? t??n"
              value={employee.hoten}
              onChangeText={text => setEmployee({...employee, hoten: text})}
            />
          </View>

          <View style={styles.rowInput}>
            <Text>?????i l??</Text>
            <TextInput
              style={styles.textInput}
              placeholder="T??n ?????i l??"
              value={
                route.params.daily === undefined
                  ? route.params.nhanvien.madaily.tendl
                  : route.params.daily.tendl
              }
              editable={false}
              //  onChangeText={(text) =>  setMaDL(text)}
            />
          </View>

          <View
            style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 30}}>
            <Button
              buttonStyle={styles.buttonAction}
              title="Ch???n ?????i l??"
              onPress={() => {
                navigation.navigate('DanhSachDaiLy', {page: 'EditEmployee'});
              }}
            />
          </View>

          <View style={styles.rowInput}>
            <Text>?????a ch???</Text>
            <TextInput
              style={styles.textInput}
              placeholder="?????a ch???"
              value={employee.diachi}
              //  onChangeText={(text) =>  setDiaChi(text)}
              onChangeText={text => setEmployee({...employee, diachi: text})}
            />
          </View>

          <View style={styles.rowInput}>
            <Text>S??T</Text>
            <TextInput
              style={styles.textInput}
              placeholder="S??? ??i???n tho???i"
              value={employee.sodienthoai}
              //  onChangeText={(text) =>  setSDT(text)}
              onChangeText={text =>
                setEmployee({...employee, sodienthoai: text})
              }
            />
          </View>

          <View style={styles.rowInput}>
            <Text>CMND</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ch???ng minh nh??n d??n"
              value={employee.cmnd}
              maxLength={9}
              keyboardType="numeric"
              //  onChangeText={(text) =>  setCMND(text)}
              onChangeText={text => setEmployee({...employee, cmnd: text})}
            />
          </View>

          <View style={styles.rowInput}>
            <Text>Email</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ch???ng minh nh??n d??n"
              value={employee.email}
              maxLength={32}
              keyboardType="numeric"
              //  onChangeText={(text) =>  setCMND(text)}
              onChangeText={text => setEmployee({...employee, email: text})}
            />
          </View>

          <View style={styles.rowInput}>
            <Text>Gi???i t??nh</Text>
            <Text>Nam</Text>
            <CheckBox
              // disabled={false}
              value={toggleSex}
              onValueChange={() => {
                if (employee.gioitinh === 'nam') {
                  setEmployee({...employee, gioitinh: 'n???'});
                  setToggleSex(false);
                  // setToggleAdmin(false);
                  // setToggleUser(true);
                  // setRole('user')
                } else if (employee.gioitinh === 'n???') {
                  setEmployee({...employee, gioitinh: 'nam'});
                  setToggleSex(true);
                  // setToggleAdmin(true);
                  // setToggleUser(false);
                  // setRole('admin')
                }
              }}
            />
            <Text>N???</Text>
            <CheckBox
              disabled={false}
              value={!toggleSex}
              onValueChange={() => {
                if (employee.gioitinh === 'nam') {
                  setEmployee({...employee, gioitinh: 'n???'});
                  setToggleSex(false);
                  // setToggleAdmin(false);
                  // setToggleUser(true);
                  // setRole('user')
                } else if (employee.gioitinh === 'n???') {
                  setEmployee({...employee, gioitinh: 'nam'});
                  console.log('toggleRole : ', toggleSex);
                  setToggleSex(true);
                }
              }}
            />
          </View>

          <View style={styles.rowInput}>
            <Text>Quy???n</Text>
            <Text>Admin</Text>
            <CheckBox
              // disabled={false}
              value={toggleRole}
              onValueChange={() => {
                if (employee.role === 'admin') {
                  setEmployee({...employee, role: 'user'});
                  console.log('toggleRole : ', toggleRole);
                  setToggleRole(false);
                  // setToggleAdmin(false);
                  // setToggleUser(true);
                  // setRole('user')
                } else if (employee.role === 'user') {
                  setEmployee({...employee, role: 'admin'});
                  console.log('toggleRole : ', toggleRole);
                  setToggleRole(true);
                  // setToggleAdmin(true);
                  // setToggleUser(false);
                  // setRole('admin')
                }
              }}
            />
            <Text>User</Text>
            <CheckBox
              disabled={false}
              value={!toggleRole}
              onValueChange={() => {
                if (employee.role === 'admin') {
                  setEmployee({...employee, role: 'user'});
                  console.log('toggleRole : ', toggleRole);
                  setToggleRole(false);
                  // setToggleAdmin(false);
                  // setToggleUser(true);
                  // setRole('user')
                } else if (employee.role === 'user') {
                  setEmployee({...employee, role: 'admin'});
                  console.log('toggleRole : ', toggleRole);
                  setToggleRole(true);
                  // setToggleAdmin(true);
                  // setToggleUser(false);
                  // setRole('admin')
                }
              }}
            />
          </View>

          <View style={styles.rowInput}>
            <Text>Tr???ng th??i</Text>
            <Picker
              style={styles.pickerDropdown}
              selectedValue={employee.trangthai}
              onValueChange={itemValue =>
                setEmployee({...employee, trangthai: itemValue})
              }>
              <Picker.Item label="??ang l??m" value="??ang l??m" />
              <Picker.Item label="Chuy???n c??ng t??c" value="Chuy???n c??ng t??c" />
              <Picker.Item label="Ngh??? vi???c" value="Ngh??? vi???c" />
            </Picker>
          </View>

          <View>
            <Button
              title="Th??m ???nh"
              buttonStyle={styles.buttonAddPicture}
              onPress={() => {
                openGallery();
              }}
            />
          </View>

          <View
            style={{
              width: 300,
              height: 240,
              display: 'flex',
              justifyContent: 'center',
              textAlign: 'center',
              alignItems: 'center',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 40,
              marginBottom: 40,
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: '#999',
              borderRadius: 8,
            }}>
            <Image
              source={{uri: employee.images.url}}
              style={{
                width: 300,
                height: 240,
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center',
                alignItems: 'center',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 40,
                marginBottom: 40,
                borderRadius: 8,
              }}
            />
          </View>
        </View>

        <View style={styles.groupButtonAction}>
          <Button
            buttonStyle={styles.buttonAction}
            title="C???p nh???t"
            onPress={() => {
              SuaNhanVien();
            }}
          />

          <Button
            buttonStyle={styles.buttonAction}
            title="H???y"
            onPress={() => {
              navigation.navigate('NhanVien');
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rowInput: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    width: 70,
  },
  textInput: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#999',
    borderRadius: 8,
    width: 240,
    height: 40,
    paddingLeft: 10,
  },
  groupButtonAction: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginBottom: 20,
  },
  buttonAction: {
    width: 120,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#1b94ff',
  },
  buttonAddPicture: {
    width: 120,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#1b94ff',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  pickerDropdown: {
    width: 230,
    height: 50,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 8,
    borderColor: '#000',
    backgroundColor: '#dbdbdb',
    color: '#000',
  },
});
