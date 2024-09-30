import { useContext } from "react";
import AuthProvider from "./auth";

const useAuth = () => useContext(AuthContext);

export default useAuth;