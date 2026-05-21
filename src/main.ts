import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.json({
    message: "Hello Express TS 6",
  });
});

app.listen(PORT, () => {
  console.log("Server running on port 3000");
});
