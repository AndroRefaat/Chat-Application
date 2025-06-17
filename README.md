# Chat-Application

A modern real-time chat application built with Node.js, Express, Socket.IO, and MongoDB. Features user authentication, password reset, and a responsive chat interface.

## Features

- User registration and login
- Email-based OTP verification for signup and password reset
- Real-time group chat using Socket.IO
- Displays online client count
- Modern, responsive UI
- Logout functionality

## Technologies Used

- Node.js & Express
- MongoDB & Mongoose
- Socket.IO
- JWT Authentication
- Nodemailer (for email/OTP)
- HTML, CSS, JavaScript (frontend)

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/Chat-Application.git
   cd Chat-Application
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**

   - Create a `.env` file in the root directory with the following:
     ```env
     PORT=3000
     MONGO_URI=your_mongodb_connection_string
     EMAIL=your_email@gmail.com
     PASSWORD=your_email_password
     ACCESS_TOKEN_EXPIRE=1d
     REFRESH_TOKEN_EXPIRE=7d
     ROUNDS=10
     ```

4. **Start the application:**

   ```bash
   npm run dev
   # or
   npm start
   ```

5. **Open your browser:**
   - Visit [http://localhost:3000](http://localhost:3000)

## Folder Structure

```
Chat-Application/
  ├── index.js
  ├── package.json
  ├── public/
  │   ├── chat.html, main.js, style.css, ...
  ├── src/
  │   ├── app.controller.js
  │   ├── DB/
  │   ├── middlewares/
  │   ├── routes/
  │   ├── utils/
  │   └── socket/
  └── ...
```

## Usage

- Register a new user and verify via OTP sent to your email.
- Login and join the chat room.
- Send and receive real-time messages.
- See the number of online users.
- Use the logout button to securely exit.

## License

This project is licensed under the MIT License.
