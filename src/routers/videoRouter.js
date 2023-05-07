import express from "express";
import {
  trending,
  watch,
  edit,
  upload,
  deleteVideo,
} from "../controllers/videoController";

//video Router만들기
const videoRouter = express.Router();

videoRouter.get("/upload", upload); //upload를 맨 위에 놓는 이유는 express한테 upload가 id처럼 보여서 인식을 못함
videoRouter.get("/:id", watch); //:id는 파라미터를 의미 url안에 변수를 포함시킬 수 있게 해줌
videoRouter.get("/:id/edit", edit);
videoRouter.get("/:id/delete", deleteVideo);

export default videoRouter;
