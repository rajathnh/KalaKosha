require("dotenv").config();

// --- Core Dependencies ---
const express = require("express");
const app = express();
const http = require("http");
const path = require("path");

// --- Security, Utility, and Middleware Packages ---
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
//const mongoSanitize = require("express-mongo-sanitize");

// --- Cloudinary for Image Uploads ---
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Database Connection ---
const connectDB = require("./db/connect");

// --- Routers ---
const authRouter = require('./routes/authRoutes');
// Placeholders for future routers
// const userRouter = require('./routes/userRoutes');
// const artistRouter = require('./routes/artistRoutes');

// --- Middleware Imports ---
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// --- Server & Middleware Configuration ---
const server = http.createServer(app);

// Use morgan for logging in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Standard Security Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
//app.use(mongoSanitize());

// Rate Limiting to prevent brute-force attacks
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, 
  })
);

// Parsers for JSON, URL-encoded data, and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));

// File Upload Middleware
app.use(fileUpload({ useTempFiles: true }));

// Static assets (if needed)
app.use(express.static(path.join(__dirname, "public")));


// --- API ROUTES ---
app.use('/api/v1/auth', authRouter);
// app.use('/api/v1/users', userRouter);
// app.use('/api/v1/artists', artistRouter);


// --- Custom Error Handling Middleware (must be last) ---
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


// --- Server Initialization ---
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    // Connect to the database using your connect.js module
    await connectDB(process.env.MONGO_URI);
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
      console.log(`Connected to MongoDB.`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

start();