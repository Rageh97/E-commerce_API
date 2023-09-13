// 1) import mongoose
const mongoose = require("mongoose");
// 2) connect with database url
mongoose
  .connect("mongodb://127.0.0.1:27017/FIRSTDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("we are connected to the database");
  })
  .catch((err) => {
    console.log(err);
  });

// 3) create schema
// const studenSchema = new mongoose.Schema({
//   fn: string,
//   ln: string,
//   dept: string,
//   id: number,
// });
// 4) create model
// const Student = mongoose.model("Students", studenSchema);
//  crud operation
