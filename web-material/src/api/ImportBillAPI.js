import { useState, useEffect } from "react";
import axios from "axios";

function ImportBillAPI() {
  const [importbills, setImportBills] = useState([]);
  const [callback, setCallback] = useState(false);

    const getImportBills = async () => {
      const res = await axios.get('/api/phieunhap');
      setImportBills(res.data);

    };
  
 useEffect(() => {
  getImportBills()
 },[callback])

 


  return {
    importbills: [importbills,setImportBills],
    callback: [callback, setCallback]
  }
}

export default ImportBillAPI;
