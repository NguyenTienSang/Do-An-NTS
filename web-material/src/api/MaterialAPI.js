import { useState, useEffect } from "react";
import axios from "axios";

function MaterialsAPI() {
  const [materials, setMaterials] = useState([]);
  const [callback, setCallback] = useState(false);

    const getMaterials = async () => {
      const res = await axios.get('/api/vattu');
      setMaterials(res.data);
    };
  
 useEffect(() => {
    getMaterials()
 },[callback])

  return {
    materials: [materials, setMaterials],
    callback: [callback, setCallback],
  }
}

export default MaterialsAPI;
