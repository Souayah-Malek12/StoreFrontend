import { NavLink, Link, useNavigate } from "react-router-dom";
import img1 from "../../images/FB_IMG_1727343737907.jpg";
import  {useAuth}  from "../../context/auth";

import toast from "react-hot-toast";

const Header = () => {
  const [auth, setAuth] = useAuth(); // Access the Auth context
  const navigate = useNavigate()


  const handleLogout = () => {

    setAuth({
      user: null,
      token: ''
    });
    localStorage.removeItem('auth');
    toast.success('Logout Successfully');
    navigate('/')
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <Link to="/" className="navbar-brand">
              <img src={img1} className="img1" alt="Ecommerce App" />Ecommerce App
            </Link>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/category" className="nav-link">
                  Category
                </NavLink>
              </li>


              
              {
  auth.user ? (  
    <div className="dropdown">
      <button className="btn  dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        {auth?.user?.userName}
      </button>
      <ul className="dropdown-menu">
        <li><a className="dropdown-item" onClick={handleLogout}>Logout</a></li>
        <li><NavLink to={auth?.user?.role === 0 ? "/dashboard/user" : "/dashboard/admin"}>Dashboard</NavLink></li>
      </ul>
    </div>
  ) : (  
    <>
      <li className="nav-item">
        <NavLink to="/register" className="nav-link">
          Register
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/login" className="nav-link">
          Login
        </NavLink>
      </li>
    </>
  )
}


              <li className="nav-item">
                <NavLink to="/cart" className="nav-link">
                  Cart (0)
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
