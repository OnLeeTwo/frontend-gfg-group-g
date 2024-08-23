# Sucomart Website

[Link to the website](https://sucomart.vercel.app/)

Sucomart is a e-commerce in development market website for sustainable and eco product. It use next.js as it's main framework. This documentation provides an overview of the features and functionalities of our e-commerce website, including details on features, user roles, and setup instructions. Created by Group G FSSE Revou Jan'24, 23 August 2024 by:

- Owent Ovandy (Team Lead)
- Firman Maulana
- Richo Wardiyanto
- Rizky Akbar
- Calvin Febriando Kurniawan

## Application Details

### Library Used

- React (JavaScript Library)
- Next.js (React Framework)
- Chakra UI (UI Library for Buyer)
- shadcn/ui (UI Library for Seller)
- formik
- yup/zod
- jsonwebtoken
- zustand

### Apps Depedency

- "react": "^18",
- "next": "14.2.5",
- "yup": "^1.4.0",
- "formik": "^2.4.6",
- "jsonwebtoken": "^9.0.2",
- "@chakra-ui/react": "^2.8.2",

## Function and Description

### Cart

The cart allows users to add products and manage their quantities before proceeding to checkout.
![Cart](https://imagizer.imageshack.com/img924/7852/cFcRia.png)

### Checkout

The checkout process handles payment and order confirmation. Users can review their cart, select shipping details, and complete their purchase. Payment page are for development only.
![Checkout](https://imagizer.imageshack.com/img922/6569/hjkoLL.png)

### Wishlist

Users can add products to their wishlist to save items for later viewing or purchase.
![Wishlist](https://imagizer.imageshack.com/img924/6712/IOfvJk.png)

### Product List

Displays a list of products available on the website, including details such as price, description, and availability.
![Product](https://imagizer.imageshack.com/img923/6521/903Sdq.png
)

### Market List

Displays a list of markets where users can browse products from different sellers.
![Market](https://imagizer.imageshack.com/img924/161/fZk9NH.png)

### CRUD Operations

#### Product Management

Seller can create, fetch, update, and delete products. This includes adding product details such as name, price, description, images, and categories.

#### Market Management

Market management allows admins and authorized users to create, read, update, and delete market information, including market name, location, and associated products.

#### User Management

User management features include registering, updating, and deleting user accounts. User can also add their profile picture and address

## Authentication & Authorization

### User Roles

- **Buyer**: Can browse products, add to cart, checkout, and manage their wishlist.
- **Seller**: Can manage products, CRUD market, and manage orders.

### JWT Tokens

Authentication is handled using JWT tokens. Users must provide a valid token to access protected routes. Tokens are issued upon login and can be refreshed using the refresh token endpoint

## Installation & Setup

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up the environment variables.
4. Run the development server using `npm run dev`.
5. Access the website at `http://localhost:3000`
