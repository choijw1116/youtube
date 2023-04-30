import express from "express";

const PORT = 4000;

const app = express();

const hadleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, hadleListening);
