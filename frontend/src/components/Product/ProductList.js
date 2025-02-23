import { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchProducts, addToCart, fetchCartItems } from '../../Services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductList.css';
import { AuthContext } from '../../contexts/AuthContext';
import { debounce } from 'lodash';

const ProductList = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});

  const debouncedFunction = useCallback(
    (value) => {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(value.toLowerCase()) ||
          product.description.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    },
    [products]
  );

  useEffect(() => {
    const getProductsAndCart = async () => {
      try {
        setLoading(true);
        const productsData = await fetchProducts();
        setProducts(productsData);
        setFilteredProducts(productsData);

        // Fetch cart items only if the user is logged in
        if (user) {
          const cartData = await fetchCartItems();
          setCartCount(cartData.length);
          setQuantities(productsData.reduce((acc, product) => ({ ...acc, [product.id]: 1 }), {}));
        } else {
          setQuantities(productsData.reduce((acc, product) => ({ ...acc, [product.id]: 1 }), {}));
        }
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    getProductsAndCart();
  }, [user]);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleAddToCart = async (productId, productName, quantity) => {
    try {
      if (!user) {
        const from = location.pathname;
        navigate(`/login?from=${encodeURIComponent(from)}&productId=${productId}&quantity=${quantity}`);
        return;
    }

      await addToCart(productId, quantity);

      const cartData = await fetchCartItems();
      setCartCount(cartData.length);

      toast.success(`${quantity} ${productName}(s) added to cart!`, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('You need to log in to add items to the cart');
      } else {
        toast.error('Failed to add product to cart');
      }
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    debounce(debouncedFunction, 300)(value);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <nav className="navbar">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <div className="navbar-right">
          {user && (
            <>
              <div className="cart" onClick={() => navigate('/cart')}>
                🛒 Cart: {cartCount}
              </div>
              <div className="user-menu">
                <span className="username">{user?.email}</span>
                <div className="dropdown">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            </>
          )}
          {!user && (
                        <button onClick={() => navigate('/login')} className="login-button">Login</button>
                      )}
        </div>
      </nav>

      {filteredProducts.length === 0 && searchTerm && (
        <div className="no-results">
          No products found matching "{searchTerm}"
        </div>
      )}

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p className="price">Price: ${product.price}</p>
            <div className="quantity-selector">
              <label htmlFor={`quantity-${product.id}`}>Quantity:</label>
              <input
                type="number"
                id={`quantity-${product.id}`}
                value={quantities[product.id] || 1}
                onChange={(e) => setQuantities({ ...quantities, [product.id]: parseInt(e.target.value) })}
                min="1"
              />
            </div>
            <button onClick={() => handleAddToCart(product.id, product.name, quantities[product.id] || 1)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
};

export default ProductList;