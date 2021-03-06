import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import { GlobalState } from "../../../GlobalState";
import EmployeeItem from "./EmployeeItem";
import NavBar from "../../navbar/NavBar";
import Header from "../../header/Header";
import Loading from "../utils/loading/Loading";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { FaFileExport } from "react-icons/fa";
import { BiBookAdd } from "react-icons/bi";
import Pagination from "../../common/Pagination";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const initialEmployee = {
  hoten: "",
  madaily: "",
  diachi: "",
  username: "",
  password: "",
  gioitinh: "nam",
  role: "user",
  sodienthoai: "",
  cmnd: "",
  email: "",
  trangthai: "Đang làm",
};

function Employees() {
  const state = useContext(GlobalState);
  const [employee, setEmployee] = useState(initialEmployee);
  const [storageemployee, setStorageEmployee] = useState([]);
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  const param = useParams();

  const [employees] = state.employeeAPI.employees;
  const [listEmployeeSearch, setListEmployeeSearch] = useState(employees);
  const [searchTerm, setSearchTerm] = useState("");

  const [stores] = state.storeAPI.stores;
  const [onEdit, setOnEdit] = useState(false);
  const [callback, setCallback] = state.employeeAPI.callback;

  const [openalert, setOpenAlert] = useState(false);

  const [message, setMessage] = useState("");

  const [deactive_button, setDeactive_Button] = useState(false);
  let inforuser = JSON.parse(localStorage.getItem("inforuser"));

  useEffect(() => {
    setCallback(!callback);
  }, []);

  //============ XUẤT FILE ==============
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const DATE = moment(new Date()).format("DD-MM-YYYY");

  const customData = (dataImport) => {
    let dataExport = [];
    // console.log("dataImport : ", dataImport.listEmployeeSearch);

    dataExport = dataImport.listEmployeeSearch.map((data, index) => ({
      STT: index + 1,
      ID: data._id,
      "Họ tên": data.hoten,
      "Giới tính": data.gioitinh,
      "Đại lý": data.madaily.tendl,
      Quyền: data.role,
      "Trạng thái": data.trangthai,
      Username: data.username,
      "Số điện thoại": data.sodienthoai,
      CMND: data.cmnd,
      Email: data.email,
    }));
    return dataExport;
  };

  const exportToCSV = (csvData, fileName) => {
    customData(csvData);
    const ws = XLSX.utils.json_to_sheet(customData(csvData));
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  //=======================================

  //-------------- Phân trang ----------------
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5);

  // Get current posts
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;

  // Lấy ra danh sách kho có trong từ khóa search
  useEffect(() => {
    if (inforuser.role === "user") {
      setListEmployeeSearch(
        employees?.filter((employee) => {
          if (
            searchTerm === "" &&
            inforuser.madaily._id.toString() === employee.madaily._id.toString()
          ) {
            return employee;
          } else if (
            (employee._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
              employee.hoten.toLowerCase().includes(searchTerm.toLowerCase()) ||
              employee.madaily.tendl
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
              employee.trangthai
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) &&
            inforuser.madaily._id.toString() === employee.madaily._id.toString()
          ) {
            return employee;
          }
        })
      );
    } else {
      setListEmployeeSearch(
        employees?.filter((employee) => {
          if (searchTerm === "") {
            return employee;
          } else if (
            employee._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.hoten.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.madaily.tendl
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.trangthai.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            return employee;
          }
        })
      );
    }

    setCurrentPage(1); //Khởi tạo lại trang hiện tại là 1
  }, [searchTerm, employees]);

  //Gán list vào trang hiện tại
  const currentEmployees = listEmployeeSearch?.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      // console.log("dữ liệu ảnh : ", res.data);
      // console.log("dữ liệu ảnh url : ", res.data.url);
      setImages(res.data);
    } catch (error) {
      setMessage(<p className="message">{error.response.data.message}</p>);
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
    } catch (error) {
      setMessage(<p className="message">{error.response.data.message}</p>);
      setOpenAlert(true);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    // console.log("e.target.value : ", e.target.value);
    setEmployee({ ...employee, [name]: value });
  };

  const styleUpload = {
    display: images ? "block" : "none",
  };

  const AddEmployee = () => {
    setImages(false);
    setOnEdit(false);
    setEmployee(initialEmployee);
    document
      .getElementById("modal_container__employee")
      .classList.add("modal_active");
  };

  const EditEmployee = (data_employee_edit) => {
    // console.log("data_employee_edit : ", data_employee_edit);

    setOnEdit(true);
    setEmployee({
      ...data_employee_edit,
      madaily: data_employee_edit.madaily._id,
    });

    setStorageEmployee(data_employee_edit);
    setImages(data_employee_edit.images);
    document
      .getElementById("modal_container__employee")
      .classList.add("modal_active");
  };

  const CloseModalEmployee = () => {
    document
      .getElementById("modal_container__employee")
      .classList.remove("modal_active");
  };

  const AddToListEmployee = async (e) => {
    // //Thêm mới
    setDeactive_Button(true);
    if (!onEdit) {
      try {
        const res = await axios.post(
          "/api/auth/register",
          { ...employee, images },
          {
            headers: { Authorization: token },
          }
        );
        setMessage(<p className="message">{res.data.message}</p>);
        setOpenAlert(true);

        document
          .getElementById("modal_container__employee")
          .classList.remove("modal_active");
        setCallback(!callback);
        //  history.push("/vattu");
      } catch (error) {
        setMessage(<p className="message">{error.response.data.message}</p>);
        setOpenAlert(true);
      }
    }
    //Cập nhật thông tin nhân viên
    if (onEdit) {
      if (
        inforuser.username === employee.username &&
        inforuser.trangthai !== employee.trangthai &&
        inforuser.madaily._id !== employee.madaily._id
      ) {
        const infordaily = stores.find((storeitem) => {
          return storeitem._id.toString() === employee.madaily.toString();
        });

        inforuser.madaily = infordaily;
        localStorage.setItem("inforuser", JSON.stringify(inforuser));
      }

      try {
        const res = await axios.put(
          `/api/nhanvien/${employee._id}`,
          {
            ...employee,
            images,
          },
          {
            headers: { Authorization: token },
          }
        );

        setMessage(<p className="message">{res.data.message}</p>);
        setOpenAlert(true);

        document
          .getElementById("modal_container__employee")
          .classList.remove("modal_active");
        setCallback(!callback);
      } catch (err) {
        setMessage(<p className="message">{err.response.data.message}</p>);
        setOpenAlert(true);
      }
    }
    setDeactive_Button(false);
  };

  const DeleteEmployee = async (id, public_id) => {
    if (inforuser._id.toString() === id) {
      setMessage(
        <p className="message">
          Tài khoảng đang đăng nhập <br /> không thể xóa
        </p>
      );
      setOpenAlert(true);
    } else {
      try {
        //Xóa vật tư trong db
        const deleteemployee = await axios.delete(`/api/nhanvien/${id}`, {
          headers: { Authorization: token },
        });

        //Nếu xóa thành công thì xóa ảnh
        if (deleteemployee.data.success) {
          setLoading(true);
          //Xóa ảnh trên cloudinary
          await axios.post(
            "/api/destroy",
            {
              public_id,
            },
            { headers: { Authorization: token } }
          );
          setLoading(false);
        }

        // alert(deleteemployee.data.message);

        setMessage(deleteemployee.data.message);
        setOpenAlert(true);

        setCallback(!callback);
      } catch (err) {
        //  alert(err.response.data.message);
        setMessage(<p className="message">{err.response.data.message}</p>);
        setOpenAlert(true);
      }
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
          <div className="employees">
            <div className="header-title">
              <div className="row search-employee">
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
              <div className="title-tab">
                <h2 style={{ display: "flex", alignItems: "center" }}>
                  <BsFillPersonLinesFill style={{ marginRight: "5px" }} />
                  Nhân Viên
                </h2>
              </div>
              {isAdmin ? (
                <>
                  <button className="add-item" onClick={AddEmployee}>
                    <BiBookAdd
                      style={{ marginRight: "5px", marginTop: "5px" }}
                    />
                    Thêm Nhân Viên
                  </button>

                  <button
                    className="add-item"
                    onClick={() => {
                      exportToCSV(
                        { listEmployeeSearch },
                        `DanhSachNhanVien_${DATE}`
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
            <div className="header_list">
              <p style={{ width: "70px" }}>STT</p>
              <p style={{ width: "160px" }}>ID</p>
              <p style={{ flex: 1 }}>Họ tên</p>
              <p style={{ flex: 1 }}>Hình ảnh</p>
              <p style={{ flex: 1 }}>Đại lý</p>
              <p style={{ flex: 1 }}>Quyền</p>
              <p style={{ flex: 1 }}>Trạng thái</p>
              {isAdmin ? (
                <>
                  <p style={{ flex: 1 }}>Chức năng</p>
                </>
              ) : null}
            </div>
            {currentEmployees.map((employee, index) => {
              // console.log(employee);

              if (isAdmin) {
                return (
                  <EmployeeItem
                    key={index}
                    employee={employee}
                    stt={(currentPage - 1) * employeesPerPage + index}
                    EditEmployee={EditEmployee}
                    DeleteEmployee={DeleteEmployee}
                  />
                );
              } else {
                if (
                  employee.madaily._id.toString() ===
                  inforuser.madaily._id.toString()
                ) {
                  // if(employee.madaily._id.toString() === inforuser.madaily)
                  return (
                    <EmployeeItem
                      key={index}
                      employee={employee}
                      stt={(currentPage - 1) * employeesPerPage + index}
                      EditEmployee={EditEmployee}
                      DeleteEmployee={DeleteEmployee}
                    />
                  );
                }
              }
            })}

            <Pagination
              itemsPerpage={employeesPerPage}
              totalItems={listEmployeeSearch?.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>

      <div className="modal_container__employee" id="modal_container__employee">
        <div className="modal__employee">
          <h2 className="title_add__employee">
            {onEdit ? "Cập Nhật Thông Tin Nhân Viên" : "Thêm Nhân Viên"}
          </h2>
          <div className="row">
            <label htmlFor="title">Họ tên</label>
            <input
              type="text"
              name="hoten"
              placeholder="Nhập họ tên"
              id="hoten"
              required
              autoComplete="off"
              value={employee.hoten}
              onChange={handleChangeInput}
            />
          </div>
          {/* <div className="row">{employee.madaily.tendl}</div> */}

          <div className="row">
            <label htmlFor="stores">Đại lý</label>
            <select
              className="select-daily-nhanvien"
              name="madaily"
              value={employee.madaily}
              onChange={handleChangeInput}
            >
              <option value="" disabled selected hidden>
                Vui lòng chọn đại lý
              </option>
              {stores.map((daily) => (
                <option value={daily._id}>{daily.tendl}</option>
              ))}
            </select>
          </div>

          <div className="row">
            <label htmlFor="title">Địa chỉ</label>
            <input
              type="text"
              name="diachi"
              autoComplete="off"
              placeholder="Nhập địa chỉ"
              id="diachi"
              required
              value={employee.diachi}
              onChange={handleChangeInput}
            />
          </div>

          {onEdit ? (
            <></>
          ) : (
            <>
              <div className="row">
                <label htmlFor="title">Username</label>
                <input
                  type="text"
                  name="username"
                  autoComplete="off"
                  placeholder="Nhập username"
                  maxLength="25"
                  id="username"
                  required
                  value={employee.username}
                  onChange={handleChangeInput}
                />
              </div>

              <div className="row">
                <label htmlFor="soluong">Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  autoComplete="off"
                  placeholder="Nhập mật khẩu"
                  id="password"
                  required
                  value={employee.password}
                  onChange={handleChangeInput}
                />
              </div>
            </>
          )}

          <div className="row">
            <label htmlFor="role">Giới Tính</label>
            <select
              className="select-daily-nhanvien"
              name="gioitinh"
              value={employee.gioitinh}
              onChange={handleChangeInput}
            >
              <option value="nam" selected>
                Nam
              </option>
              <option value="nữ">Nữ</option>
            </select>
          </div>

          <div className="row">
            <label htmlFor="role">Quyền</label>
            <select
              className="select-daily-nhanvien"
              name="role"
              value={employee.role}
              onChange={handleChangeInput}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="row">
            <label htmlFor="sodienthoai">Số điện thoại</label>
            <input
              name="sodienthoai"
              autoComplete="off"
              placeholder="Nhập số điện thoại"
              id="sodienthoai"
              required
              value={employee.sodienthoai}
              maxlength="10"
              onChange={handleChangeInput}
            />
          </div>

          <div className="row">
            <label htmlFor="price">Chứng minh nhân dân</label>
            <input
              type="cmnd"
              name="cmnd"
              autoComplete="off"
              placeholder="Nhập cmnd"
              id="cmnd"
              required
              value={employee.cmnd}
              maxlength="9"
              onChange={handleChangeInput}
            />
          </div>

          <div className="row">
            <label htmlFor="price">Email</label>
            <input
              type="text"
              name="email"
              autoComplete="off"
              placeholder="Nhập email"
              id="email"
              required
              value={employee.email}
              maxlength="32"
              onChange={handleChangeInput}
            />
          </div>

          <div className="row">
            <label>Trạng thái</label>
            <select
              className="select-daily-nhanvien"
              name="trangthai"
              autoComplete="off"
              value={employee.trangthai}
              onChange={handleChangeInput}
              disabled={onEdit ? false : true}
            >
              <option value="Đang làm">Đang làm</option>
              <option value="Chuyển công tác">Chuyển công tác</option>
              <option value="Nghỉ việc">Nghỉ việc</option>
            </select>
          </div>

          <div className="upload-img-employee">
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
            <button id="add" onClick={AddToListEmployee}>
              {onEdit ? "Cập Nhật" : "Thêm"}
            </button>
            <button
              disabled={deactive_button ? true : false}
              className={deactive_button ? "deactive_button" : null}
              id="close"
              onClick={CloseModalEmployee}
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
                  //  document.getElementById("modal_container__notification").classList.remove("modal_active");
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

export default Employees;
