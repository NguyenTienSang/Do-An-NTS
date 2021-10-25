import { useState, useEffect } from "react";
import axios from "axios";

function WareHouseAPI() {
  const [warehouses, setWareHouses] = useState([]);

    const getWareHouses = async () => {
      const res = await axios.get('/api/kho');
      setWareHouses(res.data);
    };
  
 useEffect(() => {
  getWareHouses()
 },[])

  return {
    warehouses: [warehouses,setWareHouses]
  }
}

export default WareHouseAPI;
