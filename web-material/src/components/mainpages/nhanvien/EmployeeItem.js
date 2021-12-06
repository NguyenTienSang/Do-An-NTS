import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import {RiDeleteBin6Line} from 'react-icons/ri';
import {FaUserEdit} from 'react-icons/fa';
import {AiOutlineEye} from 'react-icons/ai';
import { GlobalState } from '../../../GlobalState';


function EmployeeItem({employee,stt,EditEmployee,DeleteEmployee}) {
  const state = useContext(GlobalState);
  const [isAdmin] = state.userAPI.isAdmin;

    return (
        <div className="employee_item">
        <div style={{width:"70px"}} className="employee_item_element">
        <p>{stt+1}</p>
        </div>
        <div style={{width:"160px"}} className="employee_item_element id_employee">
        <p>{employee._id}</p>
        </div>
        <div style={{flex:1}} className="employee_item_element">
        <p>{employee.hoten}</p>
        </div>
        <div style={{flex:1}} className="employee_item_element">
          <img src={employee.images.url} alt="" />
        </div>
         
        <div style={{flex:1}} className="employee_item_element">
            {employee.madaily.tendl}
        </div>

        <div style={{flex:1}} className="employee_item_element">
            {employee.role} 
        </div>
          <div style={{flex:1}}  className="employee_item_element">
          {employee.tinhtrang}
          </div>
          {
            isAdmin ? <>
            
          <div style={{flex:1}} className="employee_item_element">
          <button style={{fontSize:36}} onClick={() => EditEmployee(employee)}><FaUserEdit style={{color: "rgb(15, 184, 0)"}}/></button>
          <button style={{fontSize:36}} onClick={() => DeleteEmployee(employee._id,employee.images.public_id)}><RiDeleteBin6Line style={{color: "red"}}/></button>
          <button style={{fontSize:36}}><Link to={`/detail_employee/${employee._id}`}><AiOutlineEye  style={{color: "rgb(26, 148, 255)"}}/></Link></button>
          </div>
            </>
          : null
          }
         
      </div>
    )
}

export default EmployeeItem;
