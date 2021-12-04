import React, {useState, useContext} from 'react'
import { GlobalState } from '../../GlobalState';
import { Link } from "react-router-dom";
import { BsBellFill } from 'react-icons/bs';
import axios from 'axios';
import { useEffect } from 'react';
import {IoMdArrowDropdown} from 'react-icons/io';
import ChangePassword from '../mainpages/auth/ChangePassword';


function Header() {

  const state = useContext(GlobalState);
  // const [isLogged, setIsLogged] = state.userAPI.isLogged;
  // const [isAdmin, setIsAdmin] = state.userAPI.isAdmin;
  // const [inforuser] = state.userAPI.inforuser;
  // console.log('test-----------------------------------------')
  const inforuser = JSON.parse(localStorage.getItem('inforuser'));
// console.log('inforuser : ',inforuser)
 

  
  const logoutUser = async () => {
    await axios.get('/api/auth/logout');
    localStorage.removeItem("firstLogin");
    window.location.href = "/";
    localStorage.clear();
    // setIsLogged(false);
    // setIsAdmin(false);
  }

  
    return (
      <>
        <header>

        <div className="logo">
            <h1 style={{color:'rgb(26, 148, 255)'}}>
               Quản Lý Đại Lý Phế Liệu
            </h1>
          </div>
          {/* <div className="menu">
            Thông báo
            <BsBellFill />
            
          </div> */}
    
  
          <div className="my-item">
                <div className="header__navbar-item header__navbar-user">
                        <div className="item-profile">
                          <img src={inforuser.images.url} alt="" className="header__navbar-user-img"></img>
                          <span className="header__navbar-user-name">{inforuser.username}</span>
                          <IoMdArrowDropdown style={{fontSize:"25px"}}/>
                        </div>
                     
                        <ul className="header__navbar-user-menu">
                            <li className="header__navbar-user-item header__navbar-user-item--separate">
                                <Link to="/login" onClick={logoutUser}>Thông tin của tôi</Link>
                            </li>
                            <li className="header__navbar-user-item header__navbar-user-item--separate">
                                <div
                                onClick={() => {
                               
                                  document.getElementById("modal_container__changepassword").classList.add("modal_active");
                                }} 
                                >Đổi mật khẩu</div>
                            </li>
                            <li className="header__navbar-user-item header__navbar-user-item--separate">
                                <Link to="/login" onClick={logoutUser}>Đăng Xuất</Link>
                            </li>
                        </ul>
                  </div>
          </div>
        </header>
      
      {/* Thay đổi mật khẩu */}
      <ChangePassword/>
  
        </>
      );
}

export default Header
