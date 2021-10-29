import { useState, useEffect } from "react";
import axios from "axios";

function ExportBillAPI() {
  const [importbills, setExportBills] = useState([]);

    const getExportBills = async () => {
      const res = await axios.get('/api/phieuxuat');
      setExportBills(res.data);
    };
  
 useEffect(() => {
  getExportBills()
 },[])

  return {
    exportbills: [importbills,setExportBills]
  }
}

export default ExportBillAPI;
