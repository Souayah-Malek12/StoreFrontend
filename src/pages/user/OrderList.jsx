import Layout from "../../components/Layouts/Layout";
import UserMenu from "../../components/Layouts/UserMenu";

 const OrderList = () => {
  return (
    <Layout title={"Orders List"}>
    <div>
    <div>
        <UserMenu />
        
    </div>
    <div>
        orders List
    </div>
    </div>
    </Layout>
  )
}

export default OrderList