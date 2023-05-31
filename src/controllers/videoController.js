import Video from "../models/Video"; //video model파일을 import

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" });
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  //   const id = req.params.id; //아래 ES6와 같은 의미
  const { id } = req.params; //video의 id 얻기
  // const video = videos[id - 1]; //video arr의 n번째 이므로 0부터 시작 id에서 -1을 해준다
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video Not Found" });
  }
  return res.render("watch", { pageTitle: video.title, video });
};
//edit form을 화면에 보여줌
export const getEdit = async (req, res) => {
  const { id } = req.params; //video의 id 얻기
  // const video = videos[id - 1]; //video arr의 n번째
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found" });
  }
  return res.render("edit", { pageTitle: `Editing: ${video.title} `, video });
};
//edit의 변경사항을 저장해줌
export const postEdit = async (req, res) => {
  const { id } = req.params; //video의 id 얻기
  const { title, description, hashtags } = req.body;
  // videos[id - 1].title = title; //더미데이터에 업데이트
  const video = await Video.exists({ _id: id }); //영상검색 -> 영상이 존재하는지 확인해야하는데 video object를 굳이 가져올 필요가 없으므로 findById를 exist()로 대체할 수 있다. object의 id가 req.params의 id와 같은 경우를 찾는다는 의미이다.
  if (!video) {
    //영상존재확인 후 없으면 404렌더링
    return res.status(404).render("404", { pageTitle: "Video Not Found" });
  }
  //영상정보업데이트
  //findByIdAndUpdate() - 첫번째 인자에 id를 넣어준다. 두번째 인자에는 업데이트할 정보나 내용을 넣어준다.
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  // findByIdAndUpdate가 아래 save까지 내용을 업데이트해준다.
  // video.title = title;
  // video.description = description;
  // video.hashtags = hashtags
  //   .split(",")
  //   .map((word) => (word.startsWith("#") ? word : `#${word}`));
  //await video.save(); //영상정보업데이트
  return res.redirect(`/videos/${id}`); //브라우저가 redirect하도록해줌. 그전페이지로 가도록 url 재설정
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "upload video" });
};
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  //video만들기
  //1. document만들기(데이터를 가진 비디오)
  //2. document를 database에 저장하기

  //첫번째방법 - 하나의 object를 만들고 그 object를 database에 저장
  //1. documen만들기 / video model의 schema와는 다르게 document에는 실제 데이터를 담는다
  // const video = new Video({
  //   //{}안에 video model의 구성요소를 담아준다.
  //   title,
  //   description,
  //   createdAt: Date.now(),
  //   hashtags: hashtags.split(",").map((word) => `#${word}`), //입력된 데이터를 ,로 나누고 나눈 단어들앞에 #를 붙여준다
  //   meta: {
  //     views: 0,
  //     rating: 0,
  //   },
  // });
  // //2. database에 저장하기
  // await video.save(); //save는 promise를 return 해주는데 save작업이 끝날때까지 기다려줘야한다는 의미다. javascript가 기다리는 기능을 하기 위해서 async await를 추가해준다.

  try {
    //두번째방법 - create()를 사용. create을 사용하면 object를 만들어주는 과정을 안해도된다.
    await Video.create({
      //{}안에 video model의 구성요소를 담아준다.
      title,
      description,
      // createdAt: Date.now(),
      // hashtags: hashtags
      //   .split(",")
      //   .map((word) => (word.startsWith("#") ? word : `#${word}`)), //입력된 데이터를 ,로 나누고 나눈 단어들앞에 #를 붙여준다
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "upload video",
      errorMessage: error._message,
    });
  }
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        //ㅏkeyword의 철자만 같아도 검색이 되게끔한다. regex라는 연산자 사용. i는 대소문자 상관없이 검색해주게한다는 뜼
        //`^${keyword}` - keyword로 시작하는 제목만
        // `${keyword}$` - keyword로 끝나는 제목만
        $regex: new RegExp(keyword, "i"),
      },
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const upload = (req, res) => {
  res.render("upload", { pageTitle: "Upload Video" });
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  //1. 영상삭제
  //delete와 remove 두개가 있는데 remove보단 delete를 사용하길 권장
  await Video.findByIdAndDelete(id);
  //2. home으로 돌아가도록 redirect
  return res.redirect("/");
};
