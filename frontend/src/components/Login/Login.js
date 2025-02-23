import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { login as apiLogin, addToCart, fetchCartItems } from '../../Services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

const Login = () => {
    const { login, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from || '/';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location.state?.from]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError('');
        setPasswordError('');

        let isValid = true;

        if (!credentials.email) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
            setEmailError('Invalid email format');
            isValid = false;
        }

        if (!credentials.password) {
            setPasswordError('Password is required');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        setLoading(true);
        try {
            const response = await apiLogin(credentials);
            login(response);
            toast.success('Login successful!');

            const searchParams = new URLSearchParams(location.search);
            const productId = searchParams.get('productId');
            const quantity = searchParams.get('quantity');

            if (productId && quantity) {
                await addToCart(productId, quantity);
                await fetchCartItems();
                toast.success('Product added to cart!');
            }

            const from = location.state?.from || '/';
            setTimeout(() => navigate(from), 1500);
        } catch (error) {
            toast.error('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <div className={`input-group ${emailError ? 'error' : ''}`}>
                    <input
                        type="text"
                        name="email"
                        value={credentials.email}
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        placeholder="Email"
                        required
                    />
                    {emailError && <div className="error-message">{emailError}</div>}
                </div>
                <div className={`input-group ${passwordError ? 'error' : ''}`}>
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        placeholder="Password"
                        required
                    />
                    {passwordError && <div className="error-message">{passwordError}</div>}
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Login;