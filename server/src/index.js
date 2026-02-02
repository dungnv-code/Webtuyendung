const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();
var cookieParser = require('cookie-parser')
// middlewares
const corsOptions = {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};

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