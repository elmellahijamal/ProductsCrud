import axios from 'axios';

// Base URL for the API
const API_URL = 'https://localhost:7003/api';

/*
 Helper function to retrieve the authentication token from local storage.
 */
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/*
 Fetches the list of products from the API.
 */
export const fetchProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

/**
  Logs in a user with the provided credentials.
 */
export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/Auth/login`, credentials);
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

/**
  Fetches the user's cart items from the API, including product details.
 */
export const fetchCartItems = async () => {
    try {
        const response = await axios.get(`${API_URL}/cart`, {
            headers: getAuthHeader(), // Include the token
        });

        // Fetch product details for each cart item
        const cartItemsWithProducts = await Promise.all(
            response.data.map(async (item) => {
                try {
                    const productResponse = await axios.get(`${API_URL}/products/${item.productId}`);
                    return {
                        ...item,
                        product: productResponse.data, // Add product details to the cart item
                    };
                } catch (productError) {
                    console.error(`Error fetching product ${item.productId}:`, productError);
                    return { ...item, product: null }; // Return the cart item with product set to null if fetching fails
                }
            })
        );
        return cartItemsWithProducts;
    } catch (error) {
        console.error("Error fetching cart items:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

/*
 Adds a product to the user's cart.
 */
export const addToCart = async (productId, quantity) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        const response = await axios.post(
            `${API_URL}/cart`,
            { productId, quantity: quantity },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

/* Removes an item from the user's cart */
export const removeFromCart = async (cartItemId) => {
    try {
        const response = await axios.delete(`${API_URL}/cart/${cartItemId}`, {
            headers: getAuthHeader(), // Include the token
        });
        return response.data;
    } catch (error) {
        console.error("Error removing from cart:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
};