import {useState, useEffect} from 'react';
import axios from 'axios';
import {APIVattu} from './API';

function MaterialAPI() {
  const [materials, setMaterials] = useState();
  const [callback, setCallback] = useState(false);

  const getMaterials = async () => {
    const res = await axios.get(`${APIVattu}`);

    setMaterials(res.data);
    // console.log('test callback1111111111111111111')
  };

  useEffect(() => {
    getMaterials();
  }, [callback]);

  return {
    materials: [materials, setMaterials],
    callback: [callback, setCallback],
  };
}

export default MaterialAPI;
