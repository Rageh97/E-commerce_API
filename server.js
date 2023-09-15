const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config({ path: "config.env" });
const PORT = process.env.PORT;
const app = new express();
app.use(express.json());
const categoryRoute = require("./Routes/categoryRoute");
const productRoute = require("./Routes/productRoute");
const dbConnection = require("./Config/database");
const ApiError = require("./Utils/apiError");
const globalError = require("./Middlewares/globalError");
// connect db
dbConnection();
// mode
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}
// routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/products", productRoute);

app.all("*", (err, req, res) => {
  next(new ApiError(`can't find this route: ${req.originalUrl}`, 400));
});
// global error handler
app.use(globalError);
// port
const server = app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
// handle rejections outside of express
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled rejection error ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`shutting down........`);
    process.exit(1);
  });
});
