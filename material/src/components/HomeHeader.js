import React from 'react';

import {View, Text, StyleSheet} from 'react-native';
import {Icon, withBadge} from 'react-native-elements';
import {colors, parameters} from '../global/styles';

export default function HomeHeader({props, navigation}) {
  return (
    <View style={styles.header}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 15,
        }}>
        <Icon
          type="material-community"
          name="menu"
          color={colors.cardbackground}
          size={32}
          onPress={() => {
            console.log('test');
            console.log('navigation', navigation);
            navigation.toggleDrawer();
          }}
        />
      </View>

      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            color: colors.cardbackground,
            fontSize: 25,
            fontWeight: 'bold',
          }}>
          Quản Lý Đại Lý Phế Liệu
        </Text>
      </View>

      <View style={{alignItems: 'center', justifyContent: 'center'}}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: colors.buttons,
    height: parameters.headerHeight,
    justifyContent: 'space-between',
    height: 60,
  },
});
