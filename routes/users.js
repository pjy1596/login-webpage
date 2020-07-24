const express = require("express");
const router = express.Router();
const path = require("path");

const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../model/User");
router.get("/login", (req, res) => {
  res.render("../views/login");
});
router.get("/register", (req, res) => {
  res.render("../views/register");
});
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  if (password != password2) {
    errors.push({ msg: "passwords do not match" });
  }
  if (password.length < 6) {
    errors.push({ msg: "passwords should be at least 6 characters" });
  }
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "fill in every field" });
  }
  if (errors.length > 0) {
    res.render("register", {
      // 그냥 이 페이지 그대로 가는 거라서 /register로 함, app서 이미 라우트 정해놨음
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email })
      .then((user) => {
        if (user) {
          // if문 써야 하는데 헷갈렸음
          errors.push({ msg: "input another email" });
          res.render("register", { errors, name, email, password, password2 });
        } else {
          const userInfo = new User({
            name,
            email,
            password,
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(userInfo.password, salt, (err, hash) => {
              if (err) throw err;
              userInfo.password = hash;
              userInfo
                .save()
                .then((user) => {
                  req.flash("success_msg", "Successfully registered");
                  res.redirect("login");
                })
                .catch((err) => console.log(err));
            });
          });
        }
      })
      .catch((err) => console.log(err));
  }
});
router.post("/login", (req, res, next) =>
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next)
);
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Successfully logged out");
  res.redirect("login");
});
module.exports = router;
