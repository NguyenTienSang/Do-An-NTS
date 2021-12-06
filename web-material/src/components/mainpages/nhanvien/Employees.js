import axios from "axios";
import React, { useContext, useState, useEffect  } from "react";
import { useHistory, useParams } from "react-router-dom";

import { GlobalState } from "../../../GlobalState";
import EmployeeItem from "./EmployeeItem";
import NavBar from "../../navbar/NavBar";
import Header from "../../header/Header";
import Loading from "../utils/loading/Loading";
import {BsFillPersonLinesFill} from 'react-icons/bs';
import {BiBookAdd} from 'react-icons/bi';




const initialEmployee = {
  hoten:"",
  madaily:"",
  diachi:"",
  username:"",
  password:"",
  role:"",
  sodienthoai:"",
  cmnd:"",
  tinhtrang:"Đang làm",
};

function Employees() {
  const state = useContext(GlobalState);
  const [employee, setEmployee] = useState(initialEmployee);
  
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdmin] = state.userAPI.isAdmin;
  // const [inforuser] = state.userAPI.inforuser;
  const [token] = state.token;

  const history = useHistory();
  const param = useParams();

  const [searchTerm,setSearchTerm] = useState("");
  const [employees] = state.employeeAPI.employees;
  const [stores] = state.storeAPI.stores;
  const [onEdit, setOnEdit] = useState(false);
  const [callback, setCallback] = state.employeeAPI.callback;
  
  const [openalert,setOpenAlert] = useState(false);

  const [message,setMessage] = useState("");

  const inforuser = JSON.parse(localStorage.getItem('inforuser'));

  
  useEffect(() => {
    console.log('param.id : ');
    console.log('param.id2 : ',param.id);
    if (param.id) {
      setOnEdit(true);
      employees.forEach((employee) => {
        if (employee._id === param.id) {
          setEmployee(employee);
          setImages(employee.images);
        }
      });
    } else {
      console.log('param.id3 : ');
      setOnEdit(false);
      setEmployee(initialEmployee);
      setImages(false);
    }
  }, [param.id, employees]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("Bạn không phải là Admin");
      const file = e.target.files[0];

      if (!file) return alert("File không tồn tài");

      if (file.size > 1024 * 1024)
        return alert("Size quá lớn");//1mb

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
      console.log('dữ liệu ảnh : ',res.data);
      console.log('dữ liệu ảnh url : ',res.data.url);
      setImages(res.data);
    } catch (error) {
      // alert(err.response.data.message);

      setMessage(error.response.data.message)
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
      setMessage(err.response.data.message)
      setOpenAlert(true);
    }
  };

  const handleChangeInput = (e) => {
    console.log('e.target : ',e.target)
    const { name, value } = e.target;
    console.log('name : ',name);
    console.log('value : ',value);
    setEmployee({ ...employee, [name]: value });
    console.log('Thông tin nhân viên : ',employee);
  };

 

  const styleUpload = {
    display: images ? "block" : "none",
  };


  const AddEmployee = () => {
    setOnEdit(false);
    setEmployee(initialEmployee);
    document.getElementById("modal_container__employee").classList.add("modal_active");
  }

  const EditEmployee = (data_employee_edit) => {
    console.log('dữ liệu vật tư edit : ',data_employee_edit)
    setOnEdit(true);
    setEmployee(data_employee_edit);
    setImages(data_employee_edit.images);
    document.getElementById("modal_container__employee").classList.add("modal_active");
  }

  const CloseModalEmployee = () => {
    document.getElementById("modal_container__employee").classList.remove("modal_active");
  }

  const AddToListEmployee = async (e) => {
    console.log(e);
        // alert('Thêm thành công : '+employee.tenvt);
        // console.log('Dữ liệu thêm mới : ',{...employee, images });
      
        // //Thêm mới
        if(!onEdit)
        {
          try {
            const res = await axios.post(
                     "/api/auth/register",
                     { ...employee, images },
                     {
                       headers: { Authorization: token },
                     }
                   );


                  //  alert(res.data.message);

                   setMessage(res.data.message)
                   setOpenAlert(true);

                   document.getElementById("modal_container__employee").classList.remove("modal_active");
                   setCallback(!callback);
                  //  history.push("/vattu");
           } catch (err) {
              //  alert(err.response.data.message);

               setMessage(err.response.data.message)
               setOpenAlert(true);
           }
        }
        //Cập nhật thông tin nhân viên
        if(onEdit)
        {
          try {
            const res = await axios.put(
                     `/api/nhanvien/${employee._id}`,
                     { ...employee, images },
                     {
                       headers: { Authorization: token },
                     }
                   );
                  //  alert(res.data.message);

                   setMessage(res.data.message)
                   setOpenAlert(true);

                   document.getElementById("modal_container__employee").classList.remove("modal_active");
                   setCallback(!callback);
           } catch (err) {
              //  alert(err.response.data.message);

               setMessage(err.response.data.message)
               setOpenAlert(true);
           }
        }  
  }


  const DeleteEmployee = async (id, public_id) => {
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
      const deleteemployee = await axios.delete(
               `/api/nhanvien//${id}`,
               {
                 headers: { Authorization: token },
               }
             );
            //  alert(res.data.message);
             await destroyImg;
            // alert(deleteemployee.data.message);

            setMessage(deleteemployee.data.message)
            setOpenAlert(true);


             setCallback(!callback);
             setLoading(false);
     } catch (err) {
        //  alert(err.response.data.message);
         setMessage(err.response.data.message)
         setOpenAlert(true);
     }
  }

  return (
    <>
    <div className="layout">
    <div className="layout-first"><Header/></div>
    <div className="layout-second">
    <NavBar/>
      <div className="employees">
      {/* <div className="row search-employee">
          <label>Tìm nhân viên</label>
                <input
                  type="text"
                  name="tenpn"
                  placeholder="Nhập tên nhân viên"
                  id="inputsearch"
                  required
                  autocomplete="off"
                  onChange={(event)=> {
                    setSearchTerm(event.target.value);
                    // document.getElementById("list-material").style.display = "block";
                  }}
                />
        </div> */}
        <div className="header-title">
        <div className="row search-employee">
          {/* <label>Tìm nhân viên</label> */}
                <input
                  type="text"
                  name="tenpn"
                  placeholder="Nhập từ khóa tìm kiếm"
                  id="inputsearch"
                  required
                  autocomplete="off"
                  onChange={(event)=> {
                    setSearchTerm(event.target.value);
                    // document.getElementById("list-material").style.display = "block";
                  }}
                />
        </div>
            <div className="title-tab">
                <h2 style={{display:'flex',alignItems:'center'}}><BsFillPersonLinesFill style={{marginRight:'5px'}}/>Nhân Viên</h2>
              </div>
           {
             isAdmin ?  <button className='add-item' onClick={AddEmployee}><BiBookAdd  style={{marginRight:'5px',marginTop:'5px'}}/>Thêm Nhân Viên</button> : null
           }
             
           
              
        </div>
          <div className="header_list">
            <p style={{width:"70px"}}>STT</p>
            <p style={{width:"160px"}}>ID</p>
            <p style={{flex:1}}>Họ tên</p>
            <p style={{flex:1}}>Hình ảnh</p>
            <p style={{flex:1}}>Đại lý</p>
            <p style={{flex:1}}>Quyền</p>
            <p style={{flex:1}}>Trạng thái</p>
            {
              isAdmin ?
              <>
              <p style={{flex:1}}>Chức năng</p>
              {/* <p style={{flex:0.6}}>Xóa</p>
              <p style={{flex:0.6}}>Chi tiết</p> */}
              </>
              : null
            }
          
          </div>
          {employees.filter(employee=>{
              if(searchTerm === "") 
              {
                  return employee;
              }
              else if(
                employee._id.toLowerCase().includes(searchTerm.toLowerCase()) 
              || employee.hoten.toLowerCase().includes(searchTerm.toLowerCase())
              || employee.madaily.tendl.toLowerCase().includes(searchTerm.toLowerCase())
              || employee.role.toLowerCase().includes(searchTerm.toLowerCase())
              || employee.tinhtrang.toLowerCase().includes(searchTerm.toLowerCase())

              )
              {
                  return employee;
              }
          }).map((employee,index) => {
            console.log(employee);


              if(isAdmin)
              {
                return( 
                  <EmployeeItem
                    key={employee._id}
                    employee={employee}
                    stt={index}
                    EditEmployee={EditEmployee}
                    DeleteEmployee={DeleteEmployee}
                  />
                )
              }
              else {
                if(employee.madaily._id.toString() === inforuser.madaily._id.toString())
                // if(employee.madaily._id.toString() === inforuser.madaily)
                {
                  return( 
                    <EmployeeItem
                      key={employee._id}
                      employee={employee}
                      stt={index}
                      EditEmployee={EditEmployee}
                      DeleteEmployee={DeleteEmployee}
                    />
                  )
                }
              }
          })}
      </div>
     
    
    </div>
    </div>

    <div className="modal_container__employee" id="modal_container__employee">
          <div className="modal__employee">
            <h2 className="title_add__employee">{onEdit ? "Cập Nhật Thông Tin Nhân Viên" : "Thêm Nhân Viên"}</h2>
            <div className="row">
              <label htmlFor="title">Họ tên</label>
              <input
                type="text"
                name="hoten"
                placeholder="Nhập họ tên"
                id="hoten"
                required
                autocomplete="off"
                value={employee.hoten}
                onChange={handleChangeInput}
              />
            </div>

          <div className="row">
          <label htmlFor="stores">Đại lý</label>
          <select
          className="select-daily-nhanvien"
            name="madaily"
            value={employee.madaily.tendl}
            onChange={handleChangeInput}
          >
            <option value="" disabled selected hidden>Vui lòng chọn đại lý</option>
            {stores.map((daily) => (
              <option value={daily._id}>
                {daily.tendl}
              </option>
            ))}
          </select>
        </div>


            <div className="row">
              <label htmlFor="title">Địa chỉ</label>
              <input
                type="text"
                name="diachi"
                autocomplete="off"
                placeholder="Nhập địa chỉ"
                id="diachi"
                required
                value={employee.diachi}
                onChange={handleChangeInput}
              />
            </div>

            {
              onEdit ?
               <></> 
               : 
              <>
                <div className="row">
                  <label htmlFor="title">Username</label>
                  <input
                    type="text"
                    name="username"
                    autocomplete="off"
                    placeholder="Nhập username"
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
                    autocomplete="off"
                    placeholder="Nhập mật khẩu"
                    id="password"
                    required
                    value={employee.password}
                    onChange={handleChangeInput}
                  />
                </div>
              </>
            }
         

            <div className="row">
            <label htmlFor="role">Quyền</label>
            <select
             className="select-daily-nhanvien"
              name="role"
              value={employee.role}
              onChange={handleChangeInput}
            >
              <option value="" disabled selected hidden>Vui lòng chọn quyền</option>
              <option value="admin" >Admin</option>
              <option value="user" >User</option>
              
            </select>
          </div>

            <div className="row">
              <label htmlFor="price">Số điện thoại</label>
              <input
                // type="number"
                name="sodienthoai"
                autocomplete="off"
                placeholder="Nhập số điện thoại"
                id="sodienthoai"
                required
                value={employee.sodienthoai}
                // min="0"
                maxlength="10"
                onChange={handleChangeInput}
              />
            </div>

            <div className="row">
              <label htmlFor="price">Chứng minh nhân dân</label>
              <input
                type="cmnd"
                name="cmnd"
                autocomplete="off"
                placeholder="Nhập cmnd"
                id="cmnd"
                required
                value={employee.cmnd}
                maxlength="9"
                onChange={handleChangeInput}
              />
            </div>

          <div className="row">
            <label htmlFor="tinhtrang">Trạng thái</label>
            <select
             className="select-daily-nhanvien"
              name="tinhtrang"
              autocomplete="off"
              value={employee.tinhtrang}
              onChange={handleChangeInput}
              disabled={onEdit ? false : true}
            >
              <option value="Đang làm" >Đang làm</option>
              <option value="Chuyển công tác" >Chuyển công tác</option>
              <option value="Nghỉ việc">Nghỉ việc</option>
              
            </select>
          </div>

            <div className="upload-img-employee">
              <h1>Hình ảnh</h1>
              <input type="file" name="file" id="file_up" onChange={handleUpload} />
           
             
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
                <button id="add" onClick={AddToListEmployee}>{onEdit ? 'Cập Nhật' : 'Thêm'}</button>
                <button id="close"   onClick={CloseModalEmployee}>Hủy</button>
            </div>

          </div>
    </div>

    {
      openalert ?  
      <div className="modal_container__notification modal_active" id="modal_container__notification">
      <div className="modal__notification">
        <p className="title-notification">Thông báo</p>
        <p>{message}</p>
        <div className="option-button">
            <button id="add" onClick={() =>{
              //  document.getElementById("modal_container__notification").classList.remove("modal_active");
               setOpenAlert(false);
            }} >OK</button>
            {/* <button id="close"  >Hủy</button> */}
        </div>
      </div>
      </div>
      : <></>
    }
   
   
    </>
  )
}

export default Employees;