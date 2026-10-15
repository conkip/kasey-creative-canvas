import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import authRoutes from "./routes/auth-routes.js";
import userRoutes from "./routes/user-routes.js";
import paintingRoutes from "./routes/painting-routes.js";
import adminRoutes from "./routes/admin-routes.js";

const app = express();

const port = process.env.PORT || 3000;
const domainName = process.env.DOMAIN || "127.0.0.1";
const dbURL = process.env.MONGODB_URL;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

async function startServer() {
    await mongoose.connect(dbURL);

    app.use("/auth", authRoutes);
    app.use("/user", userRoutes);
    app.use("/painting", paintingRoutes);
    app.use("/admin", adminRoutes);

    app.use(express.static(path.join(__dirname, "public")));

    app.use((req, res) => {
        res.status(404).send("<h1>404 - Not Found</h1>");
    });

    app.listen(port, domainName, () => {
        console.log(`Server running at http://${domainName}:${port}/`);
    });
}

startServer();
