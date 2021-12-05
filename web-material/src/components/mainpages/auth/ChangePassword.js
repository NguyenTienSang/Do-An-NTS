import axios from "axios";
import React, { useContext, useState, useEffect  } from "react";

import { GlobalState } from "../../../GlobalState";

function ChangePassword() {



  const state = useContext(GlobalState);
  const [token] = state.token;

  const [openalert,setOpenAlert] = useState(false);

  const [message,setMessage] = useState("");

  const [password,setPassword] = useState({
    oldpassword : "",
    newpassword : "",
    renewpassword : "",
});



   const changePass = async () => {
    //   const  localStorage.getItem('inforuser')
      const _id = JSON.parse(localStorage.getItem('inforuser'))._id;

    console.log('password : ',password)
    console.log('_id : ',_id)
      axios.put(`http://192.168.1.4:5000/api/auth/changepassword/${_id}`,
      {...password}
      ).then(res => {
        // console.log('res : ',res.data.message)
    //   setPassword({ ...password});
    // alert(res.data.message)

    setMessage(res.data.message)
    setOpenAlert(true);


      setPassword({ ...password,oldpassword: "",newpassword : "",renewpassword : ""});
    document.getElementById("modal_container__changepassword").classList.remove("modal_active");
      }).catch(error => {
        // console.log('error : ',error.response.data.message)
        // alert('test'+error.response.data.message);
        setMessage(error.response.data.message)
        setOpenAlert(true);


      })




   }

   
    const handleChangeInput = (e) => {
        // console.log('e.target : ',e.target)
        const { name, value } = e.target;
        setPassword({ ...password, [name]: value });
      };
    return (
<>
<div className="modal_container__changepassword"  id="modal_container__changepassword">
<div className="modal_changepassword">
  <p className="title_changepassword">Đổi mật khẩu</p>
  
  <div className="row">
              <label >Mật khẩu cũ : </label>
              <input
                type="password"
                name="oldpassword"
                placeholder="Nhập mật khẩu cũ"
                maxLength="25"
                required
                value={password.oldpassword}
                onChange={handleChangeInput}
              />
            </div>



  <div className="row">
              <label >Mật khẩu mới : </label>
              <input
                type="password"
                name="newpassword"
                placeholder="Nhập mật khẩu mới"
                maxLength="25"
                required
                value={password.newpassword}
                onChange={handleChangeInput}
              />
            </div>

            <div className="row">
              <label >Nhập lại mật khẩu : </label>
              <input
                type="password"
                name="renewpassword"
                placeholder="Nhập lại mật khẩu mới"
                required
                maxLength="25"
                value={password.renewpassword}
                onChange={handleChangeInput}
              />
            </div>        


  <div className="option_button">
        <button id="add" onClick={() =>{
            // 

            changePass();

            //  setOpenAlert(false);
        }} >Đổi Mật Khẩu</button>

        <button id="add" onClick={() =>{
                document.getElementById("modal_container__changepassword").classList.remove("modal_active");

                // password.newpassword = "";
                // password.renewpasswordword = "";
            
            
                // setPassword({ ...password});
                setPassword({ ...password,oldpassword: "",newpassword : "",renewpassword : ""});
                //  setOpenAlert(false);
            }} >Hủy</button>
            {/* <button id="close"  >Hủy</button> */}
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
               document.getElementById("modal_container__notification").classList.remove("modal_active");
               setOpenAlert(false);
            }} >OK</button>
            {/* <button id="close"  >Hủy</button> */}
        </div>
      </div>
      </div>
      : <></>
    }
</>






    );
}

export default ChangePassword;