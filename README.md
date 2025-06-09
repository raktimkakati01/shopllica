# Shopllica

Shopllica is a simple e-commerce authentication API built with Node.js, Express and MongoDB. The repository contains a backend API and a small frontend that demonstrates registration and login functionality.

## Project structure

```
backend/
├── controllers/     # request handlers
├── middleWare/      # auth & error middleware
├── models/          # Mongoose schemas
├── routes/          # Express route definitions
├── utils/           # helper utilities (email)
└── server.js        # starts the app
frontend/
├── index.html       # demo page
├── main.css
└── app.js
```

## Backend overview
- `controllers/` – route handlers; `userController.js` manages registration, login, logout, user updates, password changes and reset.
- `models/` – Mongoose schemas for `User` and password reset `Token`.
- `middleWare/` – authentication (`authMiddleware.js`) and error handling (`errorMiddleware.js`).
- `routes/` – Express routes for the user endpoints.
- `utils/sendEmail.js` – helper to send password reset emails using nodemailer.
- `server.js` – Express app entry point that connects to MongoDB and mounts routes.

JWT tokens are issued during login/registration and stored in HTTP-only cookies for authentication.

### API routes
```
POST   /api/users/register
POST   /api/users/login
GET    /api/users/logout
GET    /api/users/getuser          (requires auth)
GET    /api/users/loggedin         (returns true/false)
PATCH  /api/users/updateuser       (requires auth)
PATCH  /api/users/changepassword   (requires auth)
POST   /api/users/forgotpassword
```

## Frontend
A minimal HTML/CSS/JS interface in `frontend/` lets you test the login and registration endpoints from a browser.

## Getting started
1. Install dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file inside `backend/` with variables similar to:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5000
EMAIL_HOST=your_smtp_host
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password
NODE_ENV=development
```

3. Start the development server:

```bash
npm run backend
```

The API will be available at `http://localhost:5000`.

## Next steps
Check how JWT authentication works in `userController.js` and `authMiddleware.js`, how passwords are hashed in `userModel.js`, and how password reset emails are sent with `sendEmail.js`. You can extend the API by adding product and order routes or by improving validation and security.
