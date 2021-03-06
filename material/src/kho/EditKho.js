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

import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import {APIKho, APIUpload, APIDestroy, APIVattu} from '../api/API';

import Header from '../components/Header';
import {GlobalState} from '../GlobalState';

export default function EditKho({navigation, route}) {
  const state = useContext(GlobalState);
  const [warehouse, setWareHouse] = useState({
    _id: route.params.kho._id,
    tenkho: route.params.kho.tenkho,
    madaily: route.params.kho.madaily,
    diachi: route.params.kho.diachi,
    sodienthoai: route.params.kho.sodienthoai,
    trangthai: route.params.kho.trangthai,
    images: route.params.kho.images,
    tenkhocheck: route.params.kho.tenkho,
  });
  const [token] = state.token;
  const [callback, setCallback] = state.warehouseAPI.callback;

  //-------------------------

  if (route.params.daily !== undefined) {
    warehouse.madaily = route.params.daily._id;
  }

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
        console.log('source', source);
        handleUpload(source);
      }
    });
  };

  const handleUpload = async file => {
    const token = await AsyncStorage.getItem('token');
    console.log('token : ', token);
    console.log('file data : ', file);

    try {
      if (!file) return alert('File không tồn tài');

      if (file.size > 1024 * 1024) return alert('Size quá lớn'); //1mb

      if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        return alert('Định dạng file không đúng');

      let formData = new FormData();
      formData.append('file', file);
      console.log('data file : ', file);
      // setLoading(true);

      const res = await axios.post(`${APIUpload}`, formData, {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: token,
        },
      });
      // setLoading(false);
      console.log('dữ liệu ảnh : ', res.data);
      console.log('dữ liệu ảnh url : ', res.data.url);


      setWareHouse({...warehouse, images: res.data});
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const SuaKho = async () => {
    try {
      const res = await axios.put(
        `${APIKho}/${warehouse._id}`,
        {...warehouse},
        {
          headers: {Authorization: token},
        },
      );
      Alert.alert('Thông báo', res.data.message, [
        {
          text: 'OK',
          onPress: () => {
            setCallback(!callback);
            navigation.replace('Kho');
          },
        },
      ]);
      //  history.push("/vattu");
    } catch (error) {
      Alert.alert('Lỗi', error.response.data.message);
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
          Sửa Thông Tin Kho
        </Text>
        <View style={{display: 'flex', justifyContent: 'flex-end'}}>
          <View style={styles.rowInput}>
            <Text>Tên kho</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Tên kho"
              value={warehouse.tenkho}
              onChangeText={text => setWareHouse({...warehouse, tenkho: text})}
            />
          </View>

          <View style={styles.rowInput}>
            <Text>Mã đại lý</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Mã đại lý"
              value={
                route.params.daily === undefined
                  ? route.params.kho.madaily.tendl
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
              title="Chọn đại lý"
              onPress={() => {
                navigation.navigate('DanhSachDaiLy', {page: 'EditKho'});
              }}
            />
          </View>

          <View style={styles.rowInput}>
            <Text>Địa chỉ</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Địa chỉ"
              value={warehouse.diachi}
              onChangeText={text => setWareHouse({...warehouse, diachi: text})}
            />
          </View>

          <View style={styles.rowInput}>
            <Text>SĐT </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Số điện thoại"
              value={warehouse.sodienthoai}
              maxLength={10}
              keyboardType="numeric"
              onChangeText={text =>
                setWareHouse({...warehouse, sodienthoai: text})
              }
            />
          </View>

          <View style={styles.rowInput}>
            <Text>Trạng thái</Text>
            <Picker
              style={styles.pickerDropdown}
              selectedValue={warehouse.trangthai}
              onValueChange={itemValue =>
                setWareHouse({...warehouse, trangthai: itemValue})
              }>
              <Picker.Item label="Đang hoạt động" value="Đang hoạt động" />
              <Picker.Item label="Ngừng hoạt động" value="Ngừng hoạt động" />
            </Picker>
          </View>

          <View>
            <Button
              title="Cập nhật ảnh"
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
              source={{uri: warehouse.images.url}}
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
            title="Cập nhật"
            onPress={() => {
              SuaKho();
            }}
          />

          <Button
            buttonStyle={styles.buttonAction}
            title="Hủy"
            onPress={() => {
              navigation.navigate('Kho');
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
  },
  buttonAction: {
    width: 120,
    height: 40,
    marginBottom: 20,
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
