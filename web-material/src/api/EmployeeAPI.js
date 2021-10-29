import { useState, useEffect } from "react";
import axios from "axios";

function EmployeeAPI() {
  const [employees, setEmployees] = useState([]);
  const [callback, setCallback] = useState(false);

    const getEmployees = async () => {
      const res = await axios.get('/api/nhanvien');
      console.log('Danh sách nhân viên : ',res.data);
      setEmployees(res.data);
    };
  
 useEffect(() => {
  getEmployees()
 },[callback])

  return {
    employees: [employees, setEmployees],
    callback: [callback, setCallback],
  }
}

export default EmployeeAPI;
