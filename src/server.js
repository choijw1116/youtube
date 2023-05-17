//server.js파일은 express된 것들과 server의 configuration에 관련된 코드만 처리하는 파일
import express from "express";
import morgan from "morgan"; //morgan함수는 middleware를 return 해준다 morgan함수는 좀 더 정교하게 정보를 보여준다
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
//router사용방법
app.use("/", rootRouter); //url을 첫번쨰인자, router를 두번쨰인자
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
