import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Services from './pages/Services';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import ServiceDetail from './pages/ServiceDetail';
import './index.css'
import ScrollTop from './components/ScrollTop';
import Contact from './pages/Contact';
import WhatsAppBubble from './components/WhatsAppBubble';
import TermsAndConditions from './pages/TermsAndConditions';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { BuildProvider } from "./context/BuildContext";
import BuildPC from './pages/BuildPC';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmEmail from './components/ConfirmEmail';
import { Toaster } from 'react-hot-toast';

function App() {
  return (

      <BrowserRouter>
      <AuthProvider>
      <CartProvider>
             <Toaster
        position="top-right"
        toastOptions={{
          style: {
            marginTop: '4rem',
          },
          duration: 3000,
          success: {
            style: {
              background: '#dcfce7',
              color: '#166534',
            },
          },
          error: {
            style: {
              background: '#fee2e2',
              color: '#991b1b',
            },
          },
        }}
        containerStyle={{
          top: 64, 
        }}
      />
        <ScrollTop />
        <Header />
        <main className="min-h-screen">
        <BuildProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/confirm/:token" element={<ConfirmEmail />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />

            <Route path="/armarpc" element={<BuildPC />} />

          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
          />
          </BuildProvider>
          <WhatsAppBubble />
        </main>
        <Footer />

        </CartProvider>
        </AuthProvider>
      </BrowserRouter>

  );
}

export default App;