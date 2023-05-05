import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express(); //application 생성
const logger = morgan("dev");
//next() 사용을 위한 middleware만들기
const middleWare = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const privateMiddleWare = (req, res, next) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>Not Allowed</h2>");
  }
  console.log("Allowed, you may continue");
  next();
};

const handleHome = (req, res) => {
  return res.send("We are here");
  //next(); //여기서 next()를 호출하면 cannot GET으로 에러가 나온다 그 이유는 next함수를 호출하면 다음 함수인 handleHome을 호출할텐데 hadleHome 다음의 호출할 함수가 없으므로 에러가 난다 app.get('/', handleHome -> 이 뒤로 호출할 함수가 없음)
};

// const handleLogin = (req, res) => {
//   return res.send("Login here");
// };

const handleProtected = (req, res) => {
  return res.send("Welcome to private");
};

//global middlware 만들기
app.use(logger);
//morgan함수는 middleware를 return 해준다
//morgan함수는 좀 더 정교하게 정보를 보여준다
app.use(middleWare);
app.use(privateMiddleWare);
//get request에 응답하는 방법
app.get("/", handleHome); //내 application에게 누군가 어떤 route로 get request를 보내면, 그에 반응하는 callback이 실행
// app.get("/login", handleLogin);
app.get("/protected", handleProtected);

//외부접속 listen
const hadleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, hadleListening); //listen 시작, 외부에 개방
