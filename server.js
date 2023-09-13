const express = require("express");
const app = new express();
const dotenv = require("dotenv");
dotenv.config({path: "config.env"})
const PORT  = process.env.PORT;
app.listen(PORT, () => {
    console.log("server running");

}) ;