import axios from "axios";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../../GlobalState";
import ExportBillItem from "./ExportBillItem";
import NavBar from "../../../navbar/NavBar";
import Header from "../../../header/Header";
import { GiExplosiveMaterials } from "react-icons/gi";
import { BiBookAdd } from "react-icons/bi";
import Pagination from "../../../common/Pagination";

function ExporttBill() {
  const state = useContext(GlobalState);
  const [searchTerm, setSearchTerm] = useState("");
  const [exportbills] = state.exportbillAPI.exportbills;

  const [currentPage, setCurrentPage] = useState(1);
  const [exportbillsPerPage] = useState(10);

  // Get current posts
  const indexOfLastExportbill = currentPage * exportbillsPerPage;
  const indexOfFirstExportbill = indexOfLastExportbill - exportbillsPerPage;
  const currentExportbills = exportbills?.slice(
    indexOfFirstExportbill,
    indexOfLastExportbill
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="layout">
      <div className="layout-first">
        <Header />
      </div>
      <div className="layout-second">
        <NavBar />
        <div className="exportbills">
          <div className="header-title">
            <div className="row search-exportbill">
              <input
                type="text"
                name="id"
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
                Danh Sách Phiếu Xuất
              </h2>
            </div>

            <button className="add-item">
              <Link to={"/lapphieuxuat"} style={{ color: "#fff" }}>
                {" "}
                <BiBookAdd style={{ marginRight: "5px", marginTop: "5px" }} />
                Lập Phiếu Xuất
              </Link>
            </button>
          </div>
          <div className="header_list">
            <p style={{ width: "70px" }}>STT</p>
            <p style={{ width: "160px" }}>ID</p>
            <p style={{ flex: 1 }}>Ngày lập</p>
            <p style={{ flex: 1 }}>Nhân viên</p>
            <p style={{ flex: 1 }}>Đại lý</p>
            <p style={{ flex: 1 }}>Kho</p>
            <p style={{ flex: 1 }}>Tổng Tiền</p>
            <p style={{ flex: 1 }}>Chi tiết</p>
          </div>
          {currentExportbills
            .filter((exportbill) => {
              if (searchTerm === "") {
                return exportbill;
              } else if (
                exportbill._id
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                exportbill.manv._id
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                exportbill.manv.madaily.tendl
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                exportbill.makho.tenkho
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              ) {
                return exportbill;
              }
            })
            .map((exportbill, index) => {
              return (
                <>
                  <ExportBillItem
                    key={exportbill._id}
                    exportbill={exportbill}
                    stt={(currentPage - 1) * exportbillsPerPage + index}
                  />
                </>
              );
            })}

          <Pagination
            itemsPerpage={exportbillsPerPage}
            totalItems={exportbills?.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default ExporttBill;
