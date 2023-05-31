//server.js파일은 express된 것들과 server의 configuration에 관련된 코드만 처리하는 파일
import express from "express";
import morgan from "morgan"; //morgan함수는 middleware를 return 해준다 morgan함수는 좀 더 정교하게 정보를 보여준다
import session from "express-session"; //express에서 session을 사용할 수 있도록 도와주는 middleware
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middlewares";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

// console.log(process.cwd());

const app = express(); //application 생성
const logger = morgan("dev");

//Express에게 html헬퍼로 pug를 쓰겠다고 말해줘야함
//view engine을 pug로 설정하면 Express가 html을 리턴하기 위해서 pug를 사용한다.

//view engine을 pug로 세팅하기
app.set("view engine", "pug");
//cwd 경로 변경해주기
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true })); //express가 form의 value를 이해할 수 있게 해줌. middleware가 먼저 form을 이해하고, 자바스크립트로 변형시켜줘 사용할 수 있도록 routes보다 위에 적어줘야함!

//session
//이 middleware가 사이트로 들어오는 모두를 기억하는 역할
//위에 있는 express-session에서 주어진것
//브라우저가 backend와 상호작용할때마다 하단의 session middleware가 브라우저에 cookie를 전송한다.
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }), //db에 세션이 저장되도록해준다.
  })
);

app.use((req, res, next) => {
  req.sessionStore.all((error, sessions) => {
    console.log(sessions); //백엔드가 기억하고 있는 sessions를 보여줌
    next();
  });
});

app.get("/add-one", (req, res, next) => {
  req.session.potato += 1;
  return res.send(`${req.session.id}\n${req.session.potato}`);
});

//router사용방법
app.use(localsMiddleware); //session middleware다음에 있어야함
app.use("/", rootRouter); //url을 첫번쨰인자, router를 두번쨰인자
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
