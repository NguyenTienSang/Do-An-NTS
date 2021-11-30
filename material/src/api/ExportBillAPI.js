import { useState, useEffect } from "react";
import axios from "axios";
import { APIPX } from "./API";

function ExportBillAPI() {
  const [exportbills, setExportBills] = useState([]);
  const [callback, setCallback] = useState(false);

    const getExportBills = async () => {
      const res = await axios.get(`${APIPX}`);
      setExportBills(res.data);
    };
  
 useEffect(() => {
  getExportBills()
 },[callback])

  return {
    exportbills: [exportbills,setExportBills],
    callback: [callback, setCallback]
  }
}

export default ExportBillAPI;
