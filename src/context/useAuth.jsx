/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useContext } from "react";
import AuthProvider from "./auth";

const useAuth = () => useContext(AuthContext);

export default useAuth;