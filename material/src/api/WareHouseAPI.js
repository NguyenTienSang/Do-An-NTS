import {useState, useEffect} from 'react';
import axios from 'axios';
import {APIKho} from './API';

function WareHouseAPI() {
  const [warehouses, setWareHouses] = useState([]);
  const [callback, setCallback] = useState(false);

  const getWareHouses = async () => {
    const res = await axios.get(`${APIKho}`);
    console.log('res.data : ', res.data);
    setWareHouses(res.data);
  };

  useEffect(() => {
    getWareHouses();
  }, [callback]);

  return {
    warehouses: [warehouses, setWareHouses],
    callback: [callback, setCallback],
  };
}

export default WareHouseAPI;
