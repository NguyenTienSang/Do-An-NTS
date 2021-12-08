import {useState, useEffect} from 'react';
import axios from 'axios';
import {APIDaiLy} from './API';

function StoresAPI() {
  const [stores, setStores] = useState([]);
  const [callback, setCallback] = useState(false);

  const getStores = async () => {
    const res = await axios.get(`${APIDaiLy}`);
    console.log(res.data);
    setStores(res.data);
  };

  useEffect(() => {
    getStores();
  }, [callback]);

  return {
    stores: [stores, setStores],
    callback: [callback, setCallback],
  };
}

export default StoresAPI;
