import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import { GlobalState } from "../../../GlobalState";
import MaterialItem from "./MaterialItem";
import Header from "../../header/Header";
import NavBar from "../../navbar/NavBar";
import Loading from "../utils/loading/Loading";
import { GiExplosiveMaterials } from "react-icons/gi";
import { FaFileExport } from "react-icons/fa";
import { BiBookAdd } from "react-icons/bi";
import Pagination from "../../common/Pagination";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const initialMaterial = {
  tenvt: "",
  donvi: "",
  soluong: 0,
  gianhap: "",
  giaxuat: "",
  trangthai: "Đang kinh doanh",
};

function Materials() {
  const state = useContext(GlobalState);
  const [material, setMaterial] = useState(initialMaterial);
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  const param = useParams();

  const inforuser = JSON.parse(localStorage.getItem("inforuser"));
  const [materials] = state.materialAPI.materials;

  // const [listMaterialSearch, setListMaterialSearch] = useState(async () => {
  //   if (inforuser.role === "admin") {
  //     return materials;
  //   } else if (inforuser.role === "user") {
  //     const res = await axios.post("/api/thongke/vattu", {
  //       madailyfilter: inforuser.madaily._id,
  //       makhofilter: "allwarehouses",
  //     });
  //     return res.data;
  //   }
  // });

  const [listMaterialSearch, setListMaterialSearch] = useState([]);

  useEffect(async () => {
    if (inforuser.role === "user") {
      const res = await axios.post("/api/thongke/vattu", {
        madailyfilter: inforuser.madaily._id,
        makhofilter: "allwarehouses",
      });
      setListMaterialSearch(res.data);
    } else if (inforuser.role === "admin") {
      setListMaterialSearch(materials);
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [onEdit, setOnEdit] = useState(false);
  const [callback, setCallback] = state.materialAPI.callback;

  const [deactive_button, setDeactive_Button] = useState(false);
  const [openalert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState("");

  //============ XUẤT FILE ==============
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const DATE = moment(new Date()).format("DD-MM-YYYY");

  const customData = (dataImport) => {
    let dataExport = [];
    console.log("dataImport : ", dataImport.listMaterialSearch);

    dataExport = dataImport.listMaterialSearch.map((data, index) => ({
      STT: index + 1,
      ID: data._id,
      "Tên vật tư": data.tenvt,
      "Đơn vị": data.donvi,
      "Giá nhập": data.gianhap,
      "Giá xuất": data.giaxuat,
      "Số lượng": data.soluong,
      "Trạng thái": data.trangthai,
    }));

    // console.log("dataExport : ", dataExport);
    return dataExport;
  };

  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(customData(csvData));
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  //======================================

  //-------------- Phân trang ----------------
  const [currentPage, setCurrentPage] = useState(1);
  const [materialsPerPage] = useState(10);

  // Get current
  const indexOfLastMaterial = currentPage * materialsPerPage;
  const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage;

  // Lấy ra danh sách vật tư có trong từ khóa search
  useEffect(() => {
    setListMaterialSearch(
      materials?.filter((material) => {
        if (searchTerm === "") {
          return material;
        } else if (
          material._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          material.tenvt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          material.trangthai.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return material;
        }
      })
    );
    setCurrentPage(1); //Khởi tạo lại trang hiện tại là 1
  }, [searchTerm, materials]);

  //Gán list vào trang hiện tại
  const currentMaterials = listMaterialSearch?.slice(
    indexOfFirstMaterial,
    indexOfLastMaterial
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  //----------------------

  useEffect(() => {
    if (param.id) {
      setOnEdit(true);
      materials.forEach((material) => {
        if (material._id === param.id) {
          setMaterial(material);
          setImages(material.images);
        }
      });
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

      if (file.size > 1024 * 1024) return alert("Size quá lớn"); //1mb

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return alert("Định dạng file không đúng");

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      const res = await axios.post("/api/upload", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });
      setLoading(false);
      setImages(res.data);
    } catch (err) {
      setMessage(err.response.data.message);
      setOpenAlert(true);
    }
  };

  const handleDestroy = async () => {
    try {
      if (!isAdmin) return alert("Bạn không phải Admin");
      setLoading(true);
      await axios.post(
        "/api/destroy",
        { public_id: images.public_id },
        {
          headers: { Authorization: token },
        }
      );
      setLoading(false);
      setImages(false);
    } catch (err) {
      setMessage(err.response.data.message);
      setOpenAlert(true);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setMaterial({ ...material, [name]: value });
  };

  const styleUpload = {
    display: images ? "block" : "none",
  };

  const AddMaterial = () => {
    setImages(false);
    setOnEdit(false);
    setMaterial(initialMaterial);
    document.getElementById("modal_container").classList.add("modal_active");
  };

  const EditMaterial = (data_material_edit) => {
    setOnEdit(true);
    setMaterial(data_material_edit);
    setImages(data_material_edit.images);
    document.getElementById("modal_container").classList.add("modal_active");
  };

  const CloseModalMaterial = () => {
    document.getElementById("modal_container").classList.remove("modal_active");
  };

  const AddToListMaterial = async () => {
    setDeactive_Button(true);
    if (!onEdit) {
      try {
        const res = await axios.post(
          "/api/vattu",
          { ...material, images },
          {
            headers: { Authorization: token },
          }
        );
        //  alert(res.data.message);

        setMessage(res.data.message);
        setOpenAlert(true);

        document
          .getElementById("modal_container")
          .classList.remove("modal_active");
        setCallback(!callback);
        //  history.push("/vattu");
      } catch (err) {
        //  alert(err.response.data.message);

        setMessage(err.response.data.message);
        setOpenAlert(true);
      }
    }
    //Cập nhật thông tin vật tư
    if (onEdit) {
      try {
        const res = await axios.put(
          `/api/vattu/${material._id}`,
          { ...material, images },
          {
            headers: { Authorization: token },
          }
        );
        //  alert(res.data.message);

        setMessage(res.data.message);
        setOpenAlert(true);

        document
          .getElementById("modal_container")
          .classList.remove("modal_active");
        setCallback(!callback);
      } catch (err) {
        //  alert(err.response.data.message);

        setMessage(err.response.data.message);
        setOpenAlert(true);
      }
    }
    setDeactive_Button(false);
  };

  const DeleteMaterial = async (id, public_id) => {
    try {
      setLoading(true);
      //Xóa ảnh trên cloudinary
      const destroyImg = axios.post(
        "/api/destroy",
        {
          public_id,
        },
        { headers: { Authorization: token } }
      );
      //Xóa vật tư trong db
      const deletematerial = await axios.delete(`/api/vattu//${id}`, {
        headers: { Authorization: token },
      });
      //  alert(res.data.message);
      await destroyImg;
      // alert(deletematerial.data.message);

      setMessage(deletematerial.data.message);
      setOpenAlert(true);

      setCallback(!callback);
      setLoading(false);
    } catch (err) {
      //  alert(err.response.data.message);
      setMessage(err.response.data.message);
      setOpenAlert(true);
    }
  };

  return (
    <>
      <div className="layout">
        <div className="layout-first">
          <Header />
        </div>
        <div className="layout-second">
          <NavBar />
          <div className="materials">
            <div className="header-title">
              <div className="row search-material">
                <input
                  type="text"
                  name="tenpn"
                  placeholder="Nhập từ khóa tìm kiếm"
                  id="inputsearch"
                  required
                  autocomplete="off"
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                  }}
                />
              </div>
              <div className="title-tab">
                <h2 style={{ display: "flex", alignItems: "center" }}>
                  <GiExplosiveMaterials style={{ marginRight: "5px" }} />
                  Vật Tư
                </h2>
              </div>

              {isAdmin ? (
                <>
                  <button className="add-item" onClick={AddMaterial}>
                    <BiBookAdd
                      style={{ marginRight: "5px", marginTop: "5px" }}
                    />
                    Thêm Vật Tư
                  </button>

                  <button
                    className="add-item"
                    onClick={() => {
                      exportToCSV(
                        { listMaterialSearch },
                        `DanhSachVatTu_${DATE}`
                      );
                    }}
                  >
                    <FaFileExport
                      style={{ marginRight: "5px", marginTop: "5px" }}
                    />
                    Xuất File
                  </button>
                </>
              ) : null}
            </div>
            <div className="material-header_list">
              <p style={{ width: "70px" }}>STT</p>
              <p style={{ width: "160px" }}>ID</p>
              <p style={{ flex: 1 }}>Tên vật tư</p>
              <p style={{ width: "160px" }}>Hình ảnh</p>
              <p style={{ flex: 1 }}>Số lượng tồn</p>
              <p style={{ flex: 1 }}>Giá nhập</p>
              <p style={{ flex: 1 }}>Giá xuất</p>
              <p style={{ flex: 1 }}>Trạng thái</p>
              <p style={{ flex: 1 }}>Chức năng</p>
            </div>
            {currentMaterials?.map((material, index) => {
              return (
                <MaterialItem
                  material={material}
                  stt={(currentPage - 1) * materialsPerPage + index}
                  EditMaterial={EditMaterial}
                  DeleteMaterial={DeleteMaterial}
                />
              );
            })}

            <Pagination
              itemsPerpage={materialsPerPage}
              totalItems={listMaterialSearch?.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>

      <div className="modal_container__material" id="modal_container">
        <div className="modal__material">
          <h2 className="title_add__material">
            {onEdit ? "Cập Nhật Thông Tin Vật Tư" : "Thêm Vật Tư"}
          </h2>
          <div className="row">
            <label htmlFor="title">Tên vật tư</label>
            <input
              type="text"
              name="tenvt"
              placeholder="Nhập tên vật tư"
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
              placeholder="Nhập đơn vị tính"
              id="title"
              required
              value={material.donvi}
              onChange={handleChangeInput}
            />
          </div>

          <div className="row">
            <label htmlFor="price">Giá nhập</label>
            <input
              type="number"
              name="gianhap"
              placeholder="Nhập giá nhập"
              id="price"
              required
              value={material.gianhap}
              min="0"
              onChange={handleChangeInput}
            />
          </div>

          <div className="row">
            <label htmlFor="price">Giá xuất</label>
            <input
              type="number"
              name="giaxuat"
              placeholder="Nhập giá xuất"
              id="price"
              required
              value={material.giaxuat}
              min="0"
              onChange={handleChangeInput}
            />
          </div>

          <div className="row">
            <label>Trạng thái</label>
            {onEdit ? (
              <select
                className="select-material"
                name="trangthai"
                value={material.trangthai}
                onChange={handleChangeInput}
              >
                {/* <option value="" hidden>Vui lòng chọn trạng thái</option> */}
                <option value="Đang kinh doanh">Đang kinh doanh</option>
                <option value="Ngừng kinh doanh">Ngừng kinh doanh</option>
              </select>
            ) : (
              <select
                className="select-material"
                name="trangthai"
                value={material.trangthai}
                onChange={handleChangeInput}
                disabled="disabled"
              >
                {/* <option value="" hidden>Vui lòng chọn trạng thái</option> */}
                <option value="Đang kinh doanh" selected>
                  Đang kinh doanh
                </option>
                <option value="Ngừng kinh doanh">Ngừng kinh doanh</option>
              </select>
            )}
          </div>

          <div className="upload">
            <h1>Hình ảnh</h1>
            <input
              type="file"
              name="file"
              id="file_up"
              onChange={handleUpload}
            />

            {loading ? (
              <div id="file_img">
                <Loading />
              </div>
            ) : (
              <div id="file_img" style={styleUpload}>
                <img src={images ? images.url : ""} alt=""></img>
                <span onClick={handleDestroy}>X</span>
              </div>
            )}
          </div>

          <div className="option-button">
            <button id="add" onClick={AddToListMaterial}>
              {onEdit ? "Cập nhật" : "Thêm"}
            </button>
            <button
              id="close"
              disabled={deactive_button ? true : false}
              className={deactive_button ? "deactive_button" : null}
              onClick={CloseModalMaterial}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>

      {openalert ? (
        <div
          className="modal_container__notification modal_active"
          id="modal_container__notification"
        >
          <div className="modal__notification">
            <p className="title-notification">Thông báo</p>
            <p>{message}</p>
            <div className="option-button">
              <button
                id="add"
                onClick={() => {
                  document
                    .getElementById("modal_container__notification")
                    .classList.remove("modal_active");
                  setOpenAlert(false);
                }}
              >
                OK
              </button>
              {/* <button id="close"  >Hủy</button> */}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default Materials;
