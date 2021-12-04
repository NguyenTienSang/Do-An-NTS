import { useState, useEffect } from "react";
import axios from "axios";

function WareHouseAPI() {
  const [warehouses, setWareHouses] = useState([]);
  const [callback, setCallback] = useState(false);

    const getWareHouses = async () => {
      const res = await axios.get('/api/kho');
      setWareHouses(res.data);
      console.log('kho : ',res.data)
    };
  
 useEffect(() => {
  getWareHouses()
 },[callback])

  return {
    warehouses: [warehouses,setWareHouses],
    callback: [callback, setCallback],
  }
}

export default WareHouseAPI;
