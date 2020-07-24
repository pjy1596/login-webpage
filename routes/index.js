const express = require("express");
const router = express.Router();
const path = require("path");
const { ensureAuthenticated } = require("../config/auth");
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "test static", "index.html"));
});
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  // name을 render 안에 넣는 것도 한참 고민함
  res.render("../views/dashboard", {
    name: req.user.name,
  });
});
// module export 까먹음
module.exports = router;
