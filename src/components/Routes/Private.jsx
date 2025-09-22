/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { Outlet } from "react-router-dom";
import Spinner from "../spinner";

export const Private = () => {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          " http://localhost:3000/api/v1/auth/user-auth",
          {
            headers: {
              Authorization: auth?.token, // Ensure token is passed here
            },
          }
        );

        if (res.data.success === true) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        console.log("error in private");
      }
    };

    if (auth?.token) {
      checkAuth();
    }
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner />;
};

export default Private;
