import React from 'react';

import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {colors} from './src/global/styles'; 
import { DataProvider } from './src/GlobalState';
import RootNavigator from './src/navigation/rootNavigator';

export default function App() {
  return (
    <DataProvider>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor={colors.statusbar} />
          <RootNavigator/> 
        </View>
    </DataProvider>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
});
