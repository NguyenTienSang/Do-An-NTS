import axios from "axios";
import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from 'react-router-dom';
import NavBar from "../../navbar/NavBar";
import Header from "../../header/Header";


function Statistic() {
  return (
    <div className="layout">
             <div className="layout-first"><NavBar/></div>
             <div className="layout-second">
               <Header/>
              <div className="statistic-container">
                <ul>
                  <li className="statistic-item">
                          <Link to={'/thongkephieunhap'}><p>Thống kê <br/> nhân viên</p> </Link>
                    </li>
                    <li className="statistic-item">
                    <Link to={'/thongkevattu'}><p>Thống kê <br/> vật tư</p> </Link>
                    </li>
                </ul>

                <ul>
                    <li className="statistic-item">
                            <Link to={'/thongkevattu'}><p>Thống kê <br/> đại lý</p> </Link>
                      </li>

                      <li className="statistic-item">
                      <Link to={'/thongkevattu'}><p>Thống kê <br/> kho</p></Link>
                            
                      </li>
                </ul>
                 
                
              </div>
             </div>
   </div>
  )
}

export default Statistic;