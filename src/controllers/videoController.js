export const trending = (req, res) => {
  //   res.send("Homepage videos ");
  res.render("home", { pageTitle: "Home" }); //pug로 사용하는 방법. 첫번째 인자로 보여줄 view의 이름을 적는다. 우리의 경우 home화면이므로 home을 적어준다. 그러면 home.pug 파일을 렌더링 해줄 수 있다.
};
export const watch = (req, res) => {
  //   console.log(req.params);
  //   res.send(`watch video #${req.params.id}`);
  res.render("watch", { pageTitle: "Watch" });
};
export const edit = (req, res) => {
  res.render("edit", { pageTitle: "Edit" });
};
export const search = (req, res) => {
  res.send("Search");
};
export const upload = (req, res) => {
  res.send("upload");
};
export const deleteVideo = (req, res) => {
  res.send("deleteVideo");
};
