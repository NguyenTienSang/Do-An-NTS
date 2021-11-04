import { useState, useEffect } from "react";
import axios from "axios";

function ImportBillAPI() {
  const [importbills, setImportBills] = useState([]);
  const [ctpn, setCTPN] = useState([]);
    const getImportBills = async () => {
      const res = await axios.get('/api/importbill');
      setImportBills(res.data);
    };
  
 useEffect(() => {
  getImportBills()
 },[])

 const addImportBill = async (material) => {

  const check = ctpn.every((item) => {
    return item._id !== material._id;
  });

  if (check) {
    setCTPN([...ctpn, { ...material, soluong: 1 }]);

    // await axios.patch(
    //   "/importbill/addbill",
    //   { ctpn: [...ctpn, { ...material, soluong: 1 }] },
    //   {
    //     headers: { Authorization: token },
    //   }
    // );
  } else {
    alert("Đã thêm vật tư này vào phiếu.");
  }
};


  return {
    importbills: [importbills,setImportBills],
    addImportBill: addImportBill,
  }
}

export default ImportBillAPI;
