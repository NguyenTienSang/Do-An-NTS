import React, {createContext, useState, useEffect} from 'react';

import UserAPI from './api/UserAPI';
import MaterialAPI from './api/MaterialAPI';
import EmployeeAPI from './api/EmployeeAPI';
import StoresAPI from './api/StoreAPI';
import WareHouseAPI from './api/WareHouseAPI';
import ImportBillAPI from './api/ImportBillAPI';
import ExportBillAPI from './api/ExportBillAPI';
// import StatisticAPI from "./api/StatisticAPI"
import {APIToken} from './api/API';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const GlobalState = createContext();

export const DataProvider = ({children}) => {
  const [token, setToken] = useState(false);

  useEffect(() => {
    const firstLogin = AsyncStorage.getItem('firstLogin');
    if (firstLogin) {
      // console.log('test');
      const refreshToken = async () => {
        const res = await axios.get(`${APIToken}`);
        // console.log('res.data.accesstoken : ', res.data.accesstoken);
        // console.log('nts');
        setToken(res.data.accesstoken);

        setTimeout(() => {
          refreshToken();
        }, 10 * 60 * 1000);
      };
      refreshToken();
    }
  }, []);

  const state = {
    token: [token, setToken],
    materialAPI: MaterialAPI(),
    employeeAPI: EmployeeAPI(),
    storeAPI: StoresAPI(),
    warehouseAPI: WareHouseAPI(),
    importbillAPI: ImportBillAPI(),
    exportbillAPI: ExportBillAPI(),
    // statisticAPI: StatisticAPI(),
    userAPI: UserAPI(token),
  };

  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
