const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const userRouter = require("./routes/UserRoute");
const positionsRouter = require("./routes/PositionRoute");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config({ path: "./.env" });
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));



app.use("/users", userRouter);
app.use("/positions", positionsRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App is running at port: ${port}...`);
});
