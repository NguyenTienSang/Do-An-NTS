import React from 'react'
import { Link } from 'react-router-dom'
import { FaHome } from 'react-icons/fa';
import {BsFillPersonLinesFill} from 'react-icons/bs'
import {GiExplosiveMaterials} from 'react-icons/gi'
import {IoStorefrontOutline} from 'react-icons/io5'
import {FaWarehouse} from 'react-icons/fa'
import {GiNotebook} from 'react-icons/gi'
import {VscGraphLine} from 'react-icons/vsc'
import {AiFillCaretRight} from 'react-icons/ai'





function NavBar() {
    return (
        <div className="navbar">
          <nav className="navigation">
            <div className="navbar-content">
              <div className="item-narbar">
                  <Link to="/"><FaHome/>Trang chủ</Link>
              </div>

              <div className="item-narbar">
                  <Link to="/nhanvien"><BsFillPersonLinesFill/>Nhân Viên</Link>
              </div>

              <div className="item-narbar">
                  <Link to="/vattu"><GiExplosiveMaterials/>Vật Tư</Link>
              </div>

              <li className="item-narbar">
                  <Link to="/daily"><IoStorefrontOutline/>Đại Lý</Link>
              </li>
             
              <div className="item-narbar">
                  <Link to="/kho"><FaWarehouse/>Kho</Link>
              </div>

              <div className="item-narbar">
              <GiNotebook style={{marginLeft:'10px',marginRight:'10px'}}/>Phiếu<AiFillCaretRight  style={{margin:'0'}}/>
                <ul className="sub-menu">
                  <li  className="sub-menu-item"> <Link to="/phieunhap">Phiếu Nhập</Link></li>
                  <li  className="sub-menu-item"><Link to="/phieuxuat">Phiếu Xuất</Link></li>
                </ul>
                  {/* <Link to="/phieunhapxuat"><GiNotebook/> Phiếu</Link> */}
              </div>

              <div className="item-narbar">
                <Link to="/thongke"><VscGraphLine/>Thống Kê</Link>
              </div>

            </div>
          </nav>
      </div>
    )
}

export default NavBar
