import AdminMenu from '../../components/Layouts/AdminMenu';
import Layout from '../../components/Layouts/Layout'

export const AdminDashboard = () => {
  return (
    <Layout title={"Admin Dashboard"} >
      <div>
            <AdminMenu />
      </div>
    </Layout>
  )
}

export default AdminDashboard;