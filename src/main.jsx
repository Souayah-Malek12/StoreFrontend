import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/auth.jsx';
import { SearchProvider } from './context/search.jsx';
import { CartProvider } from './context/Cart.jsx';

createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <SearchProvider>
        <CartProvider>
        <App />
        </CartProvider>
        <ToastContainer /> 
      </SearchProvider>
    </AuthProvider>
);

