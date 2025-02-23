Products Management Application - Technical Test (Full-Stack)

This project is a full-stack web application developed as part of a technical test for a Junior Full Stack Developer position. It provides a platform for managing products, user authentication, and shopping cart functionality.

Features
Front-End:
# Product Management:
  * View a list of all available products
  * Search for products by name or description
  * Add products to the shopping cart
# User Authentication:
  * User registration and login
  * Protected routes for authenticated users
  * Logout functionality
# Shopping Cart:
  * View and manage items in the cart
  * Remove items from the cart
  * Display total cart price
# Responsive Design:
  The application is responsive and works well on various screen sizes

Back-End:
# Product Management:
  * Retrieve a list of all products (GET /api/Products)
  * Retrieve details of a specific product (GET /api/Products/{id})
  * Add a new product (POST /api/Products - requires authentication)
  * Update an existing product (PUT /api/Products/{id} - requires authentication)
  * Delete a product (DELETE /api/Products/{id} - requires authentication)
# User Authentication:
  * Register a new user (POST /api/Auth/register)
  * Log in a user and receive a JWT token (POST /api/Auth/login)
  * Cart management:
    * Retrieve the user's cart (GET /api/Cart - requires authentication)
    * Add a product to the cart (POST /api/Cart - requires authentication)
    * Remove a product from the cart (DELETE /api/Cart/{id} - requires authentication)
# Data Storage:
  Uses a SQL Server database
# JWT Authentication:
  Implements JWT token-based authentication for protected endpoints
# Data Seeding:
  Seeds sample product data upon application startup
# CORS Support:
  Configured to allow cross-origin requests

Technologies Used
Front-End:
* React
* React Router
* Axios
* React Toastify
* CSS (with responsive design)
* lodash (debounce)

Back-End:
* .NET Core Web API
* Entity Framework Core (for database interactions)
* SQL Server
* JWT (JSON Web Tokens)
* BCrypt.Net (for password hashing)
* C#

Setup and Installation
Back-End
1. Clone the repository:
    git clone https://github.com/elmellahijamal/ProductsCrud
    cd backend

2. Install .NET SDK:
    * Ensure you have the .NET SDK installed. You can download it from [https://dotnet.microsoft.com/download](https://dotnet.microsoft.com/download).
    * Verify the installation by running `dotnet --version` in your terminal.

3.  Install Entity Framework Core Tools:
    * If you haven't already, install the EF Core tools globally:
        dotnet tool install --global dotnet-ef
    * Verify the installation by running `dotnet ef --version` in your terminal.

4. Set Up the Database:
    * **Install SQL Server:** Make sure SQL Server (or SQL Server Express) is installed and running on your machine.
    * **Update Connection String:** Open the `appsettings.json` file in the `backend` directory.
        * Locate the `ConnectionStrings:DefaultConnection` section.
        * Update the connection string to match your SQL Server instance. Replace the placeholder values with your actual server name, database name, and credentials.
        * Example connection string:
            "ConnectionStrings": {
              "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=ProductsDB;User Id=YOUR_USER_ID;Password=YOUR_PASSWORD;TrustServerCertificate=True;"
            }
            * **Note:** replace YOUR_SERVER_NAME, ProductsDB, YOUR_USER_ID, and YOUR_PASSWORD with your own values.
    * **Run Migrations:**
        * Navigate to the `backend` directory in your terminal.
        * Apply the database migrations to create the database schema:
            dotnet ef database update
        * If it is the first time running the application, and no migrations exist, run the following commands.
            dotnet ef migrations add InitialCreate
            dotnet ef database update
            ```
        * This command will create the database (if it doesn't exist) and apply the necessary schema.
        * Ensure that the database name in the connection string matches the database that you want to create.
    * **Ensure the database is created; the application will attempt to create it on first run:** This is handled by the `dotnet ef database update` command.

5. Configure JWT settings:
    * Update `Jwt:SecretKey`, `Jwt:Issuer`, and `Jwt:Audience` in `appsettings.json`.
    * **Important:** `Jwt:SecretKey` must be at least 16 characters long.
6. Run the application:
   dotnet run
   The API will be accessible at https://localhost:7003/api (or your configured port)


Front-End
1. Clone the repository (if not already cloned):
   git clone https://github.com/elmellahijamal/ProductsCrud
   cd frontend
2. Install dependencies:
   npm install
3. Run the application:
   npm start
   The application will be accessible at http://localhost:3000 (or your configured port)

API Endpoints
Products
* GET /api/Products: Retrieves a list of all products
* GET /api/Products/{id}: Retrieves details of a specific product
* POST /api/Products: Adds a new product (requires authentication)
* PUT /api/Products/{id}: Updates an existing product (requires authentication)
* DELETE /api/Products/{id}: Deletes a product (requires authentication)

Authentication
* POST /api/Auth/register: Registers a new user
* POST /api/Auth/login: Logs in a user and returns a JWT token

Cart
* GET /api/Cart: Retrieves the user's cart items (requires authentication)
* POST /api/Cart: Adds a product to the user's cart (requires authentication)
* DELETE /api/Cart/{id}: Removes an item from the user's cart (requires authentication)

Front-End Structure
* src/services/api.js: Contains functions for making API requests using Axios
* src/services/ProtectedRoute.js: Protects routes that require authentication
* src/components/: Contains React components, each in its own folder:
  * ProductList/ProductList.js: Displays the list of products and handles adding to cart
  * Login/Login.js: Handles user login
  * Cart/Cart.js: Displays and manages the shopping cart
* src/contexts/AuthContext.js: Manages authentication state using React Context API
* src/App.js: Main application component with routing
* src/index.js: Entry point of the React application
* src/components/<component_name>/<component_name>.css: Contains CSS files for styling each component

Authentication Flow
1. User enters credentials on the login page
2. The front-end sends a POST request to /api/Auth/login
3. The back-end validates the credentials and returns a JWT token
4. The front-end stores the token in localStorage
5. For protected routes, the front-end includes the token in the Authorization header of API requests
6. The back-end validates the token and authorizes the request

Key Front-End Logic
ProductList:
  * Fetches products from the API and displays them
  * Allows users to search and filter products
  * Handles adding products to the cart
  * Uses debounce from lodash to improve search performance

Login:
  * Handles user login and stores the JWT token
  * Handles adding a product to the cart if the user was redirected from a product page

Cart:
  * Fetches and displays cart items
  * Allows users to remove items from the cart
  * Calculates and displays the total price

AuthContext:
  * Manages user authentication state
  * Provides login and logout functions
  * Uses jwt-decode to decode JWT tokens
  * Handles token expiration

ProtectedRoute:
  * Protects routes that require authentication
  * Redirects unauthenticated users to the login page

Back-End Details
* Authentication: Protected endpoints require a valid JWT token in the Authorization header, formatted as Bearer {token}
* Data Seeding: Sample product data is seeded on application startup if the database is empty
* Assumptions:
  * SQL Server is used as the database
  * JWT is used for authentication
  * The API runs on https://localhost:7003/api
  * The front-end provides the JWT token in the authorization header
* Approach and Challenges:
  * Used .NET Core Web API with Entity Framework Core
  * Implemented JWT authentication using Microsoft.AspNetCore.Authentication.JwtBearer
  * Used BCrypt.Net for password hashing
  * Used scoped repositories and DTOs
  * Added CORS support and error handling
  * Challenges included configuring JWT, handling database interactions, and debugging authentication issues

Notes:
* The API can be enhanced with input validation, robust error handling, and detailed logging
* Consider using environment variables for sensitive information
* Consider adding FluentValidation

Assumptions
* The back-end API is running on https://localhost:7003/api
* The front-end application is running on http://localhost:3000
* Users have JavaScript enabled
* The back-end database is configured correctly


Author :
Mohamed Jamal El Mellahi
https://github.com/elmellahijamal
melmellahijamal@gmail.com
