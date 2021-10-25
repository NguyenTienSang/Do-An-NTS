import React, {useState, useContext} from 'react'
import { GlobalState } from '../../GlobalState';
import { Link } from "react-router-dom";
import { BsBellFill } from 'react-icons/bs';
import axios from 'axios';

function Header() {

  const state = useContext(GlobalState);
  const [isLogged, setIsLogged] = state.userAPI.isLogged;
  const [isAdmin, setIsAdmin] = state.userAPI.isAdmin;

  const logoutUser = async () => {
    await axios.get('/api/auth/logout');
    localStorage.clear();
    setIsLogged(false);
    setIsAdmin(false);
  }


    return (
        <header>

<div className="logo">
            <h1>
                Manage
            </h1>
          </div>
          <div className="menu">
            Thông báo
            <BsBellFill />
            
          </div>
    
        

          <ul>
              <li>
                  {isAdmin ? "admin" : "user"}
              </li>
              <li>
                  <Link to="/login" onClick={logoutUser}>Đăng Xuất</Link>
              </li>
          </ul>
        </header>
      );
}

export default Header
