import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

import { GlobalState } from "../../../GlobalState";
// import MaterialItem from "./MaterialItem";
import Header from "../../header/Header";
import NavBar from "../../navbar/NavBar";
import Loading from "../utils/loading/Loading";
import {GiExplosiveMaterials} from 'react-icons/gi';
import {BiBookAdd} from 'react-icons/bi';
import DatePicker from "react-datepicker";
import moment from 'moment';


function StatisticProfitYear() {

  const state = useContext(GlobalState);
  // const [token] = state.token;
  // const [material, setMaterial] = useState(initialMaterial);

  const [yearstatistic, setYearStatistic] = useState(new Date());
  const [stores] = state.storeAPI.stores;
  


  const [madailyfilter,setMaDaiLyFilter] = useState("");
  const [dataStatistic,setDataStatistic] = useState([]);
 
  const Format = (number) => {
    return String(number).replace(/(.)(?=(\d{3})+$)/g, '$1.') + " VND"
}

  const handlechangestore = (e) => {
    setMaDaiLyFilter(e.target.value);
  };
 

  useEffect(async() => {
    // console.log('yearstatistic : ', )
   
    if(madailyfilter !== "")
    {
      console.log('madailyfilter : ',madailyfilter)
      const res = await axios.post('http://192.168.1.4:5000/api/thongke/loinhuannam',
      {madailyfilter,yearstatistic : parseInt(moment(yearstatistic).format('YYYY'))}
      // {madailyfilter,yearstatistic : 2021}
        );
       
        console.log('res.data : ',res.data)
        setDataStatistic(res.data);
    }
},[madailyfilter,yearstatistic])

      return (
          <div className="layout">
             <div className="layout-first"><Header/></div>
             <div className="layout-second">
             <NavBar/>
          <div className="materials">
          <p className="title-statistic-material">Thống kê lợi nhuận năm {parseInt(moment(yearstatistic).format('YYYY'))}</p>
          <div className="container-filter">
      

          {/* <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      showYearPicker
      dateFormat="yyyy"
      yearItemNumber={9}
    /> */}



      <DatePicker
        className="date-picker"
        // format="DD-MM-YYYY"
        maxDate={new Date()}
        showYearPicker
        dateFormat="yyyy"
        yearItemNumber={9}
        selected={yearstatistic}
        onChange={(date) =>
          {
            setYearStatistic(date)
          }
        }
        value={yearstatistic}
      />


          <div className="filter-select">
          <label>Đại lý : </label>
              <select className="select-store"
                  // value={madailyfilter}
                  defaultValue={""}
                  onChange={handlechangestore}>
                <option value="" disabled selected hidden>Vui lòng chọn đại lý</option>
                  {stores.map((store) => (
                    <option value={store._id} key={store._id}>
                      {store.tendl}
                    </option>
                  ))}
                </select>
            </div> 
        </div>


            <div className="header-title">
              <div className="title-tab">
                <h2 style={{display:'flex',alignItems:'center'}}><GiExplosiveMaterials style={{marginRight:'5px'}}/>Lợi Nhuận</h2>
              </div>
            </div>


            <div className="header_list">
              <p style={{flex:0.5}}>Tháng</p>
              <p>Số Phiếu Nhập</p>
              <p>Tổng Tiền Nhập</p>
              <p>Số Phiếu Xuất</p>
              <p>Tổng Tiền Xuất</p>
              <p>Doanh Thu Tháng</p>
            </div>
            {
              dataStatistic?.map((item,index) => 
                (
                  <div className="material_item">
                  <div style={{flex:0.5}} className="material_item_element">
                  {item.thang}
                  </div>
                  <div className="material_item_element">
                  {item.sophieunhap}
                  </div>
                 
                   
                  <div className="material_item_element">
                  {Format(item.chiphinhap)}
                  </div>
                  
                  <div className="material_item_element">
                  {item.sophieuxuat}
                  </div>
                    <div className="material_item_element">
                    {Format(item.chiphixuat)}
                    </div>
                    <div className="material_item_element">
                   {Format(item.chiphixuat - item.chiphinhap)}
                    </div>
                </div>
                )
            )}
            <div className="material_item">Doanh thu cả năm {parseInt(moment(yearstatistic).format('YYYY'))} : {Format(onLoadTotal())}</div>
        </div>
             </div>
   </div>
  )

  function onLoadTotal()
    {
        var total = 0;
        dataStatistic.map(item =>
            {
               total+= item.chiphixuat - item.chiphinhap;
            })
           
        return total;
    }
}

export default StatisticProfitYear;