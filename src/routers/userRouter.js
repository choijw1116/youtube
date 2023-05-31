import express from "express";
import {
  join,
  editUser,
  deleteUser,
  watch,
  logout,
  startGithubLogin,
  finishGithubLogin,
} from "../controllers/userController";

//user Router만들기
const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", editUser);
userRouter.get("/delete", deleteUser);
userRouter.get("/github/start", startGithubLogin); //user를 github으로 redirect시킴
userRouter.get("/github/finish", finishGithubLogin); //user를 github으로 redirect시킴
userRouter.get(":id", watch);

export default userRouter;
