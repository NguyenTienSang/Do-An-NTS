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
import {APIUpload, APIDestroy, APIVattu} from '../api/API';
import Header from '../components/Header';

const initialMaterial = {
  tenvt: '',
  donvi: '',
  soluong: 0,
  gianhap: '',
  giaxuat: '',
  trangthai: 'Đang kinh doanh',
  images: {
    public_id: '',
    url: '',
  },
};

export default function AddPriceMaterial({navigation}) {
  const state = useContext(GlobalState);
  const [material, setMaterial] = useState(initialMaterial);
  const [images, setImages] = useState(false);
  const [token] = state.token;

  // const param = useParams();

  const [materials] = state.materialAPI.materials;
  const [searchTerm, setSearchTerm] = useState('');
  const [onEdit, setOnEdit] = useState(false);
  const [callback, setCallback] = state.materialAPI.callback;

  const ThemVatTu = async () => {
    axios
      .post(
        `${APIVattu}`,
        {...material},
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
              navigation.replace('ListMaterial');
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

    try {
      if (!file) return alert('File không tồn tài');

      if (file.size > 1024 * 1024) return alert('Size quá lớn'); //1mb

      if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        return alert('Định dạng file không đúng');

      let formData = new FormData();
      formData.append('file', file);

      if (material.images.public_id !== '') {
        axios
          .post(
            `${APIDestroy}`,
            {
              public_id: material.images.public_id,
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

      setMaterial({...material, images: res.data});
    } catch (err) {
      alert(err.response.data.message);
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
          Thêm Vật Tư
        </Text>
        <View style={{display: 'flex', justifyContent: 'flex-end'}}>
          <View style={styles.rowInput}>
            <Text>Tên vật tư </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Tên vật tư"
              value={material.tenvt}
              onChangeText={text => setMaterial({...material, tenvt: text})}
            />
          </View>

          <View style={styles.rowInput}>
            <Text>Giá nhập </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Giá nhập"
              value={material.gianhap}
              keyboardType="numeric"
              onChangeText={text => setMaterial({...material, gianhap: text})}
            />
          </View>

          <View style={styles.rowInput}>
            <Text>Giá xuất </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Giá xuất"
              value={material.giaxuat}
              keyboardType="numeric"
              onChangeText={text => setMaterial({...material, giaxuat: text})}
            />
          </View>

          <View style={styles.rowInput}>
            <Text>Đơn vị tính</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Đơn vị tính"
              value={material.donvi}
              onChangeText={text => setMaterial({...material, donvi: text})}
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
              source={{uri: material.images.url}}
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
              ThemVatTu();
            }}
          />

          <Button
            buttonStyle={styles.buttonAction}
            title="Hủy"
            onPress={() => {
              navigation.navigate('ListMaterial');
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
