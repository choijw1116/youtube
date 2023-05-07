export const trending = (req, res) => {
  res.send("Homepage videos ");
};
export const watch = (req, res) => {
  //   console.log(req.params);
  res.send(`watch video #${req.params.id}`);
};
export const edit = (req, res) => {
  res.send("Edit videos ");
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
