import Layout from '../../components/Layouts/Layout'
import UserMenu from '../../components/Layouts/UserMenu'
import { useAuth } from '../../context/auth'

export const Dashboard = () => {

  const [auth] = useAuth()
  return (
    
    <Layout title={"Dashboard - Ecommerce App"}>
      <div className="container-flui m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h3>Welcome {auth?.user?.userName}</h3>
              <h3>{auth?.user?.email}</h3>
              <h3>{auth?.user?.address}</h3>
              <h3>{auth?.user?.phone}</h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
    
  )
}

export default Dashboard