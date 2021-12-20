import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../../GlobalState";
import DatePicker from "react-datepicker";
// import Moment from 'react-moment';
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import ImportBillItem from "./ImportBillItem";
import NavBar from "../../../navbar/NavBar";
import Header from "../../../header/Header";
import { GiExplosiveMaterials } from "react-icons/gi";
import { BiBookAdd } from "react-icons/bi";
import { IoMdArrowDropdown } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";

function CreateImportBill() {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [inforuser] = state.userAPI.inforuser;
  const [materials] = state.materialAPI.materials;
  const [materialsfilter, setMaterialsFilter] = useState(materials);
  const [warehouses] = state.warehouseAPI.warehouses;
  const [importbills] = state.importbillAPI.importbills;
  const [detailimportbill, setDetailImportBill] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("inforuser"))
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [callback, setCallback] = state.importbillAPI.callback;
  // const [hdn, setHDN] = useState(new Date("10-20-2021"));
  const [searchTerm, setSearchTerm] = useState("");
  const [onShow, setOnShow] = useState(false);
  const [importbill, setImportBill] = useState({
    ngay: "",
    manv: "",
    makho: "",
    ctpn: [],
  });

  const [openalert, setOpenAlert] = useState(false);

  const [message, setMessage] = useState("");

  const Format = (number) => {
    if (number >= 0) {
      return String(number).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND";
    } else
      return (
        "-" + String(number * -1).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND"
      );
  };

  useEffect(() => {}, [openalert]);

  useEffect(async () => {
    const res = await axios.post("/api/thongke/timkiemvattuphieunhap", {
      makhofilter: importbill.makho,
    });

    setMaterialsFilter(res.data);
    setDetailImportBill([]);
  }, [importbill.makho]);

  useEffect(() => {
    setImportBill({
      ngay: moment(new Date()).format("MM-DD-yyy"),
      manv: JSON.parse(localStorage.getItem("inforuser"))._id,
      makho: "",
      ctpn: [],
    });
    setDetailImportBill([]);
  }, [importbills]);

  const newwarehouses = warehouses.filter((warehouse) =>
    user.madaily._id === warehouse.madaily._id ? warehouse : undefined
  );

  const AddToImportBill = (material, soluong, typing) => {
    if (searchTerm) {
      setSearchTerm("");
      document.getElementById("inputsearch").value = "";
    }

    const exist = detailimportbill.find((x) => x._id === material._id);
    if (exist) {
      setDetailImportBill(
        detailimportbill?.map((x) =>
          x._id === material._id
            ? {
                ...exist,
                quantity: typing ? soluong : exist.quantity + soluong,
              }
            : x
        )
      );
    } else {
      setDetailImportBill([...detailimportbill, { ...material, quantity: 1 }]);
    }
  };

  const RemoveToImportBill = (material) => {
    const exist = detailimportbill.find((x) => x._id === material._id);
    if (exist.quantity === 1) {
      setDetailImportBill(
        detailimportbill?.filter((x) => x._id !== material._id)
      )
      ;
    } else {
      setDetailImportBill(
        detailimportbill?.map((x) =>
          x._id === material._id
            ? { ...exist, quantity: exist.quantity - 1 }
            : x
        )
      );
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setLoading(!loading);
    setImportBill({ ...importbill, [name]: value });
  };

  return (
    <>
      <div className="layout">
        <div className="layout-first">
          <Header />
        </div>
        <div className="layout-second">
          <NavBar />
          <div className="create-importbill">
            <div className="row search-material">
              <input
                type="text"
                name="tenpn"
                placeholder="Tìm kiếm vật tư"
                id="inputsearch"
                required
                onClick={() => {
                  setOnShow(true);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setOnShow(false);
                  }, 200);
                }}
                autocomplete="off"
                disabled={importbill.makho == "" ? true : false}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                }}
              />
            </div>
            <div
              className="list-material"
              id="list-material"
              style={{ display: onShow ? "block" : "none" }}
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
                  if (!onShow) {
                    return null;
                  } else if (
                    onShow &&
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
                .map((material, index) => (
                  <div
                    className="item-material"
                    onClick={() => {
                      AddToImportBill(material, 1, false);
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
                    <p>{Format(material.gianhap)}</p>
                  </div>
                ))}
            </div>

            <div className="form-bill">
              <p className="header-title">Nhập Thông Tin Phiếu Nhập</p>
              <div className="item-first">
                <div className="row">
                  <label htmlFor="title">Ngày lập</label>
                  <DatePicker
                    className="date-picker"
                    minDate={new Date("10-20-2017")}
                    maxDate={new Date()}
                    onChangeRaw={(e) => e.preventDefault()}
                    dateFormat="dd-MM-yyyy"
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    selected={currentDate}
                    onChange={(date) => {
                      setCurrentDate(date);
                      console.log(
                        "datetest : ",
                        moment(date).format("MM-DD-YYYY")
                      );
                      setImportBill({
                        ...importbill,
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
                    value={importbill.makho}
                    onChange={handleChangeInput}
                  >
                    <option value="" disabled selected hidden>
                      Vui lòng chọn kho
                    </option>
                    {newwarehouses.map((warehouse) =>
                      warehouse.trangthai === "Đang hoạt động" ? (
                        <option value={warehouse._id}>
                          {warehouse.tenkho}
                        </option>
                      ) : null
                    )}
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
                  {detailimportbill?.map((item, index) => {
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
                          {Format(item.gianhap)} / {item.donvi}
                        </div>

                        <div className="item-bill-element" style={{ flex: 1 }}>
                          <button
                            onClick={() => RemoveToImportBill(item)}
                            className="remove"
                          >
                            -
                          </button>

                          <input
                            type="text"
                            required
                            autocomplete="off"
                            maxLength="3"
                            onChange={(event) => {
                              if (
                                event.target.value.length > 0 &&
                                event.target.value.length < 4
                              ) {
                                AddToImportBill(
                                  item,
                                  parseInt(event.target.value),
                                  true
                                );
                              } else if (event.target.value.length === 0) {
                                AddToImportBill(item, 0, true);
                              }
                            }}
                            value={item.quantity}
                            className="input-quantity"
                            // onKeyDown="if(this.value.length==2 && event.keyCode!=8) return false;"
                          />
                          <button
                            onClick={() => {
                              if (item.quantity < 1000) {
                                AddToImportBill(item, 1, false);
                              }
                            }}
                            className="add"
                          >
                            +
                          </button>
                        </div>

                        <div className="item-bill-element" style={{ flex: 1 }}>
                          {Format(item.gianhap * item.quantity)}
                        </div>

                        <div
                          className="item-bill-element"
                          style={{ width: "70px" }}
                        >
                          <RiDeleteBin6Line
                            style={{ color: "red", fontSize: "36px" }}
                            onClick={() => {
                              setDetailImportBill(
                                detailimportbill?.filter(
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
            <div className="button-option-importbill">
              <button
                className={importbill.makho == "" ? "deactive" : null}
                onClick={async () => {
                  if (detailimportbill.length == 0) {
                    setMessage(
                      <p className="message">
                        Phiếu chưa có vật tư, vui lòng thêm vật tư vào phiếu
                      </p>
                    );
                    setOpenAlert(true);
                    // alert('Phiếu chưa có vật tư, vui lòng thêm  vật tư vào phiếu')
                  } else {
                    importbill.ngay =
                      importbill.ngay.slice(0, 3) +
                      (parseInt(importbill.ngay.slice(3, 5)) + 1) +
                      importbill.ngay.slice(5, 10);

                    try {
                      const res = await axios.post(
                        "/api/phieunhap",
                        {
                          ...importbill,
                          ctpn: detailimportbill?.map((item) => ({
                            mavt: item._id,
                            gianhap: item.gianhap,
                            soluong: item.quantity,
                          })),
                        },
                        {
                          headers: { Authorization: token },
                        }
                      );
                      console.log("importbill nè : ", importbill);

                      //  alert(res.data.message);
                      setMessage(<p className="message">{res.data.message}</p>);
                      setOpenAlert(true);
                      setCallback(!callback);
                    } catch (err) {
                      //  alert(err.response.data.message);
                      setMessage(
                        <p className="message">{err.response.data.message}</p>
                      );
                      setOpenAlert(true);
                    }
                  }
                }}
              >
                Lập Phiếu
              </button>
              <Link to="/phieunhap">
                <button>Hủy</button>
              </Link>
              {/* /phieunhap */}
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
    detailimportbill?.map((ipbill) => {
      totalcost += ipbill.gianhap * ipbill.quantity;
    });
    return totalcost;
  }
}

export default CreateImportBill;
