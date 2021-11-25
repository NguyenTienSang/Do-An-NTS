import React, { useContext, useState, useEffect  } from "react";
import {NavLink, Link } from 'react-router-dom'
import { FaHome } from 'react-icons/fa';
import {BsFillPersonLinesFill} from 'react-icons/bs'
import {GiExplosiveMaterials} from 'react-icons/gi'
import {IoStorefrontOutline} from 'react-icons/io5'
import {FaWarehouse} from 'react-icons/fa'
import {GiNotebook} from 'react-icons/gi'
import {VscGraphLine} from 'react-icons/vsc'
import {AiFillCaretRight} from 'react-icons/ai'
import { GlobalState } from "../../GlobalState";




function NavBar() {

  const state = useContext(GlobalState);
    const [isLogged] = state.userAPI.isLogged;
    const [isAdmin] = state.userAPI.isAdmin;

    const [onClick,setOnClick] = useState(false);

    return (
        <div className="navbar">
              <div className="item-navbar" >
                  <NavLink activeStyle={{backgroundColor:"#0198fc",color:"#fff"}}  to="/trangchu"><FaHome/>Trang chủ</NavLink>
              </div>

              <div className="item-navbar">
                  <NavLink activeStyle={{backgroundColor:"#0198fc",color:"#fff"}} to="/nhanvien"><BsFillPersonLinesFill/>Nhân Viên</NavLink>
              </div>

              <div className="item-navbar">
                  <NavLink activeStyle={{backgroundColor:"#0198fc",color:"#fff"}} to="/vattu"><GiExplosiveMaterials/>Vật Tư</NavLink>
              </div>
              {
                isAdmin ?  <div className="item-navbar">
                <NavLink activeStyle={{backgroundColor:"#0198fc",color:"#fff"}} to="/daily"><IoStorefrontOutline/>Đại Lý</NavLink>
            </div> : null
              }

             
              <div className="item-navbar">
                  <NavLink activeStyle={{backgroundColor:"#0198fc",color:"#fff"}} to="/kho"><FaWarehouse/>Kho</NavLink>
              </div>

              <div className={onclick==true ? "item-navbar active" : "item-navbar"}>
              <GiNotebook style={{marginLeft:'10px',marginRight:'10px'}}/>Phiếu<AiFillCaretRight  style={{margin:'0'}}/>
                <ul className="sub-menu">
                  <li  className="sub-menu-item" onClick={() =>
                  {
                    setOnClick(true)
                  }}> <NavLink activeStyle={{backgroundColor:"#0198fc",color:"#fff"}} to="/phieunhap">Phiếu Nhập</NavLink></li>
                  <li  className="sub-menu-item" onClick={() =>
                  {
                    setOnClick(true)
                  }}><NavLink activeStyle={{backgroundColor:"#0198fc",color:"#fff"}}  to="/phieuxuat">Phiếu Xuất</NavLink></li>
                </ul>
                  {/* <NavLink to="/phieunhapxuat"><GiNotebook/> Phiếu</NavLink> */}
              </div>

              {
                isAdmin ?  <div className="item-navbar">
                <NavLink activeStyle={{backgroundColor:"#0198fc",color:"#fff"}} to="/thongke"><VscGraphLine/>Thống Kê</NavLink>
              </div> : null
              }

             
      </div>
    )
}

export default NavBar
