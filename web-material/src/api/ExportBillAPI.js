import { useState, useEffect } from "react";
import axios from "axios";

function ExportBillAPI() {
  const [importbills, setExportBills] = useState([]);
  const [callback, setCallback] = useState(false);

    const getExportBills = async () => {
      const res = await axios.get('/api/phieuxuat');
      setExportBills(res.data);
    };
  
 useEffect(() => {
  getExportBills()
 },[callback])

  return {
    exportbills: [importbills,setExportBills],
    callback: [callback, setCallback]
  }
}

export default ExportBillAPI;
