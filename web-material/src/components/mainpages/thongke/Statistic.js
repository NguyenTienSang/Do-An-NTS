import axios from "axios";
import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from 'react-router-dom';
import NavBar from "../../navbar/NavBar";
import Header from "../../header/Header";


function Statistic() {
  return (
    <div className="layout">
             <div className="layout-first"><Header/></div>
             <div className="layout-second">
             <NavBar/>
              <div className="statistic">
                <ul>
                  <li className="statistic-item">
                          <Link to={'/thongkephieunhanvien'}><p>Thống kê <br/> nhân viên</p> </Link>
                    </li>
                    <li className="statistic-item">
                    <Link to={'/thongkevattu'}><p>Thống kê <br/> vật tư</p> </Link>
                    </li>
                </ul>

                <ul>
                    <li className="statistic-item">
                            <Link to={'/thongkeloinhuannam'}><p>Thống kê <br/> lợi nhuận <br/> theo năm</p> </Link>
                      </li>

                      <li className="statistic-item">
                      <Link to={'/thongkeloinhuangiaidoan'}><p>Thống kê <br/> lợi nhuận <br/> theo giai đoạn</p></Link>
                      </li>
                </ul>

                <ul>
                    <li className="statistic-item">
                            <Link to={'/thongkeloinhuannam'}><p>Top Vật Tư Doanh Thu Cao</p> </Link>
                      </li>

                      <li className="statistic-item">
                      <Link to={'/thongkeloinhuangiaidoan'}><p>Thống kê <br/> lợi nhuận <br/> theo giai đoạn</p></Link>
                      </li>
                </ul>
                 
                
              </div>
             </div>
   </div>
  )
}

export default Statistic;