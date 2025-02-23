import { useContext, useEffect, useState } from 'react';
import { fetchCartItems, removeFromCart } from '../../Services/api';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Cart.css';
import { AuthContext } from '../../contexts/AuthContext';

const Cart = () => {
  // State variables
  const [cartItems, setCartItems] = useState([]); // Array of cart items
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate(); // Navigation hook
  const [showModal, setShowModal] = useState(false); // State to control the confirmation modal
  const [itemToDelete, setItemToDelete] = useState(null); // ID of the item to delete
  const { logout } = useContext(AuthContext); // Get logout function from AuthContext

  // Fetch cart items on component mount
  useEffect(() => {
    const getCartItems = async () => {
      try {
        setLoading(true); // Set loading to true
        const data = await fetchCartItems(); // Fetch cart items from API
        setCartItems(data); // Update cart items state
      } catch (err) {
        setError('Failed to fetch cart items. Please try again later.'); // Set error message
        toast.error('Failed to load cart items'); // Show error toast
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    getCartItems(); // Call the async function
  }, []); // Run only once on component mount

  // Handle removing an item from the cart
  const handleRemoveFromCart = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId); // Remove item from cart via API
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== cartItemId)); // Update cart items state
      toast.success('Item removed from cart!'); // Show success toast
    } catch (error) {
      toast.error('Failed to remove item from cart'); // Show error toast
    }
  };

  // Calculate the total price of items in the cart
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // Handle logout
  const handleLogout = () => {
    logout(); // Call logout function from AuthContext
    navigate('/login'); // Navigate to login page
  };

  // Open the confirmation modal for deleting an item
  const openModal = (cartItemId) => {
    setItemToDelete(cartItemId); // Set the item to delete
    setShowModal(true); // Show the modal
  };

  // Close the confirmation modal
  const closeModal = () => {
    setShowModal(false); // Hide the modal
    setItemToDelete(null); // Reset the item to delete
  };

  // Confirm deletion of an item
  const confirmDelete = () => {
    if (itemToDelete) {
      handleRemoveFromCart(itemToDelete); // Remove the item
      closeModal(); // Close the modal
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading cart...</p>
      </div>
    );
  }

  // Render error state
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

  // Render cart content
  return (
    <div className="cart-container">
      <nav className="navbar">
        <h1>Shopping Cart</h1>
        <div className="nav-buttons">
          <button onClick={() => navigate('/')} className="nav-button">
            Go to Products
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="cart-item-details">
                  <h3>{item.product.name}</h3>
                  <p>{item.product.description}</p>
                  <p>Price: ${item.product.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Subtotal: ${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
                <button onClick={() => openModal(item.id)} className="remove-button">
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to remove this item from your cart?</p>
            <div className="modal-buttons">
              <button onClick={confirmDelete} className="confirm-button">
                Yes
              </button>
              <button onClick={closeModal} className="cancel-button">
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Cart;