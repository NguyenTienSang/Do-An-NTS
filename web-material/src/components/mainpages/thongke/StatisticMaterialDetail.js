import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import { GlobalState } from "../../../GlobalState";
import Header from "../../header/Header";
import NavBar from "../../navbar/NavBar";
import Loading from "../utils/loading/Loading";
import { GiExplosiveMaterials } from "react-icons/gi";
import { BiBookAdd } from "react-icons/bi";
import { FaFileExport } from "react-icons/fa";
import Pagination from "../../common/Pagination";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

function StatisticMaterialDetail() {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const params = useParams();
  const [openalert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState("");

  const [materials] = state.materialAPI.materials;
  const [inforMaterial, setInforMaterial] = useState([]);
  const [listWareHouseMaterial, setListWareHouseMaterial] = useState([]);
  const [listWareHouseSearch, setListWareHouseSearch] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  let inforuser = JSON.parse(localStorage.getItem("inforuser"));
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
      "Tên Vật Tư": data.tenvt,
      "Đơn Vị": data.donvi,
      "Giá Nhập": data.gianhap,
      "Giá Xuất": data.giaxuat,
      "Số Lượng Tồn": data.soluong,
      "Trạng Thái": data.trangthai,
    }));

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
  const [warehousesPerPage] = useState(10);

  // Get current posts
  const indexOfLastWareHouse = currentPage * warehousesPerPage;
  const indexOfFirstWareHouse = indexOfLastWareHouse - warehousesPerPage;

  // Lấy ra danh sách kho có trong từ khóa search
  useEffect(() => {
    console.log("listWareHouseMaterial : ", listWareHouseMaterial);
    if (inforuser.role === "user") {
      setListWareHouseSearch(
        listWareHouseMaterial?.filter((warehouse) => {
          if (
            searchTerm === "" &&
            warehouse.tendl === inforuser.madaily.tendl
          ) {
            return warehouse;
          } else if (
            (warehouse._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
              warehouse.tenkho
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              warehouse.tendl
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              warehouse.diachi
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              warehouse.sodienthoai
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) &&
            warehouse.tendl === inforuser.madaily.tendl
          ) {
            return warehouse;
          }
        })
      );
    } else {
      setListWareHouseSearch(
        listWareHouseMaterial?.filter((warehouse) => {
          if (searchTerm === "") {
            return warehouse;
          } else if (
            warehouse._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            warehouse.tenkho.toLowerCase().includes(searchTerm.toLowerCase()) ||
            warehouse.tendl.toLowerCase().includes(searchTerm.toLowerCase()) ||
            warehouse.diachi.toLowerCase().includes(searchTerm.toLowerCase()) ||
            warehouse.sodienthoai
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          ) {
            return warehouse;
          }
        })
      );
    }

    setCurrentPage(1); //Khởi tạo lại trang hiện tại là 1
  }, [searchTerm, listWareHouseMaterial]);

  //Gán list vào trang hiện tại
  const currentWareHouses = listWareHouseSearch?.slice(
    indexOfFirstWareHouse,
    indexOfLastWareHouse
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(async () => {
    setInforMaterial(
      materials.find((materialitem) => {
        return materialitem._id.toString() === params._id.toString();
      })
    );

    try {
      const res = await axios.post(
        "/api/thongke/vattutrongcacdaily",
        { mavattu: params._id },
        {
          headers: { Authorization: token },
        }
      );
      console.log("res.data : ", res.data);
      setListWareHouseMaterial(res.data);
    } catch (err) {
      setMessage(<p className="message">{err.response.data.message}</p>);
      setOpenAlert(true);
    }
  }, [params._id]);

  return (
    <>
      <div className="layout">
        <div className="layout-first">
          <Header />
        </div>
        <div className="layout-second">
          <NavBar />
          <div className="warehouses">
            <div className="header-title">
              <div className="row search-warehouse">
                <input
                  type="text"
                  name="tenpn"
                  placeholder="Nhập từ khóa tìm kiếm"
                  id="inputsearch"
                  required
                  autoComplete="off"
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                  }}
                />
              </div>
              <div className="title-statisticmaterial-detail">
                <p style={{ display: "flex", alignItems: "center" }}>
                  Danh Sách Các Kho Đang Tồn : {inforMaterial.tenvt}
                </p>

                <p style={{ display: "flex", alignItems: "center" }}>
                  ID : {inforMaterial._id}
                </p>
              </div>
            </div>

            <div className="warehouse-header_list">
              <p style={{ width: "70px" }}>STT</p>
              <p style={{ width: "160px" }}>ID</p>
              <p style={{ flex: 1 }}>Tên kho</p>
              <p style={{ width: "160px" }}>Hình ảnh</p>
              <p style={{ flex: 1 }}>Đại lý</p>
              <p style={{ flex: 1 }}>Địa chỉ</p>
              <p style={{ flex: 1 }}>SĐT</p>
              <p style={{ flex: 1 }}>Số lượng</p>
            </div>
            {currentWareHouses?.map((warehouse, stt) => {
              return (
                <div className="warehouse_item">
                  <div
                    style={{ width: "70px" }}
                    className="warehouse_item_element"
                  >
                    <p>{stt + 1}</p>
                  </div>
                  <div
                    style={{ width: "160px" }}
                    className="warehouse_item_element  id_warehouse"
                  >
                    <p>{warehouse._id}</p>
                  </div>
                  <div style={{ flex: 1 }} className="warehouse_item_element">
                    <p>{warehouse.tenkho}</p>
                  </div>
                  <div
                    style={{ width: "160px" }}
                    className="warehouse_item_element"
                  >
                    <img src={warehouse.images.url} alt="" />
                  </div>

                  <div style={{ flex: 1 }} className="warehouse_item_element">
                    {warehouse.tendl}
                  </div>

                  <div style={{ flex: 1 }} className="warehouse_item_element">
                    {warehouse.diachi}
                  </div>
                  <div style={{ flex: 1 }} className="warehouse_item_element">
                    {warehouse.sodienthoai}
                  </div>
                  <div style={{ flex: 1 }} className="warehouse_item_element">
                    {warehouse.soluong} {inforMaterial.donvi}
                  </div>
                </div>
              );
            })}

            <Pagination
              itemsPerpage={warehousesPerPage}
              totalItems={listWareHouseSearch?.length}
              paginate={paginate}
              currentPage={currentPage}
            />
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

export default StatisticMaterialDetail;
