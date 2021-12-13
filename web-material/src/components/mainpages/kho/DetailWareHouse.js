import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

import { GlobalState } from "../../../GlobalState";
// import MaterialItem from "./MaterialItem";
import Header from "../../header/Header";
import NavBar from "../../navbar/NavBar";
import Loading from "../utils/loading/Loading";
import { GiExplosiveMaterials } from "react-icons/gi";
import { BiBookAdd } from "react-icons/bi";
import Pagination from "../../common/Pagination";

function DetailWareHouse() {
  const state = useContext(GlobalState);

  const params = useParams();
  const [materials] = state.materialAPI.materials;
  const [searchTerm, setSearchTerm] = useState("");
  const [materialsfilter, setMaterialsFilter] = useState([]);
  const [listMaterialSearch, setListMaterialSearch] = useState(materialsfilter);
  const [madailyfilter, setMaDaiLyFilter] = useState("allstores");
  const [makhofilter, setMaKhoFilter] = useState("allwarehouses");

  //-------------- Phân trang ----------------
  const [currentPage, setCurrentPage] = useState(1);
  const [materialsPerPage] = useState(10);

  // Get current
  const indexOfLastMaterial = currentPage * materialsPerPage;
  const indexOfFirstMaterial = indexOfLastMaterial - materialsPerPage;

  // Lấy ra danh sách vật tư có trong từ khóa search
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

  useEffect(async () => {
    const res = await axios.post("/api/thongke/vattu", {
      madailyfilter: params.madaily,
      makhofilter: params.makho,
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
                Danh Sách Vật Tư Tồn Kho
              </h2>
            </div>
          </div>

          <div className="warehouse_header__list">
            <p style={{ width: "70px" }}>STT</p>
            <p style={{ width: "160px" }}>ID</p>
            <p style={{ flex: 1 }}>Tên vật tư</p>
            <p style={{ width: "160px" }}>Hình ảnh</p>
            <p style={{ flex: 1 }}>Số lượng tồn</p>
            <p style={{ flex: 1 }}>Giá nhập</p>
            <p style={{ flex: 1 }}>Giá xuất</p>
            <p style={{ flex: 1 }}>Trạng thái</p>
          </div>
          {currentMaterials?.map((material, index) => {
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
                  {material.trangthai}
                </div>
              </div>
            );
          })}

          {listMaterialSearch.length > 0 ? (
            <Pagination
              itemsPerpage={materialsPerPage}
              totalItems={listMaterialSearch?.length}
              paginate={paginate}
              currentPage={currentPage}
            />
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
              Không có vật tư tồn kho
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailWareHouse;
