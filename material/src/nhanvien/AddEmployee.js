import axios from 'axios';
import React, {useContext, useState, useEffect} from 'react';
import {Picker} from '@react-native-picker/picker';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';

import {GlobalState} from '../GlobalState';
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import CheckBox from '@react-native-community/checkbox';
import {APIThemNhanVien} from '../api/API';
import {APIUpload} from '../api/API';
import {APIDestroy} from '../api/API';
import Header from '../components/Header';

const initialEmployee = {
  hoten: '',
  madaily: '',
  diachi: '',
  username: '',
  password: '',
  gioitinh: 'nam',
  role: 'admin',
  sodienthoai: '',
  cmnd: '',
  email: '',
  trangthai: 'Đang làm',
  images: {
    public_id: '',
    url: '',
  },
};

export default function AddEmployee({navigation, route}) {
  const state = useContext(GlobalState);
  const [employee, setEmployee] = useState(initialEmployee);
  const [callback, setCallback] = state.employeeAPI.callback;
  const [token] = state.token;
  const [toggleSex, setToggleSex] = useState(true);

  const [toggleRole, setToggleRole] = useState(false);

  //Kiểm tra nếu có truyền vào param thì gắn mã đại lý
  if (route.params !== undefined) {
    employee.madaily = route.params.daily._id;
    console.log('route.params.daily._id : ', route.params.daily._id);
  }
  const ThemNhanVien = async () => {
    axios
      .post(
        `${APIThemNhanVien}`,
        {...employee},
        {
          headers: {Authorization: token},
        },
      )
      .then(res => {
        Alert.alert('Thông báo', res.data.message, [
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
        Alert.alert('Thông báo', error.response.data.message);
      });
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
        // console.log('data response.assets : ',response.assets[0]);

        const uri = response.assets[0].uri;
        const type = response.assets[0].type;
        const size = response.assets[0].fileSize;
        const name = response.assets[0].fileName;
        const source = {uri, type, size, name};
        handleUpload(source);
      }
    });
  };

  //---------------------------------------//

  const handleUpload = async file => {
    const token = await AsyncStorage.getItem('token');

    try {
      if (!file) return alert('File không tồn tài');

      if (file.size > 1024 * 1024) return alert('Size quá lớn'); //1mb

      if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        return alert('Định dạng file không đúng');

      let formData = new FormData();
      formData.append('file', file);

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
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header title="Trở về" type="arrow-left" navigation={navigation} />
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
          Thêm Nhân Viên
        </Text>
        <View style={{display: 'flex', justifyContent: 'flex-end'}}>
          <View style={styles.rowInput}>
            <Text style={styles.label}>Họ tên</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Họ tên"
              value={employee.hoten}
              onChangeText={text => setEmployee({...employee, hoten: text})}
            />
          </View>

          <View style={styles.rowInput}>
            <Text style={styles.label}>Đại lý</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Tên đại lý"
              value={route.params === undefined ? '' : route.params.daily.tendl}
              editable={false}
            />
          </View>

          <View
            style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 30}}>
            <Button
              buttonStyle={styles.buttonAction}
              title="Chọn đại lý"
              onPress={() => {
                navigation.navigate('DanhSachDaiLy', {page: 'AddEmployee'});
              }}
            />
          </View>

          <View style={styles.rowInput}>
            <Text style={styles.label}>Địa chỉ </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Địa chỉ"
              value={employee.diachi}
              onChangeText={text => setEmployee({...employee, diachi: text})}
            />
          </View>

          <View style={styles.rowInput}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Username"
              value={employee.username}
              onChangeText={text => setEmployee({...employee, username: text})}
            />
          </View>

          <View style={styles.rowInput}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Mật khẩu"
              value={employee.password}
              secureTextEntry={true}
              onChangeText={text => setEmployee({...employee, password: text})}
            />
          </View>

          <View style={styles.rowInput}>
            <Text style={styles.label}>SĐT</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Số điện thoại"
              value={employee.sodienthoai}
              maxLength={10}
              keyboardType="numeric"
              onChangeText={text =>
                setEmployee({...employee, sodienthoai: text})
              }
            />
          </View>

          <View style={styles.rowInput}>
            <Text style={styles.label}>CMND</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Chứng minh nhân dân"
              value={employee.cmnd}
              maxLength={9}
              keyboardType="numeric"
              onChangeText={text => setEmployee({...employee, cmnd: text})}
            />
          </View>

          <View style={styles.rowInput}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Chứng minh nhân dân"
              value={employee.email}
              maxLength={32}
              keyboardType="numeric"
              onChangeText={text => setEmployee({...employee, email: text})}
            />
          </View>

          <View style={styles.rowInput}>
            <Text>Giới tính</Text>
            <Text>Nam</Text>
            <CheckBox
              // disabled={false}
              value={toggleSex}
              onValueChange={() => {
                if (employee.gioitinh === 'nam') {
                  setEmployee({...employee, gioitinh: 'nữ'});
                  setToggleSex(false);
                  // setToggleAdmin(false);
                  // setToggleUser(true);
                  // setRole('user')
                } else if (employee.gioitinh === 'nữ') {
                  setEmployee({...employee, gioitinh: 'nam'});
                  setToggleSex(true);
                  // setToggleAdmin(true);
                  // setToggleUser(false);
                  // setRole('admin')
                }
              }}
            />
            <Text>Nữ</Text>
            <CheckBox
              disabled={false}
              value={!toggleSex}
              onValueChange={() => {
                if (employee.gioitinh === 'nam') {
                  setEmployee({...employee, gioitinh: 'nữ'});
                  setToggleSex(false);
                  // setToggleAdmin(false);
                  // setToggleUser(true);
                  // setRole('user')
                } else if (employee.gioitinh === 'nữ') {
                  setEmployee({...employee, gioitinh: 'nam'});
                  console.log('toggleRole : ', toggleSex);
                  setToggleSex(true);
                }
              }}
            />
          </View>

          <View style={styles.rowInput}>
            <Text>Quyền</Text>
            <Text>Admin</Text>
            <CheckBox
              // disabled={false}
              value={toggleRole}
              onValueChange={() => {
                if (employee.role === 'admin') {
                  setEmployee({...employee, role: 'user'});
                  setToggleRole(false);
                } else if (employee.role === 'user') {
                  setEmployee({...employee, role: 'admin'});
                  setToggleRole(true);
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
                  setToggleRole(false);
                } else if (employee.role === 'user') {
                  setEmployee({...employee, role: 'admin'});
                  setToggleRole(true);
                }
              }}
            />
          </View>

          <View>
            <Button
              title="Thêm Ảnh"
              buttonStyle={styles.buttonAddPicutre}
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
              source={{uri: employee.images.url ? employee.images.url : null}}
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
            title="Thêm"
            onPress={() => {
              ThemNhanVien();
            }}
          />

          <Button
            buttonStyle={styles.buttonAction}
            title="Hủy"
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
  buttonAddPicutre: {
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
