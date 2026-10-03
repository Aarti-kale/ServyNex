import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import routes from "./routes/routeIndex.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import helmet, { crossOriginResourcePolicy } from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";

dotenv.config();
connectDB();

const app = express();
app.set("trust proxy", 1);
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("Hello ServyNex!");
});

app.use(errorHandler);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`ServyNex is running on port ${PORT}`);
});
