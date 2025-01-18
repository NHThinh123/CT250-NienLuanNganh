require("dotenv").config();

const express = require("express");
const cors = require("cors");
const configViewEngine = require("./config/viewEngine");

const userRoutes = require("./routes/user.route");

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configViewEngine(app);

app.use("/api/user", userRoutes);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
