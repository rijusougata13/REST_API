const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../../models/users");
const bcrypt = require("bcrypt");

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email }).then((doc) => {
    if (doc.length >= 1) {
      return res.status(409).json({
        msg: "user already exist",
      });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: msg,
          });
        } else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash,
          });
          user
            .save()
            .then((result) => {
              res.status(201).json({
                msg: "user created",
              });
            })
            .catch((err) => {
              res.status(500).json({
                error: err,
              });
            });
        }
      });
    }
  });
});

router.delete("/:userId", (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
