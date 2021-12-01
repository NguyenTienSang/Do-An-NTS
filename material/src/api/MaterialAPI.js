import { useState, useEffect } from "react";
import axios from "axios";

function MaterialAPI() {
  const [materials, setMaterials] = useState();
  const [callback, setCallback] = useState(false);

    const getMaterials = async () => {
      const res = await axios.get('http://192.168.1.4:5000/api/vattu');
    
      setMaterials(res.data);
      // console.log('test callback1111111111111111111')
    };
  
 useEffect(() => {
   getMaterials()
 },[callback])

  return {
    materials: [materials, setMaterials],
    callback: [callback, setCallback],
  }
}

export default MaterialAPI;
