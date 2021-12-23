import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import Header from "../../header/Header";
import NavBar from "../../navbar/NavBar";
import Loading from "../utils/loading/Loading";
import { AiOutlineEye } from "react-icons/ai";
import { GiExplosiveMaterials } from "react-icons/gi";
import { BiBookAdd } from "react-icons/bi";
import { FaFileExport } from "react-icons/fa";
import Pagination from "../../common/Pagination";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

function StatisticMaterial() {
  const state = useContext(GlobalState);
  // const [material, setMaterial] = useState(initialMaterial);
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  const history = useHistory();
  const param = useParams();

  const [stores] = state.storeAPI.stores;
  const [warehouses] = state.warehouseAPI.warehouses;
  const [materials] = state.materialAPI.materials;

  const [materialsfilter, setMaterialsFilter] = useState(materials);
  const [listMaterialSearch, setListMaterialSearch] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [madailyfilter, setMaDaiLyFilter] = useState("allstores");
  const [makhofilter, setMaKhoFilter] = useState("allwarehouses");

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
  const [materialsPerPage] = useState(10);

  // Get current
  const indexOfLastMaterial = currentPage * materialsPerPage;
  const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage;

  useEffect(() => {
    setListMaterialSearch(
      materialsfilter?.filter((material) => {
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
  }, [searchTerm, materialsfilter]);

  //Gán list vào trang hiện tại
  const currentMaterials = listMaterialSearch?.slice(
    indexOfFirstMaterial,
    indexOfLastMaterial
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  //----------------------

  const Format = (number) => {
    if (number >= 0) {
      return String(number).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND";
    } else
      return (
        "-" + String(number * -1).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND"
      );
  };

  const handlechangestore = (e) => {
    setMaDaiLyFilter(e.target.value);
    setMaKhoFilter("allwarehouses"); //Nếu mà thay đổi đại lý thì kho sẽ trở về là 'Tất cả kho'
  };
  const handlechangewarehouse = (e) => {
    setMaKhoFilter(e.target.value);
  };

  useEffect(async () => {
    const res = await axios.post("/api/thongke/vattu", {
      madailyfilter,
      makhofilter,
    });
    setMaterialsFilter(res.data);
  }, [madailyfilter, makhofilter]);

  return (
    <div className="layout">
      <div className="layout-first">
        <Header />
      </div>
      <div className="layout-second">
        <NavBar />

        <div className="materials">
          <div className="header-title">
            <div className="container-filter">
              <div className="row search-material-sttistic">
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

              <div className="title-statistic-material">
                <h2>Thống Kê Vật Tư</h2>
              </div>

              <div className="filter-select">
                <label>Đại lý : </label>
                <select
                  className="select-store"
                  // value={madailyfilter}
                  defaultValue={"allstores"}
                  onChange={handlechangestore}
                >
                  <option value="allstores">Tất cả đại lý</option>
                  {stores.map((store, index) => (
                    <option value={store._id} key={index}>
                      {store.tendl}
                    </option>
                  ))}
                </select>
                <label>Kho : </label>
                <select
                  name="makho"
                  defaultValue={"allwarehouses"}
                  onChange={handlechangewarehouse}
                >
                  (<option value="allwarehouses">Tất cả kho</option>
                  {warehouses.map((warehouse, index) =>
                    madailyfilter == warehouse.madaily._id &&
                    warehouse.trangthai === "Đang hoạt động" ? (
                      <option value={warehouse._id} key={index}>
                        {warehouse.tenkho}
                      </option>
                    ) : null
                  )}
                  )
                </select>

                <button
                  className="export-file-material"
                  onClick={() => {
                    exportToCSV(
                      { listMaterialSearch },
                      `DanhSachVatTuTon_${DATE}`
                    );
                  }}
                >
                  <FaFileExport
                    style={{ marginRight: "5px", marginTop: "5px" }}
                  />
                  Xuất File
                </button>
              </div>
            </div>
          </div>

          <div className="statisticvt_header__list">
            <p style={{ width: "70px" }}>STT</p>
            <p style={{ width: "160px" }}>ID</p>
            <p style={{ flex: 1 }}>Tên vật tư</p>
            <p style={{ width: "160px" }}>Hình ảnh</p>
            <p style={{ flex: 1 }}>Số lượng tồn</p>
            <p style={{ flex: 1 }}>Giá nhập</p>
            <p style={{ flex: 1 }}>Giá xuất</p>
            <p style={{ flex: 1 }}>Xem</p>
          </div>
          {currentMaterials.length > 0 ? (
            currentMaterials?.map((material, index) => {
              return (
                <div className="material_item">
                  <div
                    style={{ width: "70px" }}
                    className="material_item_element"
                  >
                    {index + 1}
                  </div>
                  <div
                    style={{ width: "160px" }}
                    className="material_item_element id_material"
                  >
                    <p>{material._id}</p>
                  </div>
                  <div style={{ flex: 1 }} className="material_item_element">
                    <p>{material.tenvt}</p>
                  </div>
                  <div
                    style={{ width: "160px" }}
                    className="material_item_element"
                  >
                    <img src={material.images.url} alt="" />
                  </div>

                  <div style={{ flex: 1 }} className="material_item_element">
                    {material.soluong} {material.donvi}
                  </div>

                  <div style={{ flex: 1 }} className="material_item_element">
                    {Format(material.gianhap)}
                  </div>
                  <div style={{ flex: 1 }} className="material_item_element">
                    {Format(material.giaxuat)}
                  </div>
                  <div style={{ flex: 1 }} className="material_item_element">
                    <Link to={`/thongkevattutrongcackho/${material._id}`}>
                      <button style={{ fontSize: 36 }}>
                        <AiOutlineEye style={{ color: "rgb(26, 148, 255)" }} />
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "18px",
                border: "1px solid #999",
                borderTop: "none",
              }}
            >
              Kho có vật tư tồn kho
            </div>
          )}

          {currentMaterials.length > 0 ? (
            <Pagination
              itemsPerpage={materialsPerPage}
              totalItems={listMaterialSearch?.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default StatisticMaterial;
