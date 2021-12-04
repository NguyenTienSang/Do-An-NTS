import { useState, useEffect } from "react";
import axios from "axios";

function StatisticAPI() {
  const [statisticmaterials, setStatisticMaterial] = useState([]);
  const [callback, setCallback] = useState(false);

    const statisticMaterial = async () => {
      const res = await axios.post('http://192.168.1.5:5000/api/api/thongke',{
          
      });
      setStatisticMaterial(res.data);
    };

    const statisticEmployeeImportBill = async () => {
          
    }
  
 useEffect(() => {
    statisticMaterial()
 },[callback])

 


  return {
    statisticmaterials: [statisticmaterials,setStatisticMaterial],
    callback: [callback, setCallback]
  }
}

export default StatisticAPI;