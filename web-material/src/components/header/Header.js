import React, { useState, useContext } from "react";
import { GlobalState } from "../../GlobalState";
import { Link } from "react-router-dom";
import { BsBellFill } from "react-icons/bs";
import axios from "axios";
import { useEffect } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import ChangePassword from "../mainpages/auth/ChangePassword";
import InforUser from "../common/InforUser";

function Header() {
  const inforuser = JSON.parse(localStorage.getItem("inforuser"));

  const logoutUser = async () => {
    await axios.get("/api/auth/logout");
    localStorage.removeItem("firstLogin");
    window.location.href = "/";
    localStorage.clear();
  };

  return (
    <>
      <header>
        <div className="logo" style={{ marginRight: "170px" }}>
          <h1 style={{ color: "#fff", marginLeft: 50 }}>
            Chương Trình Quản Lý Đại Lý Phế Liệu
          </h1>
        </div>

        <div className="my-item">
          <div className="header__navbar-item header__navbar-user">
            <div className="item-profile">
              <img
                src={inforuser.images.url}
                alt=""
                className="header__navbar-user-img"
              ></img>
              <span className="header__navbar-user-name">
                {inforuser.username}
              </span>
              <IoMdArrowDropdown style={{ fontSize: "25px" }} />
            </div>

            <ul className="header__navbar-user-menu">
              <li className="header__navbar-user-item header__navbar-user-item--separate">
                <div
                  onClick={() => {
                    document
                      .getElementById("modal_container__inforuser")
                      .classList.add("modal_active");
                  }}
                >
                  Thông tin của tôi
                </div>
              </li>
              <li className="header__navbar-user-item header__navbar-user-item--separate">
                <div
                  onClick={() => {
                    document
                      .getElementById("modal_container__changepassword")
                      .classList.add("modal_active");
                  }}
                >
                  Đổi mật khẩu
                </div>
              </li>
              <li className="header__navbar-user-item header__navbar-user-item--separate">
                <Link to="/" onClick={logoutUser}>
                  Đăng Xuất
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Thay đổi mật khẩu */}
      <ChangePassword />

      <InforUser />
    </>
  );
}

export default Header;
