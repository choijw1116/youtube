import express from "express";
import {
  join,
  editUser,
  deleteUser,
  watch,
  logout,
} from "../controllers/userController";

//user Router만들기
const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", editUser);
userRouter.get("/delete", deleteUser);
userRouter.get(":id", watch);

export default userRouter;
