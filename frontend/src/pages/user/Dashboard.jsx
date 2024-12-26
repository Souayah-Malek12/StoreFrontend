import Layout from '../../components/Layouts/Layout'
import UserMenu from '../../components/Layouts/UserMenu'
import UserDashboardCharts from '../../components/Charts/UserDashboardCharts';
import { useAuth } from '../../context/auth'
import moment from 'moment';

export const Dashboard = () => {

  const [auth] = useAuth()
  const orders = []; // Assuming orders are fetched from somewhere, for now it's an empty array

  return (
    
    <Layout title={"Dashboard - Ecommerce App"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h3>User Profile</h3>
              <div className="user-info mb-4">
                <p><strong>Name:</strong> {auth?.user?.name}</p>
                <p><strong>Email:</strong> {auth?.user?.email}</p>
                <p><strong>Contact:</strong> {auth?.user?.phone}</p>
                <p><strong>Address:</strong> {auth?.user?.address}</p>
              </div>

              {/* User Dashboard Charts */}
              <div className="user-stats-section mb-4">
                <h3>Your Shopping Analytics</h3>
                <UserDashboardCharts />
              </div>

              {/* Recent Orders */}
              <div className="recent-orders">
                <h3>Recent Orders</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Status</th>
                      <th>Buyer</th>
                      <th>Date</th>
                      <th>Payment</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders?.map((o, i) => {
                      return (
                        <tr key={o._id}>
                          <td>{i + 1}</td>
                          <td>{o?.status}</td>
                          <td>{o?.buyer?.name}</td>
                          <td>{moment(o?.createAt).fromNow()}</td>
                          <td>{o?.payment.success ? "Success" : "Failed"}</td>
                          <td>{o?.products?.length}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
    
  )
}

export default Dashboard