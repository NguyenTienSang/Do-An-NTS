import React from 'react'
import { Link } from 'react-router-dom'
import { FaHome } from 'react-icons/fa';
import {BsFillPersonLinesFill} from 'react-icons/bs'
import {GiExplosiveMaterials} from 'react-icons/gi'
import {IoStorefrontOutline} from 'react-icons/io5'
import {FaWarehouse} from 'react-icons/fa'
import {GiNotebook} from 'react-icons/gi'
import {VscGraphLine} from 'react-icons/vsc'




function NavBar() {
    return (
        <div className="navbar">
          <nav className="navigation">
            <ul>
              <li>
                  <Link to="/"><FaHome/>Trang chủ</Link>
              </li>

              <li>
                  <Link to="/nhanvien"><BsFillPersonLinesFill/>Nhân Viên</Link>
              </li>

              <li>
                  <Link to="/vattu"><GiExplosiveMaterials/>Vật Tư</Link>
              </li>

              <li>
                  <Link to="/daily"><IoStorefrontOutline/>Đại Lý</Link>
              </li>
             
              <li>
                  <Link to="/kho"><FaWarehouse/>Kho</Link>
              </li>

              <li>
                  <Link to="/phieunhapxuat"><GiNotebook/> Phiếu</Link>
              </li>

              <li>
                <Link to="/thongke"><VscGraphLine/>Thống Kê</Link>
              </li>

            </ul>
          </nav>
      </div>
    )
}

export default NavBar
