const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../../models/orders");
const Product = require("../../models/products");

router.get("/", (req, res, next) => {
  Order.find()
    .populate("product")
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({
        msg: err,
      });
    });
});

router.post("/", (req, res, next) => {
  Product.findById(req.body.product)
    .then((result) => {
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.product,
        quantity: req.body.quantity,
      });
      order
        .save()
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((err) => {
          res.status(500).json({
            msg: err,
          });
        });
    })
    .catch((err) => {
      res.json({
        msg: "Product not found",
      });
    });
});

router.get("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
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

router.delete("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => res.status(500).json({ msg: err }));
});

module.exports = router;
