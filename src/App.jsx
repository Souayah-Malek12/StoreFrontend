import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import About from "./pages/About"
import Pagenotfound from "./pages/Pagenotfound"
import Policy from "./pages/Policy"
import Contact from "./pages/Contact"
import Registre from "./pages/auth/Registre"

import 'antd/dist/reset.css';
import 'react-toastify/dist/ReactToastify.css';
import { Login } from "./pages/auth/Login"
import Dashboard from "./pages/user/dashboard"
import { Private } from "./components/Routes/Private"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminRoute from "./components/Routes/AdminRoutes"
import CreateCategory from "./pages/admin/CreateCategory"
import Products  from "./pages/admin/Products"
import UpdateProduct from "./pages/admin/UpdateProduct"
import { Search } from "./pages/Search"
import ProductDetails from './pages/ProductDetails'
import AllCategories from './pages/Category'
import CategoryList from "./pages/ProdByCat"
import { CartPage } from "./pages/CartPage"
import Profile from "./pages/user/Profile"
import OrderList from "./pages/user/OrderList"
import AdmProfile from "./pages/admin/AdmProfile"
import CreateProduct from "./pages/admin/CreateProduct"


function App() {

  return (
     <>
     <BrowserRouter>
     <Routes>

        

        <Route path='/dashboard' element={<Private />} >
          <Route path='user' element={<Dashboard />} />
          <Route path='user/profile' element={<Profile />} />
          <Route path='user/orders' element={<OrderList />} />


        </Route>

        <Route path='/dashboard' element={<AdminRoute/>} >
            <Route path='admin' element={<AdminDashboard />} />
            <Route path='admin/createCategory' element={<CreateCategory/>} />
            <Route path='admin/Admprofil' element={<AdmProfile/>} />
            <Route path='admin/createproduct' element ={<CreateProduct />} />
            <Route path='admin/Products' element={<Products/>} />
            <Route path='admin/Products/:slug' element={ <UpdateProduct />} />
        </Route>

        <Route path='nav/orders' element={<OrderList />} />
        <Route path='nav/Products' element={<Products/>} />

        <Route path='/' element={<HomePage />} />
        <Route path='/search' element={<Search />} />
        <Route path='/ProductDetails/:slug' element={<ProductDetails />} />
        <Route path='/category' element={<AllCategories />} />
        <Route path='/category/:slug' element={<CategoryList />} />
        <Route path='/cart' element={<CartPage />} />



        <Route path='/register' element={<Registre />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/policy' element={<Policy />} />

        <Route path='/*' element={<Pagenotfound />} />


     </Routes>
     </BrowserRouter>
     </>
    
  )
}

export default App
