import { useState, useEffect } from "react";
import axios from "axios";

function MaterialAPI() {
  const [materials, setMaterials] = useState([]);
  const [callback, setCallback] = useState(false);

    const getMaterials = async () => {
      const res = await axios.get('/api/vattu');
      setMaterials(res.data);
      console.log('test callback1111111111111111111')
    };
  
 useEffect(() => {
   getMaterials()
   console.log('gọi callback : ',materials.length)
 },[callback])

  return {
    materials: [materials, setMaterials],
    callback: [callback, setCallback],
  }
}

export default MaterialAPI;
