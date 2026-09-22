import express from "express";
import { tripRouter } from "./Routers/tripRouter.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { router } from "./Routers/userRoutes.js";
import propertyRouter from "./Routers/propertyRouter.js";
import { bookingRouter } from "./Routers/bookingRouter.js";

import Connect_db from "./utils/db.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN_ACCESS_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());
app.use(cors({
    origin:process.env.ORIGIN_ACCESS_URL,
    credentials:true
}))

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.send("Homelyhub is running");
});

app.use("/api/v1/rent/user", router);
app.use("/api/v1/rent/listings", propertyRouter);
app.use("/api/v1/rent/user/booking", bookingRouter);
app.use("/api/v1/rent/trip", tripRouter);

Connect_db();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});