const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();
const cookieParser = require('cookie-parser')
const rateLimit = require("express-rate-limit");
// middlewares
const corsOptions = {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100, // mỗi IP tối đa 100 request / 15 phút
    message: {
        success: false,
        mes: "Bạn đã gửi quá nhiều request. Hãy thử lại sau!"
    }
});
app.use(limiter);

app.use(cors(corsOptions));
app.use(express.json({ extended: true }));
app.use(cookieParser());

// database connection
const { connectDB } = require("./config/db");
connectDB();

const RootRouter = require("./router/index");
RootRouter(app);

const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Server running on port http://localhost:${port}`); });  