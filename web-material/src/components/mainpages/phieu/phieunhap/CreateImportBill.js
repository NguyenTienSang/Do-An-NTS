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
  const [hdn, setHDN] = useState(new Date("10-20-2021"));
  const [searchTerm, setSearchTerm] = useState("");
  const [onSearch, setOnSearch] = useState(false);
  const [importbill, setImportBill] = useState({
    // tenpn: "",
    ngay: "",
    manv: "",
    makho: "",
    ctpn: [],
  });

  const [openalert, setOpenAlert] = useState(false);

  const [message, setMessage] = useState("");

  const Format = (number) => {
    return String(number).replace(/(.)(?=(\d{3})+$)/g, "$1.") + " VND";
  };

  useEffect(() => {}, [openalert]);

  useEffect(async () => {
    console.log("load lại dữ liệu materialsfilter");
    const res = await axios.post(
      "/api/thongke/timkiemvattuphieunhap",
      //  [JSON.parse(localStorage.getItem('inforuser')).madaily._id,exportbill.makho]
      { makhofilter: importbill.makho }
    );
    console.log("Dữ liệu thống kê : ", res.data);
    // console.log('madailyfilter : ',madailyfilter);
    // console.log('makhofilter : ',makhofilter);

    setMaterialsFilter(res.data);
  }, [importbill.makho]);

  useEffect(() => {
    setImportBill({
      // tenpn:'PN' + (importbills.length+1),
      ngay: moment(new Date()).format("MM-DD-yyy"),
      manv: JSON.parse(localStorage.getItem("inforuser"))._id,
      makho: "",
      ctpn: [],
    });
    setDetailImportBill([]);
  }, [importbills]);

  console.log("warehouses : ", warehouses);
  const newwarehouses = warehouses.filter((warehouse, index) =>
    user.madaily._id === warehouse.madaily._id ? warehouse : undefined
  );

  const AddToImportBill = (material, soluong, typing) => {
    if (!onSearch) {
      document.getElementById("list-material").style.display = "none";
      document.getElementById("inputsearch").value = "";
    }
    const exist = detailimportbill.find((x) => x._id === material._id);
    if (exist) {
      setDetailImportBill(
        detailimportbill.map((x) =>
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
        detailimportbill.filter((x) => x._id !== material._id)
      );
    } else {
      setDetailImportBill(
        detailimportbill.map((x) =>
          x._id === material._id
            ? { ...exist, quantity: exist.quantity - 1 }
            : x
        )
      );
    }
  };

  const [dataDate, setDate] = useState(new Date());
  // const ExampleCustomInput = ({ value, onClick }) => (
  //   <button className="button-date-picker" onClick={onClick}>
  //     {value}
  //     <IoMdArrowDropdown/>
  //   </button>
  // );

  const param = useParams();

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
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
                placeholder="Nhập tên vật tư"
                id="inputsearch"
                required
                autocomplete="off"
                disabled={importbill.makho == "" ? true : false}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  document.getElementById("list-material").style.display =
                    "block";
                }}
              />
            </div>
            <div className="list-material" id="list-material">
              <div className="header-list-material">
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
                    material.tenvt
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  ) {
                    return material;
                  }
                })
                .map((material, index) => (
                  <div
                    className="item-material"
                    onClick={() => {
                      setOnSearch(false);
                      AddToImportBill(material, 1);
                    }}
                  >
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

              {/* <div className="row">
              <label htmlFor="title">Tên phiếu nhập</label>
              <input
                type="text"
                name="tenpn"
                disabled
                id="tenpn"
                required
                value={importbill.tenpn}
                onChange={handleChangeInput}
              />
      </div> */}

              <div className="item-first">
                <div className="row">
                  <label htmlFor="title">Ngày lập</label>

                  {/* <input type='date' name="ngay"
          value={importbill.ngay} 
          // min="2017-04-01" max="2017-04-30"
          required pattern="\d{4}-\d{2}-\d{2}"
          onChange={handleChangeInput}/> */}

                  <DatePicker
                    className="date-picker"
                    format="DD-MM-YYYY"
                    minDate={new Date("10-20-2021")}
                    maxDate={new Date()}
                    onChangeRaw={(e) => e.preventDefault()}
                    dateFormat="dd-MM-yyyy"
                    selected={currentDate}
                    onChange={(date) => {
                      setCurrentDate(date);
                      // console.log('date : ',moment(date).format('MM-DD-YYYY'))

                      // const datetest = moment(date).format('DD-MM-yyy');
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

                    // customInput={<ExampleCustomInput />}
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
                    <p>STT</p>
                    <p>Tên VT</p>
                    <p>Hình Ảnh</p>
                    <p>Đơn Giá</p>
                    <p>Số Lượng</p>
                    <p>Tổng Tiền</p>
                    <p></p>
                  </div>
                  {detailimportbill.map((item, index) => {
                    return (
                      <div className="item-bill">
                        <div>{index + 1}</div>
                        <div>{item.tenvt}</div>
                        <img
                          width="160"
                          height="100"
                          src={item.images.url}
                          alt=""
                        ></img>

                        <div>{Format(item.gianhap)}</div>

                        <button
                          onClick={() => RemoveToImportBill(item)}
                          className="remove"
                        >
                          -
                        </button>
                        {/* <div>{item.quantity}</div> */}
                        <input
                          type="text"
                          required
                          autocomplete="off"
                          maxlength="3"
                          // min="1" max="1000"
                          // value={exportbill.tenpx}
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

                        <div>{Format(item.gianhap * item.quantity)}</div>

                        <div>
                          <RiDeleteBin6Line
                            className="delete-item"
                            onClick={() => {
                              setDetailImportBill(
                                detailimportbill.filter(
                                  (x) => x._id !== item._id
                                )
                              );
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              }
            </div>
            <div className="button-option-importbill">
              <button
                className={importbill.makho == "" ? "deactive" : null}
                onClick={async () => {
                  if (detailimportbill.length == 0) {
                    setMessage(
                      "Phiếu chưa có vật tư, vui lòng thêm  vật tư vào phiếu"
                    );
                    setOpenAlert(true);
                    // alert('Phiếu chưa có vật tư, vui lòng thêm  vật tư vào phiếu')
                  } else {
                    importbill.ngay =
                      importbill.ngay.slice(0, 3) +
                      (parseInt(importbill.ngay.slice(3, 5)) + 1) +
                      importbill.ngay.slice(5, 10);
                    console.log("importbill nè : ", importbill);
                    // console.log('detailimportbill : ',detailimportbill.map(item => ({
                    //               mavt : item._id, gianhap : item.gianhap,soluong : item.quantity
                    //             })) )
                    try {
                      const res = await axios.post(
                        "/api/phieunhap",
                        {
                          ...importbill,
                          ctpn: detailimportbill.map((item) => ({
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
                      setMessage(res.data.message);
                      setOpenAlert(true);
                      setCallback(!callback);
                    } catch (err) {
                      //  alert(err.response.data.message);
                      setMessage(err.response.data.message);
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

export default CreateImportBill;
