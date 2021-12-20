import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import { GlobalState } from "../../../GlobalState";
import StoreItem from "./StoreItem";
import Header from "../../header/Header";
import NavBar from "../../navbar/NavBar";
import Loading from "../utils/loading/Loading";
import { GiExplosiveMaterials } from "react-icons/gi";
import { FaFileExport } from "react-icons/fa";
import { BiBookAdd } from "react-icons/bi";
import Pagination from "../../common/Pagination";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const initialStore = {
  tendl: "",
  diachi: "",
  sodienthoai: "",
  trangthai: "Đang hoạt động",
};

function Stores() {
  const state = useContext(GlobalState);
  const [store, setStore] = useState(initialStore);
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  const history = useHistory();
  const param = useParams();

  //============ XUẤT FILE ==============
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const DATE = moment(new Date()).format("DD-MM-YYYY");
  const customData = (dataImport) => {
    let dataExport = [];

    dataExport = dataImport.listStoreSearch.map((data, index) => ({
      STT: index + 1,
      ID: data._id,
      "Tên đại lý": data.tendl,
      "Địa chỉ": data.diachi,
      "Số điện thoại": data.sodienthoai,
      "Trạng thái": data.trangthai,
    }));

    return dataExport;
  };

  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(customData(csvData));
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    console.log("excelBuffer : ", excelBuffer);
    const data = new Blob([excelBuffer], { type: fileType });
    // console.log("data : ", data);
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  //============================================

  const [stores] = state.storeAPI.stores;
  const [listStoreSearch, setListStoreSearch] = useState(stores);
  const [searchTerm, setSearchTerm] = useState("");
  const [onEdit, setOnEdit] = useState(false);
  const [callback, setCallback] = state.storeAPI.callback;

  const [deactive_button, setDeactive_Button] = useState(false);
  const [openalert, setOpenAlert] = useState(false);

  const [message, setMessage] = useState("");

  //-------------- Phân trang ----------------
  const [currentPage, setCurrentPage] = useState(1);
  const [storesPerPage] = useState(5);

  // Get current posts
  const indexOfLastStore = currentPage * storesPerPage;
  const indexOfFirstStore = indexOfLastStore - storesPerPage;

  // Lấy ra danh sách kho có trong từ khóa search
  useEffect(() => {
    setListStoreSearch(
      stores?.filter((store) => {
        if (searchTerm === "") {
          return store;
        } else if (
          store._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          store.tendl.toLowerCase().includes(searchTerm.toLowerCase()) ||
          store.diachi.toLowerCase().includes(searchTerm.toLowerCase()) ||
          store.sodienthoai.toLowerCase().includes(searchTerm.toLowerCase()) ||
          store.trangthai.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return store;
        }
      })
    );
    setCurrentPage(1); //Khởi tạo lại trang hiện tại là 1
  }, [searchTerm, stores]);

  //Gán list vào trang hiện tại
  const currentStores = listStoreSearch?.slice(
    indexOfFirstStore,
    indexOfLastStore
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (param.id) {
      setOnEdit(true);
      stores.forEach((store) => {
        if (store._id === param.id) {
          setStore(store);
          setImages(store.images);
        }
      });
    } else {
      setOnEdit(false);
      setStore(initialStore);
      setImages(false);
    }
  }, [param.id, stores]);

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
      console.log("data file : ", file);
      setLoading(true);
      const res = await axios.post("/api/upload", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });
      setLoading(false);
      console.log("dữ liệu ảnh : ", res.data);
      console.log("dữ liệu ảnh url : ", res.data.url);
      setImages(res.data);
    } catch (err) {
      // alert(err.response.data.message);

      setMessage(<p className="message">{err.response.data.message}</p>);
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
      // alert(err.response.data.message);

      setMessage(<p className="message">{err.response.data.message}</p>);
      setOpenAlert(true);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setStore({ ...store, [name]: value });
  };

  const styleUpload = {
    display: images ? "block" : "none",
  };

  const AddStore = () => {
    setOnEdit(false);
    setStore(initialStore);
    setImages(false);
    setLoading(false);
    document.getElementById("modal_container").classList.add("modal_active");
  };

  const EditStore = (data_store_edit) => {
    console.log("dữ liệu vật tư edit : ", data_store_edit);
    setOnEdit(true);
    setStore(data_store_edit);
    setImages(data_store_edit.images);
    document.getElementById("modal_container").classList.add("modal_active");
  };

  const CloseModalStore = () => {
    document.getElementById("modal_container").classList.remove("modal_active");
  };

  const AddToListStore = async () => {
    setDeactive_Button(true);
    //Thêm mới
    if (!onEdit) {
      try {
        const res = await axios.post(
          "/api/daily",
          { ...store, images },
          {
            headers: { Authorization: token },
          }
        );
        //  alert(res.data.message);

        setMessage(<p className="message">{res.data.message}</p>);
        setOpenAlert(true);

        document
          .getElementById("modal_container")
          .classList.remove("modal_active");
        setCallback(!callback);
      } catch (err) {
        //  alert(err.response.data.message);

        setMessage(<p className="message">{err.response.data.message}</p>);
        setOpenAlert(true);
      }
    }
    //Cập nhật thông tin vật tư
    if (onEdit) {
      try {
        const res = await axios.put(
          `/api/daily/${store._id}`,
          { ...store, images },
          {
            headers: { Authorization: token },
          }
        );
        //  alert(res.data.message);

        setMessage(<p className="message">{res.data.message}</p>);
        setOpenAlert(true);

        document
          .getElementById("modal_container")
          .classList.remove("modal_active");
        setCallback(!callback);
      } catch (err) {
        //  alert(err.response.data.message);

        setMessage(<p className="message">{err.response.data.message}</p>);
        setOpenAlert(true);
      }
    }
    setDeactive_Button(false);
  };

  const DeleteStore = async (id, public_id) => {
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
      const deletestore = await axios.delete(`/api/daily/${id}`, {
        headers: { Authorization: token },
      });
      await destroyImg;

      setMessage(<p className="message">{deletestore.data.message}</p>);
      setOpenAlert(true);

      setCallback(!callback);
      setLoading(false);
    } catch (err) {
      setMessage(<p className="message">{err.response.data.message}</p>);
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
          <div className="stores">
            <div className="header-title">
              <div className="row search-store">
                <input
                  type="text"
                  name="tenpn"
                  placeholder="Nhập từ khóa tìm kiếm"
                  id="inputsearch"
                  required
                  autocomplete="off"
                  autocomplete="off"
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    // document.getElementById("list-material").style.display = "block";
                  }}
                />
              </div>
              <div className="title-tab">
                <h2 style={{ display: "flex", alignItems: "center" }}>
                  <GiExplosiveMaterials style={{ marginRight: "5px" }} />
                  Đại Lý
                </h2>
              </div>

              <button className="add-item" onClick={AddStore}>
                <BiBookAdd style={{ marginRight: "5px", marginTop: "5px" }} />
                Thêm Đại Lý
              </button>

              <button
                className="add-item"
                onClick={() => {
                  exportToCSV({ listStoreSearch }, `DanhSachDaiLy_${DATE}`);
                }}
              >
                <FaFileExport
                  style={{ marginRight: "5px", marginTop: "5px" }}
                />
                Xuất File
              </button>
            </div>

            <div className="store-header_list">
              <p style={{ width: "70px" }}>STT</p>
              <p style={{ width: "160px" }}>ID</p>
              <p style={{ flex: 1 }}>Tên đại lý</p>
              <p style={{ flex: 1 }}>Hình ảnh</p>
              <p style={{ flex: 1 }}>Địa chỉ</p>
              <p style={{ flex: 1 }}>SĐT</p>
              <p style={{ flex: 1 }}>Trạng thái</p>
              <p style={{ flex: 1 }}>Chức năng</p>
            </div>
            {currentStores.map((store, index) => {
              return (
                <StoreItem
                  key={store._id}
                  store={store}
                  stt={(currentPage - 1) * storesPerPage + index}
                  EditStore={EditStore}
                  DeleteStore={DeleteStore}
                />
              );
            })}

            <Pagination
              itemsPerpage={storesPerPage}
              totalItems={listStoreSearch?.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>

      <div className="modal_container__store" id="modal_container">
        <div className="modal_store">
          <h2 className="title_add__store">
            {onEdit ? "Cập Nhật Thông Tin Đại Lý" : "Thêm Đại Lý"}
          </h2>
          <div className="row">
            <label htmlFor="title">Tên đại lý</label>
            <input
              type="text"
              name="tendl"
              placeholder="Nhập tên đại lý"
              autoComplete="off"
              id="tendl"
              required
              value={store.tendl}
              onChange={handleChangeInput}
            />
          </div>

          <div className="row">
            <label htmlFor="diachi">Địa chỉ</label>
            <input
              type="text"
              name="diachi"
              placeholder="Nhập địa chỉ"
              autoComplete="off"
              id="diachi"
              required
              value={store.diachi}
              onChange={handleChangeInput}
            />
          </div>

          <div className="row">
            <label htmlFor="sodienthoai">Số điện thoại</label>
            <input
              name="sodienthoai"
              placeholder="Nhập số điện thoại"
              autoComplete="off"
              id="sodienthoai"
              required
              value={store.sodienthoai}
              maxlength="10"
              onChange={handleChangeInput}
            />
          </div>

          <div className="row">
            <label>Trạng thái</label>
            {onEdit ? (
              <select
                className="select_store"
                name="trangthai"
                value={store.trangthai}
                onChange={handleChangeInput}
              >
                {/* <option value="" hidden>Vui lòng chọn trạng thái</option> */}
                <option value="Đang hoạt động">Đang hoạt động</option>
                <option value="Ngừng hoạt động">Ngừng hoạt động</option>
              </select>
            ) : (
              <select
                className="select_store"
                name="trangthai"
                value={store.trangthai}
                onChange={handleChangeInput}
                disabled="disabled"
              >
                {/* <option value="" hidden>Vui lòng chọn trạng thái</option> */}
                <option value="Đang hoạt động" selected>
                  Đang hoạt động
                </option>
                <option value="Ngừng hoạt động">Ngừng hoạt động</option>
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
            <button id="add" onClick={AddToListStore}>
              {onEdit ? "Cập nhật" : "Thêm"}
            </button>
            <button
              disabled={deactive_button ? true : false}
              className={deactive_button ? "deactive_button" : null}
              id="close"
              onClick={CloseModalStore}
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
            {message}
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

export default Stores;
