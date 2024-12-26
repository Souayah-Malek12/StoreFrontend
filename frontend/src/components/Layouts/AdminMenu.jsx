import { NavLink } from "react-router-dom";
import './AdminMenu.css'; // Custom CSS for layout and positioning

const AdminMenu = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 admin-menu-container">
            <div className="list-group">
              <h4 className="admin-panel-title">Admin Panel</h4>
              <NavLink
                to="/dashboard/admin/createCategory"
                className="list-group-item list-group-item-action"
              >
                Create Category
              </NavLink>
              <NavLink
                to="/dashboard/admin/createProduct"
                className="list-group-item list-group-item-action"
              >
                Create Product
              </NavLink>
              <NavLink
                to="/dashboard/admin/Products"
                className="list-group-item list-group-item-action"
              >
                Products
              </NavLink>
              <NavLink
                to="/dashboard/admin/allOrders"
                className="list-group-item list-group-item-action"
              >
                Orders
              </NavLink>
              <NavLink
                to="/dashboard/admin/users"
                className="list-group-item list-group-item-action"
              >
                Users
              </NavLink>
              <NavLink
                to="/dashboard/admin/Admprofil"
                className="list-group-item list-group-item-action"
              >
                Profile
              </NavLink>
            </div>
          </div>

          {/* Main content area on the right */}
          <div className="col-md-9">
            {/* You can add other content here */}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminMenu;
