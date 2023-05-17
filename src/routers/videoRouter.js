//controller를 실행할 수 있는 건 router다.
import express from "express";
import {
  home,
  watch,
  getEdit,
  upload,
  deleteVideo,
  postEdit,
  getUpload,
  postUpload,
} from "../controllers/videoController";

//video Router만들기
const videoRouter = express.Router();

//videoRouter.get("/upload", upload); //upload를 맨 위에 놓는 이유는 express한테 upload가 id처럼 보여서 인식을 못함
videoRouter.route("/upload").get(getUpload).post(postUpload);

videoRouter.get("/:id([0-9a-f]{24})", watch); //:id는 파라미터를 의미 url안에 변수를 포함시킬 수 있게 해줌
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
// 윗줄과 아래 두줄은 같은의미
// videoRouter.get("/:id([0-9a-f]{24})/edit", getEdit);
// videoRouter.post("/:id([0-9a-f]{24})/edit", postEdit); //수정한 후 save를 눌렀을떼 post 추가
videoRouter.route("/:id([0-9a-f]{24})/delete").get(deleteVideo);

export default videoRouter;
