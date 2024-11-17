require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");
const logger = require("./utils/logger");

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.get("/api/healthcheck", (req, res) => {
    res.json({
        status: "200",
        message: "Server is up and running" });
});

app.use("/api/contacts", contactRoutes);

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    logger.info(`Server running on port ${PORT}`);
});
