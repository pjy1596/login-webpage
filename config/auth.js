module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "You cannot access here");
    res.redirect("users/login");
  },
};
// 이거 format 하느라 또 한참 걸림
