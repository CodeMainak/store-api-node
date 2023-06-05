const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitizer = require("express-mongo-sanitize");

const fileUpload = require("express-fileupload");
const connectDB = require("./db/connect");

require("express-async-errors");
require("dotenv").config();

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//rest of the package

const app = express();

//routes
const authRouter = require("./routes/authRoutes");
const userRouters = require("./routes/userRoutes");
const productRouters = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitizer());

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));
app.use(fileUpload());

const PORT = 8000 || process.env.PORT;

mongoose.set("strictQuery", false);

app.get("/", (req, res) => {
  res.send("Welcome to homepage.");
});

app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies);
  res.send("Welcome to API V1 page.");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouters);
app.use("/api/v1/products", productRouters);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(
      PORT,
      console.log(`Application has been started on port no ${PORT}....`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
