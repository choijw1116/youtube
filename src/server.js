import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;

const app = express(); //application 생성
const logger = morgan("dev");
//global middlware 만들기
app.use(logger);
//morgan함수는 middleware를 return 해준다
//morgan함수는 좀 더 정교하게 정보를 보여준다

//router사용방법
app.use("/", globalRouter); //url을 첫번쨰인자, router를 두번쨰인자
app.use("/users", userRouter);
app.use("/videos", videoRouter);

//외부접속 listen
const hadleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, hadleListening); //listen 시작, 외부에 개방
