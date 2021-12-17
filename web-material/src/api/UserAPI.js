import React, { useState, useEffect } from "react";
import axios from "axios";

function UserAPI(token) {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [inforuser, setInforUser] = useState([]);

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const res = await axios.get("/api/auth/infor", {
            headers: { Authorization: token },
          });
          setIsLogged(true);
          setInforUser(res.data);

          // localStorage.setItem('inforuser',JSON.stringify(res.data));
          res.data.role === "admin" ? setIsAdmin(true) : setIsAdmin(false);
        } catch (err) {
          // alert(err.response.data.message);
        }
      };

      getUser();
    }
  }, [token]);

  return {
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    inforuser: [inforuser, setInforUser],
  };
}

export default UserAPI;
