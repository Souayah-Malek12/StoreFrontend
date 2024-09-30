import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import About from "./pages/About"
import Pagenotfound from "./pages/Pagenotfound"
import Policy from "./pages/Policy"
import Contact from "./pages/Contact"
import Registre from "./pages/auth/Registre"

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Login } from "./pages/auth/Login"
import Dashboard from "./pages/user/dashboard"
import { Private } from "./components/Routes/Private"

function App() {

  return (
     <>
     <BrowserRouter>
     <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/register' element={<Registre />} />

        <Route path='/dashboard' element={<Private />} >
          <Route path='/dashboard' element={<Dashboard />} />

        </Route>

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
