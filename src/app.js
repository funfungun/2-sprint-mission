import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import productRoute from "./routes/productRoute.js";
import articleRoute from "./routes/articleRoute.js";
import commentRoute from "./routes/commentRoute.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/product", productRoute);
app.use("/article", articleRoute);
app.use("/comment", commentRoute);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server starting on ${process.env.PORT}`);
});
