import axios from 'axios';
import React, {useContext, useState, useEffect} from 'react';
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

const initialWareHouse = {
  tenkho: '',
  madaily: '',
  diachi: '',
  sodienthoai: 0,
  trangthai: 'Đang hoạt động',
  images: {
    public_id: '',
    url: '',
  },
};

export default function AddKho({navigation, route}) {
  //--------------------------
  const state = useContext(GlobalState);
  const [warehouse, setWareHouse] = useState(initialWareHouse);
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [callback, setCallback] = state.warehouseAPI.callback;

  //-----------------------
  if (route.params !== undefined) {
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
        handleUpload(source);
      }
    });
  };

  const handleUpload = async file => {
    const token = await AsyncStorage.getItem('token');

    try {
      if (!file) return alert('File không tồn tài');

      if (file.size > 1024 * 1024) return alert('Size quá lớn'); //1mb

      if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        return alert('Định dạng file không đúng');

      let formData = new FormData();
      formData.append('file', file);

      if (warehouse.images.public_id !== '') {
        axios
          .post(
            `${APIDestroy}`,
            {
              public_id: warehouse.images.public_id,
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
      setWareHouse({...warehouse, images: res.data});
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const ThemKho = async () => {
    try {
      const res = await axios.post(
        `${APIKho}`,
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
    } catch (err) {
      Alert.alert('Thông báo', err.response.data.message, [
        {
          text: 'OK',
          onPress: () => {
            // setCallback(!callback);
            // navigation.replace('Kho');
          },
        },
      ]);
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header title="Trở về" type="arrow-left" navigation={navigation} />
      <ScrollView>
        <View>
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
            Thêm Kho
          </Text>
          <View style={{display: 'flex', justifyContent: 'flex-end'}}>
            <View style={styles.rowInput}>
              <Text>Tên kho</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Tên kho"
                value={warehouse.tenkho}
                onChangeText={text =>
                  setWareHouse({...warehouse, tenkho: text})
                }
              />
            </View>

            <View style={styles.rowInput}>
              <Text>Đại lý</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Nhập đại lý"
                value={
                  route.params === undefined ? '' : route.params.daily.tendl
                }
                editable={false}
                //  onChangeText={(text) =>  setMaDL(text)}
              />
            </View>

            <View
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: 30,
              }}>
              <Button
                buttonStyle={styles.buttonAction}
                title="Chọn đại lý"
                onPress={() => {
                  navigation.navigate('DanhSachDaiLy', {page: 'AddKho'});
                }}
              />
            </View>

            <View style={styles.rowInput}>
              <Text>Địa chỉ</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Địa chỉ"
                value={warehouse.diachi}
                onChangeText={text =>
                  setWareHouse({...warehouse, diachi: text})
                }
              />
            </View>

            <View style={styles.rowInput}>
              <Text>SĐT</Text>
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
                source={{
                  uri: warehouse.images.url ? warehouse.images.url : null,
                }}
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
                ThemKho();
              }}
            />

            <Button
              buttonStyle={styles.buttonAction}
              title="Hủy"
              onPress={async () => {
                if (warehouse.images.public_id !== '') {
                  try {
                    await axios.post(
                      `${APIDestroy}`,
                      {
                        public_id: warehouse.images.public_id,
                      },
                      {headers: {Authorization: token}},
                    );
                  } catch (error) {
                    Alert.alert('Thông báo', error.response.data.message);
                  }
                }
                navigation.navigate('Kho');
              }}
            />
          </View>
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
});
