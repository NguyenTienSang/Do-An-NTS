import React, {useContext, useState, useEffect} from 'react';
import axios from 'axios';
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
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import {APIDaiLy} from '../api/API';

export default function EditStore({navigation, route}) {
  console.log('Data Item : ', route);
  console.log('data image : ', route.params.item);
  const state = useContext(GlobalState);

  const [store, setStore] = useState({
    _id: route.params.item._id,
    tendl: route.params.item.tendl,
    diachi: route.params.item.diachi,
    sodienthoai: route.params.item.sodienthoai,
    images: route.params.item.images,
    tendlcheck: route.params.item.tendl,
  });

  // const [tendl,setTenDL] = useState("");
  // const [diachi,setDiaChi] = useState("");
  // const [sodienthoai,setSDT] = useState("");
  // const [images, setImages] = useState("");
  // const [tendl,setTenDL] = useState(route.params.tendl);
  // const [diachi,setDiaChi] = useState(route.params.diachi);
  // const [sodienthoai,setSDT] = useState(route.params.sodienthoai);
  // const [images, setImages] = useState(route.params.images);
  const [token] = state.token;
  console.log('Token : ', token);
  // const [imageData, setImageData] = useState(route.params.images);

  const SuaDaiLy = async () => {
    // const token = await AsyncStorage.getItem("token");

    console.log('Bắt đầu sửa : ', token);
    console.log('Dữ liệu store : ', store);
    axios
      .put(
        `http://192.168.1.4:5000/api/daily/${store._id}`,
        {...store},
        {
          headers: {Authorization: token},
        },
      )
      .then(res => {
        console.log('res : ', res);
        Alert.alert('Thông báo', res.data.message, [
          {
            text: 'OK',
            onPress: () => {
              navigation.replace('DaiLy');
            },
          },
        ]);
      })
      .catch(error => {
        console.log('error : ', error);
        Alert.alert('Thông báo', error.response.data.message);
      });
  };

  const openGallery = async public_id => {
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
        handleUpload(source, public_id);
      }
    });
  };

  const handleUpload = async (file, public_id) => {
    //Cập nhật ảnh
    //B1: Xóa ảnh cũ đi
    //B2: Cập nhật ảnh mới lên cloudinary
    const token = await AsyncStorage.getItem('token');

    axios
      .post(
        'http://192.168.1.4:5000/api/destroy',
        {
          public_id,
        },
        {headers: {Authorization: token}},
      )
      .then(async () => {
        //Xóa thành công -> Cập nhật ảnh mới lên cloudinary
        try {
          // if (!isAdmin) return alert("Bạn không phải là Admin");
          // const file = e.target.files[0];

          if (!file) return alert('File không tồn tài');

          if (file.size > 1024 * 1024) return alert('Size quá lớn'); //1mb

          if (file.type !== 'image/jpeg' && file.type !== 'image/png')
            return alert('Định dạng file không đúng');

          let formData = new FormData();
          formData.append('file', file);
          console.log('data file : ', file);
          // setLoading(true);
          console.log('-------------- test --------------');

          const res = await axios.post(
            'http://192.168.1.4:5000/api/upload',
            formData,
            {
              headers: {
                'content-type': 'multipart/form-data',
                Authorization: token,
              },
            },
          );
          // setLoading(false);
          console.log('dữ liệu ảnh : ', res.data);
          console.log('dữ liệu ảnh url : ', res.data.url);

          // setImages(res.data);
          setStore({...store, images: res.data});
        } catch (err) {
          alert(err.response.data.message);
        }
      })
      .catch(error => {
        Alert.alert('Thông báo Thất Bại 2', error.response.data.message);
      });
  };

  return (
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
        Sửa Thông Tin Đại Lý
      </Text>
      <View style={{display: 'flex', justifyContent: 'flex-end'}}>
        <View style={styles.rowInput}>
          <Text>Tên đại lý</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Tên đại lý"
            value={store.tendl}
            onChangeText={text => setStore({...store, tendl: text})}
          />
        </View>

        <View style={styles.rowInput}>
          <Text>Địa chỉ</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Địa chỉ"
            value={store.diachi}
            onChangeText={text => setStore({...store, diachi: text})}
          />
        </View>

        <View style={styles.rowInput}>
          <Text>SĐT </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Số điện thoại"
            value={store.sodienthoai}
            maxLength={10}
            //  onChangeText={(text) =>  setSDT(text)}
            onChangeText={text => setStore({...store, sodienthoai: text})}
          />
        </View>

        <View>
          <Button
            title="Cập Nhật Ảnh"
            buttonStyle={styles.buttonAddPicutre}
            onPress={() => {
              openGallery(store.images.public_id);
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
            borderColor: '#333',
          }}>
          <Image
            source={{uri: store.images ? store.images.url : ''}}
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
            }}
          />
        </View>
      </View>

      <View style={styles.groupButtonAction}>
        <Button
          buttonStyle={styles.buttonAction}
          title="Cập nhật"
          onPress={() => {
            SuaDaiLy();
          }}
        />

        <Button
          buttonStyle={styles.buttonAction}
          title="Hủy"
          onPress={() => {
            navigation.navigate('DaiLy');
          }}
        />
      </View>
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
    borderColor: '#333',
    width: 220,
    height: 40,
  },
  groupButtonAction: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
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
