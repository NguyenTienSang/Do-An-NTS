import React, {useState} from 'react';

import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Pressable,
  Dimensions,
} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import CountDown from 'react-native-countdown-component';
import HomeHeader from '../components/HomeHeader';
import {colors, parameters} from '../global/styles';
import {filterData, restaurantsData} from '../global/Data';
import {ImagePropTypes} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function UserHomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <HomeHeader navigation={navigation} />
      <ScrollView stickyHeaderIndices={[0]} showsVerticalScrollIndicator={true}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: 120,
          }}>
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginBottom: 24,
            }}>
            <Button
              title="Nhân Viên"
              buttonStyle={styles.taskButton}
              titleStyle={parameters.buttonTitle}
              onPress={() => {
                navigation.navigate('DSNhanVienUser');
              }}></Button>
            <Button
              title="Danh Sách Vật Tư"
              buttonStyle={styles.taskButton}
              titleStyle={parameters.buttonTitle}
              onPress={() => {
                navigation.navigate('ListMaterialUser');
              }}></Button>
          </View>

          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginBottom: 24,
            }}>
            <Button
              title="Phiếu nhập"
              buttonStyle={styles.taskButton}
              titleStyle={parameters.buttonTitle}
              onPress={() => {
                navigation.navigate('PhieuNhap');
              }}></Button>

            <Button
              title="Phiếu xuất"
              buttonStyle={styles.taskButton}
              titleStyle={parameters.buttonTitle}
              onPress={() => {
                navigation.navigate('PhieuXuat');
              }}></Button>
          </View>

          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginBottom: 24,
            }}>
            <Button
              title="Kho"
              buttonStyle={styles.taskButton}
              titleStyle={parameters.buttonTitle}
              onPress={() => {
                navigation.navigate('KhoUser');
              }}></Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  deliveryButton: {
    paddingHorizontal: 20,
    borderRadius: 15,
    paddingVertical: 5,
  },
  deliveryText: {
    marginLeft: 5,
    fontSize: 16,
  },
  filterView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  clockView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    backgroundColor: colors.cardbackground,
    borderRadius: 15,
    paddingHorizontal: 5,
    marginRight: 20,
  },
  addressView: {
    flexDirection: 'row',
    backgroundColor: colors.grey5,
    borderRadius: 15,
    paddingVertical: 3,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTextView: {
    backgroundColor: colors.grey5,
    paddingVertical: 3,
  },
  smallCard: {
    borderRadius: 30,
    backgroundColor: colors.grey5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    width: 80,
    margin: 10,
    height: 100,
  },
  smallCardSelected: {
    borderRadius: 30,
    backgroundColor: colors.buttons,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    width: 80,
    margin: 10,
    height: 100,
  },
  smallCardTextSelected: {
    fontWeight: 'bold',
    color: colors.cardbackground,
  },
  smallCardText: {
    fontWeight: 'bold',
    color: colors.grey2,
  },
  floatButton: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    backgroundColor: 'white',
    elevation: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
  },
  // --------------------------
  taskButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#1b94ff',
    width: 150,
    height: 100,
  },
  taskButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
