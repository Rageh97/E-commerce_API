const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config({ path: "config.env" });
const PORT = process.env.PORT;
const app = new express();
app.use(express.json());
const categoryRoute = require("./Routes/categoryRoute");
const dbConnection = require("./Config/database");
// connect db
dbConnection();
// mode
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}
// routes
app.use("/api/v1/categories", categoryRoute);
// port
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
