import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import productRoute from "./routes/productRoute.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/product", productRoute);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server starting on ${process.env.PORT}`);
});
