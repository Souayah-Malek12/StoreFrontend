/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Layout from "../../components/Layouts/Layout";
import UserMenu from "../../components/Layouts/UserMenu";
import { useAuth } from "../../context/auth";
import axios from "axios";
import moment from 'moment';

const OrderList = () => {

  const [orders, setOrdes] = useState([]);
  const [auth ] = useAuth();
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState("");
  
  const bName = auth?.user?.userName;
  console.log(bName)
  const getOrders = async()=>{
    try{
      const {data} = await axios.get(`${import.meta.env.VITE_APP_API}/api/v1/auth/orders/${bName}`,
        
        {
        headers :{
          authorization : auth?.token
        }
      });
      console.log(data)
      if(data?.success){
        setOrdes(data?.orders);
        setAmount(data?.totals?.totalAmount);
        setTotal(data?.totals?.totalCount);
      }
    }catch(err){
      console.log(err);
    }
  };

  useEffect(()=>{
    if(auth?.token) getOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[auth?.token]);

  return (
    <Layout title={"Orders List"}>
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center" style={{ marginBottom: "20px", fontWeight: "bold" }}>
              All Orders (<span style={{color: "red" ,fontWeight : "500"}} >{amount}</span> <span style={{color: "green"}}>dt</span>)
            </h1>
            {
              orders?.map((o, i) => (
                <div key={o._id} style={{ border: "1px solid #ddd", borderRadius: "10px", marginBottom: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
                  <table className="table" style={{ marginBottom: "0", backgroundColor: "#f9f9f9" }}>
                    <thead style={{ backgroundColor: "#e9ecef" }}>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col">Ordered At</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ fontWeight: "500" }}>
                        <td>{i + 1}</td>
                        <td>{o?.status}</td>
                        <td>{o?.buyer}</td>
                        <td>{moment(o?.createdAt).fromNow()}</td>
                        <td>{o?.payment?.Success ? "Success" : "Pending"}</td>
                        <td>{o?.products?.length}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="container p-3">
                    { o?.products?.map((p) => (
  <div key={p._id} className="row mb-2" style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
    <div className="col-md-4 d-flex align-items-center">
      <img
        src={p.photo || "https://via.placeholder.com/80"} // Fallback placeholder image
        alt={`${p.name} picture`}
        style={{ height: "100px", width: "80px", borderRadius: "5px", objectFit: "cover", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
        loading="lazy"
      />
    </div>
    <div className="col-md-8">
      <h5 style={{ marginBottom: "5px", fontWeight: "bold", color: "brown" }}>{p.color}</h5>
      <p style={{ marginBottom: "5px", color: "blue" }}>{p.size}...</p>
    </div>
  </div>
))}

                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderList;
