const asyncHandler = require("express-async-handler");
const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const productModel = require("../Models/productModel");
const ApiError = require("../Utils/apiError");
const factory = require("./handlersFactory");

const multerStorage = multer.memoryStorage();
const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Only image allowed", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadProductImages = upload.fields([
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
exports.createProduct = factory.create(productModel);
// @desc get list of products
// @route GET api/v1/products
// @access public
exports.getProducts = factory.getAll(productModel, "Products");

// @desc get specific product
// @route GET api/v1/products/:id
// @access public
exports.getSpecificProduct = factory.create(productModel);
// @desc update product
// @route PUT api/v1/products/:id
// @access private
exports.updateProduct = factory.update(productModel);
// @desc delete product
// @route DELETE api/v1/products
// @access private
exports.deleteProduct = factory.delete(productModel);
