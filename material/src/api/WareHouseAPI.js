import { useState, useEffect } from "react";
import axios from "axios";

function WareHouseAPI() {
  const [warehouses, setWareHouses] = useState([]);
  const [callback, setCallback] = useState(false);

    const getWareHouses = async () => {
      const res = await axios.get('http://192.168.1.5:5000/api/kho');
      setWareHouses(res.data);
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
