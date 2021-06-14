const express = require("express");
const router = express.Router();
const Product = require("../../models/products");
const mongoose = require("mongoose");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", checkAuth, (req, res, next) => {
  Product.find()
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({
        msg: err,
      });
    });
});

router.post("/", upload.single("productImage"), checkAuth, (req, res, next) => {
  // console.log(req.file);
  const product = new Product({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product
    .save()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(201).json({
    msg: "post req to /products",
    createdProduct: product,
  });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .then((doc) => {
      console.log(doc);
      res.status(200).json({
        msg: doc,
      });
    })
    .catch((err) => {
      res.status(500).json({
        msg: err,
      });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;

  Product.updateOne(
    { _id: id },
    {
      $set: {},
    }
  )
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => res.status(500).json({ msg: err }));
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => res.status(500).json({ msg: err }));
});

module.exports = router;
