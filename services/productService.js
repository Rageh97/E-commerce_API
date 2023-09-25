const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const Product = require("../models/productModel");
const factory = require("./handlersFactory");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");

exports.uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // 1) image processing for image cover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverFileName}`);
    // save image into database
    req.body.imageCover = imageCoverFileName;
  }

  //2) image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${imageName}`);
        // save image into database
        req.body.images.push(imageName);
      })
    );
    next();
  }
});
// @desc create product
// @route POST api/v1/products
// @access private
exports.createProduct = factory.create(Product);
// @desc get list of products
// @route GET api/v1/products
// @access public
exports.getProducts = factory.getAll(Product, "Products");

// @desc get specific product
// @route GET api/v1/products/:id
// @access public
exports.getProduct = factory.create(Product);
// @desc update product
// @route PUT api/v1/products/:id
// @access private
exports.updateProduct = factory.update(Product);
// @desc delete product
// @route DELETE api/v1/products
// @access private
exports.deleteProduct = factory.delete(Product);
