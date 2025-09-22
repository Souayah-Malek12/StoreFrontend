import axios from "axios";
import { useAuth } from "../../context/auth";
import { useEffect, useState } from "react";
import Layout from "../../components/Layouts/Layout";
import AdminMenu from "../../components/Layouts/AdminMenu";
import "./UsersList.css"

const UsersList =()=>{

    const [users, setUsers] = useState([]);

    const [auth] = useAuth();
    const getUsers = async()=>{
        const response = await axios.get(`${import.meta.env.VITE_APP_API}/api/v1/auth/users`,{
            headers : {
                Authorization : auth?.token
            }
        })
        
        const data = response.data;
        if(data?.success){
            setUsers(data?.users);
        }
    }

    useEffect(()=>{
        getUsers()
    },[])
    return(
        <Layout title={"users List"}>
        
        <div className="admin-dashboard">
      <div className="admin-menu">
        <AdminMenu />  {/* Admin menu */}
      </div>
      <div className="table-container">
        <h1>Users</h1>
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.address}</td>
                <td>{user.role === 0 ? "User" : "Admin"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  
      </Layout>
    )
}
export default UsersList;