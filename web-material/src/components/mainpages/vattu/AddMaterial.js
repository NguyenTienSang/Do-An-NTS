import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { GlobalState } from "../../../GlobalState";
// import Loading from "../utils/loading/Loading";
import { useHistory, useParams } from "react-router-dom";

const initialMaterial = {
  tenvt:"",
  soluong:"",
  gianhap:0,
  giaxuat:0,
  donvi:"",
};

function AddMaterial(props) {
  const state = useContext(GlobalState);
  const [material, setMaterial] = useState(initialMaterial);
  // const [categories] = state.categoriesAPI.categories;
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  const history = useHistory();
  const param = useParams();

  const [materials] = state.materialAPI.materials;
  const [onEdit, setOnEdit] = useState(false);
  const [callback, setCallback] = state.materialAPI.callback;

  useEffect(() => {
   
    console.log('param.id : ');
    console.log('param.id2 : ',param.id);
    if (param.id) {
      setOnEdit(true);
      // materials.forEach((material) => {
      //   if (material._id === param.id) {
      //     setMaterial(material);
      //     setImages(material.images);
      //   }
      // });
    } else {
      setOnEdit(false);
      setMaterial(initialMaterial);
      setImages(false);
    }

  }, [param.id, materials]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("Bạn không phải là Admin");
      const file = e.target.files[0];

      if (!file) return alert("File không tồn tài");

      if (file.size > 1024 * 1024)
        //1mb
        return alert("Size quá lớn");

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return alert("Định dạng file không đúng");

      let formData = new FormData();
      formData.append("file", file);

      // setLoading(true);
      const res = await axios.post("/api/upload", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });
      // setLoading(false);
      setImages(res.data);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleDestroy = async () => {
    try {
      if (!isAdmin) return alert("Bạn không phải Admin");
      // setLoading(true);
      await axios.post(
        "/api/destroy",
        { public_id: images.public_id },
        {
          headers: { Authorization: token },
        }
      );
      // setLoading(false);
      setImages(false);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setMaterial({ ...material, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("Bạn không phải Admin");
      if (!images) return alert("Bạn chưa thêm ảnh");

      if (onEdit)//Cập nhật thông tin vật tư
       {
        await axios.put(
          `/api/vattu/${material._id}`,
          { ...material, images },
          {
            headers: { Authorization: token },
          }
        );
      } 
      //Thêm vật tư
      else {
        await axios.post(
          "/api/vattu",
          { ...material, images },
          {
            headers: { Authorization: token },
          }
        );
      }

      setCallback(!callback);
      // history.push("/");
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const styleUpload = {
    display: images ? "block" : "none",
  };

  return (
    <>
        <div className="create_product">
      <div className="upload">
        <input type="file" name="file" id="file_up" onChange={handleUpload} />
        {/* {loading ? (
          <div id="file_img">
            <Loading />
          </div>
        ) : ( */}
          <div id="file_img" style={styleUpload}>
            <img src={images ? images.url : ""} alt=""></img>
            <span onClick={handleDestroy}>X</span>
          </div>
         {/* )} */}
      </div>

      <form onSubmit={handleSubmit}>
        {/* <div className="row">
          <label htmlFor="product_id">ID Sản Phẩm</label>
          <input
            type="text"
            name="product_id"
            id="product_id"
            required
            value={material.material_id}
            onChange={handleChangeInput}
            disabled={onEdit}
          />
        </div> */}

        <div className="row">
          <label htmlFor="title">Tên vật tư</label>
          <input
            type="text"
            name="tenvt"
            id="title"
            required
            value={material.tenvt}
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="title">Đơn vị</label>
          <input
            type="text"
            name="donvi"
            id="title"
            required
            value={material.donvi}
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="price">Số lượng</label>
          <input
            type="number"
            name="soluong"
            id="price"
            required
            value={material.soluong}
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="price">Giá nhập</label>
          <input
            type="number"
            name="gianhap"
            id="price"
            required
            value={material.gianhap}
            onChange={handleChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="price">Giá xuất</label>
          <input
            type="number"
            name="giaxuat"
            id="price"
            required
            value={material.giaxuat}
            onChange={handleChangeInput}
          />
        </div>


      

        {/* <div className="row">
          <label htmlFor="description">Mô tả</label>
          <textarea
            type="text"
            name="description"
            id="description"
            required
            value={product.description}
            rows="5"
            onChange={handleChangeInput}
          />
        </div> */}

        {/* <div className="row">
          <label htmlFor="content">Mô tả</label>
          <textarea
            type="text"
            name="content"
            id="content"
            required
            value={product.content}
            rows="7"
            onChange={handleChangeInput}
          />
        </div> */}

        {/* <div className="row">
          <label htmlFor="categories">Loại Sản Phẩm</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChangeInput}
          >
            <option value="">Vui lòng chọn loại sản phẩm</option>
            {categories.map((category) => (
              <option value={category._id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div> */}

        <button type="submit">{onEdit ? "Cập Nhật" : "Thêm"}</button>
      </form>
    </div>
    </>
  );
}

export default AddMaterial;
