import { useState, useEffect } from "react";
import axios from "axios";

function ImportBillAPI() {
  const [importbills, setImportBills] = useState([]);
  const [callback, setCallback] = useState(false);

    const getImportBills = async () => {
      const res = await axios.get('/api/importbill');
      // console.log('importbills.length api : ',importbills.length)
      setImportBills(res.data);

    };
  
 useEffect(async () => {
  await getImportBills()
  await console.log('gọi callback : ',importbills.length)
 },[callback])

 


  return {
    importbills: [importbills,setImportBills],
    callback: [callback, setCallback]
  }
}

export default ImportBillAPI;
