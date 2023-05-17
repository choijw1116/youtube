// server.js파일에서 Import 목록이 길어질것같아 따로 init.js파일을 만들어 독립시켜줌
//init.js파일은 필요한 모든것들을 import시키는 역할담당
import "./db"; //db파일자체를 불러온다
import "./models/Video"; //video model을 미리 Import해서 모두가 사용할 수 있게 하기 / database를 import한 후에 해야한다
import "./models/User";
import app from "./server"; //server파일을 가져와 app이 오류가 나지 않도록 해준다.

const PORT = 4000;

//외부접속 listen
const hadleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, hadleListening); //listen 시작, 외부에 개방
