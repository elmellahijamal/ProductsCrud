import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext';
import ProtectedRoute from './Services/ProtectedRoute';
import Login from './components/Login/Login';
import ProductList from './components/Product/ProductList';
import Cart from './components/Cart/Cart';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public route for the product list page */}
          <Route path="/" element={<ProductList />} />

          {/* Public route for the login page */}
          <Route path="/login" element={<Login />} />

          {/* Protected route for the cart page */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;