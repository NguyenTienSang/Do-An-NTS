import React, { useContext, useState, useEffect } from "react";
function ChangePassword() {

   const chagePass = () => {
    //   const  localStorage.getItem('inforuser')
      const inforuser = JSON.parse(localStorage.getItem('inforuser'));
    console.log('inforuser : ',inforuser)
    console.log('oldPass : ',password.oldPass);
    console.log('newPass : ',password.newPass);
    console.log('renewPass : ',password.renewPass);


    setPassword({ ...password});
    setPassword({ ...password,oldPass: "",newPass : "",renewPass : ""});
    document.getElementById("modal_container__changepassword").classList.remove("modal_active");
   }

   const [password,setPassword] = useState({
       oldPass : "",
       newPass : "",
       renewPass : "",
   });

    const handleChangeInput = (e) => {
        // console.log('e.target : ',e.target)
        const { name, value } = e.target;
        setPassword({ ...password, [name]: value });
      };
    return (

<div className="modal_container__changepassword"  id="modal_container__changepassword">
<div className="modal_changepassword">
  <p className="title_changepassword">Đổi mật khẩu</p>
  
  <div className="row">
              <label >Mật khẩu cũ : </label>
              <input
                type="text"
                name="oldPass"
                placeholder="Nhập mật khẩu cũ"
                maxLength="25"
                required
                value={password.oldPass}
                onChange={handleChangeInput}
              />
            </div>



  <div className="row">
              <label >Mật khẩu mới : </label>
              <input
                type="password"
                name="newPass"
                placeholder="Nhập mật khẩu mới"
                maxLength="25"
                required
                value={password.newPass}
                onChange={handleChangeInput}
              />
            </div>

            <div className="row">
              <label >Nhập lại mật khẩu : </label>
              <input
                type="password"
                name="renewPass"
                placeholder="Nhập lại mật khẩu mới"
                required
                maxLength="25"
                value={password.renewPass}
                onChange={handleChangeInput}
              />
            </div>        


  <div className="option_button">
        <button id="add" onClick={() =>{
            // 

            chagePass();

            //  setOpenAlert(false);
        }} >Đổi Mật Khẩu</button>

        <button id="add" onClick={() =>{
                document.getElementById("modal_container__changepassword").classList.remove("modal_active");

                password.newPass = "";
                password.renewPass = "";
            
            
                setPassword({ ...password});

                //  setOpenAlert(false);
            }} >Hủy</button>
            {/* <button id="close"  >Hủy</button> */}
        </div>
</div>
</div>







    );
}

export default ChangePassword;