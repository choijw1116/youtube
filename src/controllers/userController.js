import User from "../models/User";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  console.log(req.body);
  const { name, username, email, password, location } = req.body;
  await User.create({
    //계정생성
    name,
    username,
    email,
    password,
    location,
  });
  //계정생성 후 유저를 로그인페이지로 보내준다
  return res.redirect("/login");
};
export const editUser = (req, res) => {
  res.send("Edit user");
};
export const deleteUser = (req, res) => {
  res.send("Delete user");
};

export const login = (req, res) => {
  res.send("login user");
};
export const logout = (req, res) => {
  res.send("logout user");
};
export const watch = (req, res) => {
  res.send("watch");
};
