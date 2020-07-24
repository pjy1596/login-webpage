// setting, route연결, ejs
// mongoose 연결 + db config, model-schema, bodyparser // 참고로 bodyparser는 app.post가 있어야 의미가 있다
// post, 1(register에서 에러가 생기는 경우 세팅, 에러 메세지 뜨게 만들기)
// post, 2(register에서 에러 없이 정상적으로 넘어가는 경우 세팅, submit 전에 이미 있는 이메일 주소인지 확인-> 아니면 에러 메세지
// 만약 아니면 비밀번호 암호화 시켜서 저장하기, 성공 메시지 뜨게 하기)
// passport에 유저 정보 주기(email과 passport 매치하는지 체크) - 세션 키기 - passport와 세션 연결해서 세션에 정보 저장
// login 성공과 실패시 routing 각각, logout, login 안하고 못 보게 ensureAuthenticated + flash message, login시 user 이름 뜨게 해주기
// passport(authenticate을 위해 쓰임)
// express session을 이용하는 passport나 flash는 use를 express session보다 밑에 놔야 됨
// *flash는 redirect시에 쓰인다. session에 저장해놨다가 꺼내는 것이므로 session도 활성화 시켜야.
// https://medium.com/@krpeppermint100/nodejs-flash-%EB%A9%94%EC%8B%9C%EC%A7%80-e4f45bd001ad flash 참고
// https://m.blog.naver.com/pjok1122/221566039764 passport 참고
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

require("./config/passport")(passport);
const db = require("./config/keys").MongoURI;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("mongo db connected...");
  })
  .catch(() => {
    "error happened...";
  });
// 밑에 두 라인도 까먹음
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
// index랑 user에 있는 거 use 해주는 거 깜빡
// 미친. ejs use랑 set은 밑에 app use보다 위에 위치해야 한다
// app use route는 항상 거의 맨 밑에
// 그리고 layout file 말고 다른 ejs file은 그냥 바로 메세지 치면 됨
//  I realize that passport JS is using the variable success to display success flash and error to display failure flash.

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: "www",
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error = req.flash("error");
  res.locals.error_msg = req.flash("error_msg");
  next();
});
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`server started on PORT ${PORT}`));
