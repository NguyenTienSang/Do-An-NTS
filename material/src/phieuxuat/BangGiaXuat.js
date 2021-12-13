import axios from 'axios';
import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import APISTISTICWAREHOUSE from '../api';
// import APISTISTICWAREHOUSE
import Header from './../components/Header';
import {GlobalState} from '../GlobalState';
import {APISTISTICWAREHOUSE} from './../api/API';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function BangGiaXuat({navigation, route}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [materials] = state.materialAPI.materials;
  const [materialsfilter, setMaterialsFilter] = useState(null);

  const Format = number => {
    if (number >= 0) {
      return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.') + ' VND';
    } else
      return (
        '-' + String(number * -1).replace(/(.)(?=(\d{3})+$)/g, '$1.') + ' VND'
      );
  };

  function onClickAddCart(data) {
    AsyncStorage.setItem('kt', 'themvt');
    const itemcart = {
      material: data,
      quantity: 1,
    };
    // SetGiaTri();
    AsyncStorage.getItem('cart')
      .then(datacart => {
        if (datacart !== null) {
          let check = 0;
          const cart = JSON.parse(datacart);
          cart.map(item => {
            if (item.material._id == itemcart.material._id) {
              item.quantity++;
              check = 1;
            }
          });
          if (check == 0) {
            cart.push(itemcart);
          }
          AsyncStorage.setItem('cart', JSON.stringify(cart));
        } else {
          const cart = [];
          cart.push(itemcart);
          AsyncStorage.setItem('cart', JSON.stringify(cart));
        }
        // alert("Add Cart")
      })
      .catch(err => {
        alert(err);
      });
  }

  useEffect(async () => {
    const res = await axios.post(`${APISTISTICWAREHOUSE}`, {
      madailyfilter: route.params.madaily,
      makhofilter: route.params.makho,
    });
    setMaterialsFilter(res.data);
  }, []);

  return (
    <View style={{flex: 1}}>
      <Header title="Trở về" type="arrow-left" navigation={navigation} />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={styles.title}>Bảng Giá Xuất</Text>

        <ScrollView style={{paddingLeft: 5, paddingRight: 5}}>
          <View style={styles.listPrice}>
            {materialsfilter ? (
              materialsfilter?.map(item => (
                <View key={item._id}>
                  <View
                    style={{
                      borderWidth: 1,
                      borderStyle: 'solid',
                      borderColor: '#1b94ff',
                      borderRadius: 5,
                      marginBottom: 20,
                    }}>
                    <View
                      style={{display: 'flex', flex: 1, flexDirection: 'row'}}>
                      <Image
                        style={styles.image}
                        source={{uri: item.images.url}}
                      />

                      <View
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'column',
                        }}>
                        <Button
                          title="Thêm Vào Phiếu"
                          buttonStyle={styles.buttonOption}
                          onPress={() => {
                            onClickAddCart(item);
                            navigation.navigate('LapPhieuXuat', {id: item._id});
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.thonTinSP}>
                      <View>
                        <Text
                          style={{
                            color: '#000',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                          }}>
                          Tên: {item.tenvt}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.thonTinSP}>
                      <View>
                        <Text
                          style={{
                            color: '#000',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                          }}>
                          SL Tồn: {item.soluong} {item.donvi}
                        </Text>
                      </View>
                      <View>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            color: '#000',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                          }}>
                          <Text>Giá Nhập : {Format(item.gianhap)}</Text>
                          <Text>/{item.donvi}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
                <Text style={{fontSize: 20}}>Kho chưa có vật tư</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: '400',
    paddingTop: 10,
    paddingBottom: 10,
  },
  optionsSelect: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    paddingBottom: 15,
  },
  listPrice: {
    width: SCREEN_WIDTH,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  image: {
    height: 150,
    width: 260,
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 3,
    marginTop: 5,
    marginBottom: 5,
  },
  thonTinSP: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  giaSP: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    textAlign: 'center',
    alignItems: 'center',
    color: 'red',
  },
  buttonOption: {
    width: 100,
    height: 60,
    borderRadius: 5,
    backgroundColor: '#1b94ff',
    marginRight: 5,
    marginLeft: 5,
  },
});
