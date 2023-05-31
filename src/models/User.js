import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  socialOnly: { type: Boolean, default: false }, //유저가 email로 로그인하려는데 pw가 없을때 유용
  username: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  location: String,
});

//save할때
userSchema.pre("save", async function () {
  //여기서 this는 userController에서 create되는 User를 가리킨다. 이 User의 password를 hash화 한 다음에 저장하는것
  this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);

export default User;
