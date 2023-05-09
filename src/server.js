import express from "express";
import morgan from "morgan"; //morgan함수는 middleware를 return 해준다 morgan함수는 좀 더 정교하게 정보를 보여준다
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;

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
//router사용방법
app.use("/", globalRouter); //url을 첫번쨰인자, router를 두번쨰인자
app.use("/users", userRouter);
app.use("/videos", videoRouter);

//외부접속 listen
const hadleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, hadleListening); //listen 시작, 외부에 개방
