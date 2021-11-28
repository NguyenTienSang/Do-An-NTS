import { useState, useEffect } from "react";
import axios from "axios";

function StoresAPI() {
  const [stores, setStores] = useState([]);
  const [callback, setCallback] = useState(false);

    const getStores = async () => {
      const res = await axios.get('http://192.168.1.10:5000/api/daily');
      console.log(res.data);
      setStores(res.data);
    };
  
 useEffect(() => {
  getStores()
 },[callback])

  return {
    stores: [stores, setStores],
    callback: [callback, setCallback],
  }
}

export default StoresAPI;
