import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../../GlobalState";
import DatePicker from "react-datepicker";
// import Moment from 'react-moment';
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import ExportBillItem from "./ExportBillItem";
import NavBar from "../../../navbar/NavBar";
import Header from "../../../header/Header";
import { GiExplosiveMaterials } from "react-icons/gi";
import { BiBookAdd } from "react-icons/bi";
import { IoMdArrowDropdown } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";

function CreateExportBill() {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [materials] = state.materialAPI.materials;
  const [materialsfilter, setMaterialsFilter] = useState(materials);
  const [warehouses] = state.warehouseAPI.warehouses;
  const [exportbills] = state.exportbillAPI.exportbills;
  const [detailexportbill, setDetailExportBill] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("inforuser"))
  );
  const [startDate, setStartDate] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  // const [currentDate, setCurrentDate] = useState((new Date()));
  const [callback, setCallback] = state.exportbillAPI.callback;
  const [hdn, setHDN] = useState(new Date("10-20-2021"));
  const [searchTerm, setSearchTerm] = useState("");
  const [onSearch, setOnSearch] = useState(false);
  const [madailyfilter, setMaDaiLyFilter] = useState("allstores");
  const [makhofilter, setMaKhoFilter] = useState("allwarehouses");

  const [exportbill, setExportBill] = useState({
    // tenpx: "",
    ngay: "",
    manv: "",
    makho: "",
  });

  const [openalert, setOpenAlert] = useState(false);

  const [message, setMessage] = useState("");

  const Format = (number) => {
    if (number >= 0) {
      return String(number).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND";
    } else
      return (
        "-" +
        String(number)
          .replace(/(.)(?=(\d{3})+$)/g, "$1.")
          .slice(2) +
        " VND"
      );
  };

  useEffect(async () => {
    console.log("load lại dữ liệu materialsfilter");
    const res = await axios.post(
      "/api/thongke/vattu",
      //  [JSON.parse(localStorage.getItem('inforuser')).madaily._id,exportbill.makho]
      {
        madailyfilter: JSON.parse(localStorage.getItem("inforuser")).madaily
          ._id,
        makhofilter: exportbill.makho,
      }
    );
    console.log("Dữ liệu thống kê : ", res.data);
    // console.log('madailyfilter : ',madailyfilter);
    // console.log('makhofilter : ',makhofilter);

    setMaterialsFilter(res.data);
  }, [exportbill.makho]);

  useEffect(() => {
    setExportBill({
      ngay: moment(new Date()).format("MM-DD-yyy"),
      manv: JSON.parse(localStorage.getItem("inforuser"))._id,
      makho: "",
      ctpx: [],
    });
    setDetailExportBill([]);
  }, [exportbills]);

  const newwarehouses = warehouses.filter((warehouse, index) =>
    user.madaily._id === warehouse.madaily._id ? warehouse : undefined
  );

  const AddToExportBill = (material, soluong, typing) => {
    if (!onSearch) {
      document.getElementById("list-material").style.display = "none";
      document.getElementById("inputsearch").value = "";
    }
    const exist = detailexportbill.find((x) => x._id === material._id);
    if (exist) {
      setDetailExportBill(
        detailexportbill.map((x) =>
          x._id === material._id
            ? {
                ...exist,
                quantity: typing ? soluong : exist.quantity + soluong,
              }
            : x
        )
      );
    } else {
      setDetailExportBill([...detailexportbill, { ...material, quantity: 1 }]);
    }
  };

  const RemoveToExportBill = (material) => {
    const exist = detailexportbill.find((x) => x._id === material._id);
    if (exist.quantity === 1) {
      setDetailExportBill(
        detailexportbill.filter((x) => x._id !== material._id)
      );
    } else {
      setDetailExportBill(
        detailexportbill.map((x) =>
          x._id === material._id
            ? { ...exist, quantity: exist.quantity - 1 }
            : x
        )
      );
    }
  };

  const [dataDate, setDate] = useState(new Date());
  const ExampleCustomInput = ({ value, onClick }) => (
    <button className="button-date-picker" onClick={onClick}>
      {value}
      <IoMdArrowDropdown />
    </button>
  );

  // const param = useParams();

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setExportBill({ ...exportbill, [name]: value });
  };

  return (
    <>
      <div className="layout">
        <div className="layout-first">
          <Header />
        </div>
        <div className="layout-second">
          <NavBar />
          <div className="create-exportbill">
            <div className="row search-material">
              <input
                type="text"
                name="tenpn"
                placeholder="Nhập tên vật tư"
                id="inputsearch"
                required
                autocomplete="off"
                disabled={exportbill.makho == "" ? true : false}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  document.getElementById("list-material").style.display =
                    "block";
                }}
              />
            </div>
            <div
              className="list-material"
              id="list-material"
              style={{ display: searchTerm !== "" ? "block" : "none" }}
            >
              <div className="header-list-material">
                <p>ID</p>
                <p>Tên VT</p>
                <p>Hình ảnh</p>
                <p>Số lượng tồn</p>
                <p>Giá nhập</p>
              </div>
              {materialsfilter
                ?.filter((material) => {
                  if (searchTerm == "") {
                    return null;
                  } else if (
                    (material._id
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                      material.tenvt
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())) &&
                    material.trangthai === "Đang kinh doanh"
                  ) {
                    return material;
                  }
                })
                ?.map((material, index) => (
                  <div
                    className="item-material"
                    onClick={() => {
                      setOnSearch(false);
                      AddToExportBill(material);
                    }}
                  >
                    <p>{material._id}</p>
                    <p>{material.tenvt}</p>
                    <p>
                      <img
                        width="80"
                        height="40"
                        src={material.images.url}
                        alt=""
                      ></img>
                    </p>
                    <p>
                      {material.soluong} {material.donvi}
                    </p>
                    <p>{Format(material.giaxuat)}</p>
                  </div>
                ))}
            </div>

            <div className="form-bill">
              <p className="header-title">Nhập Thông Tin Phiếu Xuất</p>

              <div className="item-first">
                <div className="row">
                  <label htmlFor="title">Ngày lập</label>

                  <DatePicker
                    className="date-picker"
                    format="DD-MM-YYYY"
                    placeholder="Nhập ngày"
                    minDate={new Date("10-20-2021")}
                    maxDate={new Date()}
                    dateFormat="dd-MM-yyyy"
                    selected={currentDate}
                    onChangeRaw={(e) => e.preventDefault()}
                    onChange={(date) => {
                      setCurrentDate(date);
                      console.log("date : ", typeof date);

                      setExportBill({
                        ...exportbill,
                        ngay: moment(date).format("MM-DD-YYYY"),
                      });
                    }}
                    value={currentDate}
                  />
                </div>

                <div className="row">
                  <label htmlFor="newwarehouses">Kho</label>
                  <select
                    name="makho"
                    className="select-warehouse"
                    value={exportbill.makho}
                    onChange={handleChangeInput}
                  >
                    <option value="" disabled selected hidden>
                      Vui lòng chọn kho
                    </option>
                    {newwarehouses.map((warehouse) => (
                      <option value={warehouse._id}>{warehouse.tenkho}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="item-first">
                <div className="row">
                  <label className="id">ID Nhân Viên : </label>
                  {user._id}
                </div>

                <div className="row">
                  <label htmlFor="newwarehouses">Họ tên :</label>
                  {user.hoten}
                </div>
              </div>
              {
                <div className="list-item-bill">
                  <h3>Danh sách vật tư</h3>
                  <div className="header-item-bill">
                    <p style={{ width: "70px" }}>STT</p>
                    <p style={{ flex: 1 }}>Tên VT</p>
                    <p style={{ flex: 1 }}>Hình Ảnh</p>
                    <p style={{ flex: 1 }}>Đơn Giá</p>
                    <p style={{ flex: 1 }}>Số Lượng</p>
                    <p style={{ flex: 1 }}>Tổng Tiền</p>
                    <p style={{ width: "70px" }}></p>
                  </div>
                  {detailexportbill?.map((item, index) => {
                    return (
                      <div className="item-bill">
                        <div
                          className="item-bill-element"
                          style={{ width: "70px" }}
                        >
                          {index + 1}
                        </div>
                        <div className="item-bill-element" style={{ flex: 1 }}>
                          {item.tenvt}
                        </div>
                        <div className="item-bill-element" style={{ flex: 1 }}>
                          <img
                            width="160"
                            height="100"
                            src={item.images.url}
                            alt=""
                          ></img>
                        </div>
                        <div className="item-bill-element" style={{ flex: 1 }}>
                          {Format(item.giaxuat)}
                        </div>
                        <div className="item-bill-element" style={{ flex: 1 }}>
                          <button
                            onClick={() => RemoveToExportBill(item)}
                            className="remove"
                          >
                            -
                          </button>
                          <input
                            type="text"
                            required
                            autocomplete="off"
                            maxlength="3"
                            onChange={(event) => {
                              if (
                                event.target.value.length > 0 &&
                                event.target.value.length < 4
                              ) {
                                console.log(
                                  "event.target.value : ",
                                  parseInt(event.target.value)
                                );
                                // console.log('typeof(event.target.value) : ',typeof(event.target.value))
                                AddToExportBill(
                                  item,
                                  parseInt(event.target.value),
                                  true
                                );
                              } else if (event.target.value.length === 0) {
                                AddToExportBill(item, 0, true);
                              }
                            }}
                            value={item.quantity}
                            className="input-quantity"
                            // onKeyDown="if(this.value.length==2 && event.keyCode!=8) return false;"
                          />
                          <button
                            onClick={() => {
                              if (item.quantity < 1000) {
                                AddToExportBill(item, 1, false);
                              }
                            }}
                            className="add"
                          >
                            +
                          </button>
                        </div>

                        <div className="item-bill-element" style={{ flex: 1 }}>
                          {Format(item.giaxuat * item.quantity)}
                        </div>

                        <div
                          className="item-bill-element"
                          style={{ width: "70px" }}
                        >
                          <RiDeleteBin6Line
                            style={{ color: "red", fontSize: "36px" }}
                            className="delete-item"
                            onClick={() => {
                              setDetailExportBill(
                                detailexportbill.filter(
                                  (x) => x._id !== item._id
                                )
                              );
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div
                    className="item-bill"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      height: "40px",
                    }}
                  >
                    Tổng Cộng: {Format(onLoadTotal())}
                  </div>
                </div>
              }
            </div>
            <div className="button-option-exportbill">
              <button
                className={exportbill.makho == "" ? "deactive" : null}
                onClick={async () => {
                  if (detailexportbill.length == 0) {
                    setMessage(
                      "Phiếu chưa có vật tư, vui lòng thêm  vật tư vào phiếu"
                    );
                    setOpenAlert(true);
                  } else {
                    //Kiểm tra vượt số lượng tồn trong kho
                    var checkoverstorage = false;
                    var materialoverstorage = {};
                    detailexportbill?.map((ctpx) => {
                      if (!checkoverstorage) {
                        materialoverstorage = materialsfilter.find((vt) => {
                          if (ctpx._id === vt._id) {
                            if (ctpx.quantity > vt.soluong) {
                              checkoverstorage = true;
                            }
                            return ctpx.quantity > vt.soluong;
                          }
                        });
                      }
                    });

                    if (!checkoverstorage) {
                      //Nếu đủ số lượng tồn
                      exportbill.ngay =
                        exportbill.ngay.slice(0, 3) +
                        (parseInt(exportbill.ngay.slice(3, 5)) + 1) +
                        exportbill.ngay.slice(5, 10);
                      console.log("exportbill nè : ", exportbill);
                      console.log("detailexportbill nè : ", detailexportbill);
                      // setCallback(!callback);
                      try {
                        const res = await axios.post(
                          "/api/phieuxuat",
                          {
                            ...exportbill,
                            ctpx: detailexportbill.map((item) => ({
                              mavt: item._id,
                              giaxuat: item.giaxuat,
                              soluong: item.quantity,
                            })),
                          },
                          {
                            headers: { Authorization: token },
                          }
                        );
                        setMessage(res.data.message);
                        setOpenAlert(true);

                        setCallback(!callback);
                      } catch (err) {
                        setMessage(err.response.data.message);
                        setOpenAlert(true);
                      }
                    } else {
                      setMessage(
                        materialoverstorage.tenvt + " không đủ số lượng tồn"
                      );
                      setOpenAlert(true);
                    }
                  }
                }}
              >
                Lập Phiếu
              </button>
              {/* <button>Hủy</button> */}
              <Link to="/phieuxuat">
                <button>Hủy</button>
              </Link>
            </div>
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

  function onLoadTotal() {
    var totalcost = 0;
    detailexportbill.map((ipbill) => {
      totalcost += ipbill.giaxuat * ipbill.quantity;
    });
    return totalcost;
  }
}

export default CreateExportBill;
