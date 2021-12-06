import {useState, useEffect} from 'react';
import axios from 'axios';
import APISTATISTIC from './API';

function StatisticAPI() {
  const [statisticmaterials, setStatisticMaterial] = useState([]);
  const [callback, setCallback] = useState(false);

  const statisticMaterial = async () => {
    const res = await axios.post(`${APISTATISTIC}`, {});
    setStatisticMaterial(res.data);
  };

  const statisticEmployeeImportBill = async () => {};

  useEffect(() => {
    statisticMaterial();
  }, [callback]);

  return {
    statisticmaterials: [statisticmaterials, setStatisticMaterial],
    callback: [callback, setCallback],
  };
}

export default StatisticAPI;
