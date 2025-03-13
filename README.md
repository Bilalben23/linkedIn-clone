# LinkedIn Clone

## Overview

This is a **LinkedIn Clone** built using the **MERN Stack** (MongoDB, Express, React, and Node.js). The application provides a social networking experience similar to LinkedIn, allowing users to create accounts, connect with others, post content, react to posts, comment, receive notifications, and manage their network.

While this project is a **good MVP**, it is not yet fully polished. There is still room for improvements, new features, and optimizations. Developers are encouraged to **fork the repository**, contribute, and help enhance the platform!

## Features

- User authentication (Signup, Signin, JWT authentication, persisted login)
- Profile management
- Create, read, update, and delete (CRUD) posts
- React to posts (likes, etc.)
- Comment on posts
- Network (connections management)
- Notifications
- Secure API with authentication and authorization
- Image uploads with Cloudinary
- Responsive UI built with React and Tailwind CSS

## Tech Stack

### Frontend

- **React** (v19.0.0)
- **React Router DOM** (v7.2.0) - Routing
- **Tailwind CSS** (v4.0.6) - Styling
- **Framer Motion** (v12.4.7) - Animations
- **Axios** (v1.7.9) - HTTP requests
- **TanStack React Query** (v5.66.9) - API state management
- **React Toastify** (v11.0.5) - Notifications
- **Formik & Yup** (v2.4.6 & v1.6.1) - Form handling and validation
- **React Image** (v4.1.0) - Image optimization
- **React Spinners** (v0.15.0) - Loading indicators
- **Numeral** (v2.0.6) - Number formatting
- **React Content Loader** (v7.0.2) - Skeleton loading

### Backend

- **Node.js & Express.js** (v4.21.2) - Server and API
- **MongoDB & Mongoose** (v8.10.1) - Database and ORM
- **Passport & JWT** - Authentication
- **Express Validator** (v7.2.1) - Input validation
- **Cloudinary** (v2.5.1) - Image storage
- **Express File Upload** (v1.5.1) - File handling
- **Mailtrap** (v3.4.0) - Email service
- **Helmet & CORS** (v8.0.0 & v2.8.5) - Security enhancements
- **Bcrypt** (v5.1.1) - Password hashing

## Installation & Setup

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v18+ recommended)
- **MongoDB** (Local or Cloud Atlas instance)
- **Cloudinary Account** (For image uploads)

### Clone the Repository

```sh
git clone https://github.com/Bilalben23/linkedIn-clone.git
cd linkedIn-clone
```

### Backend Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` file in the `backend` folder and add:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.yh0fm.mongodb.net/<DB_NAME>?retryWrites=true&w=majority&appName=Cluster0
   CLIENT_URL="http://localhost:5173"
   MAILTRAP_TOKEN=<YOUR_MAILTRAP_TOKEN>
   MAILTRAP_SENDER_EMAIL=<YOUR_MAILTRAP_SENDER_EMAIL>
   MAILTRAP_SENDER_NAME="<YOUR_NAME>"
   SECRET_REFRESH_TOKEN=<YOUR_SECRET_REFRESH_TOKEN>
   SECRET_ACCESS_TOKEN=<YOUR_SECRET_ACCESS_TOKEN>
   CLOUDINARY_API_KEY=<YOUR_CLOUDINARY_API_KEY>
   CLOUDINARY_CLOUD_NAME=<YOUR_CLOUDINARY_CLOUD_NAME>
   CLOUDINARY_API_SECRET=<YOUR_CLOUDINARY_API_SECRET>
   ```

3. Start the backend server:
   ```sh
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend development server:
   ```sh
   npm run dev
   ```

## Folder Structure

```
linkedin-clone/
├── backend/
│   ├── configs/
|   |-- controllers/
│   ├── middlewares/
│   ├── models/
│   ├── emails/
│   ├── routes/
│   ├── validations/
│   |── server.mjs
│
├── frontend/
│   ├── src/
│   │   ├── components/
|   |   |-- context/
|   |   |-- hooks/
|   |   |-- utils/
│   │   ├── pages/
│   │   ├── App.js
│   │   ├── index.css
│   │   ├── main.jsx
│   ├── tailwind.config.js
│   └── .env
|-- .env
|-- node_modules/
└── README.md
```

## API Endpoints

### Authentication

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| POST   | `/api/v1/auth/signup` | Register a new user |
| POST   | `/api/v1/auth/signin` | User login          |
| GET    | `/api/v1/auth/logout` | Logout user         |

### Users

| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| GET    | `/api/v1/users/:id` | Get user profile    |
| PUT    | `/api/v1/users/:id` | Update user profile |
| DELETE | `/api/v1/users/:id` | Delete user account |

### Posts

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| POST   | `/api/v1/posts`     | Create a post     |
| GET    | `/api/v1/posts`     | Get all posts     |
| GET    | `/api/v1/posts/:id` | Get a single post |
| PUT    | `/api/v1/posts/:id` | Update a post     |
| DELETE | `/api/v1/posts/:id` | Delete a post     |

## Future Enhancements

- Implement **BullMQ + Redis** for handling notifications efficiently
- Implement **WebSockets** for real-time updates
- Integrate **GraphQL** for API optimization
- Explore **Bun.js** for backend performance improvements
- Implement **Single Sign-On (SSO)** for authentication

## Contributing

This project is still in an early stage, and there’s plenty of room for enhancements! If you'd like to contribute, **fork this repository**, work on a feature, and submit a pull request. Your contributions are highly appreciated!

## License

This project is licensed under the MIT License.

---

Happy Coding! 🚀
