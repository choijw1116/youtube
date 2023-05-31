import { application } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  const { name, username, email, password, password2, location } = req.body;
  const pageTitle = "Join";
  //password 와 confirm password 비교확인
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password Confirmation does not match",
    });
  }
  //입력한 username을 가진 User가 있는지 찾아본다
  //username과 email 둘다 확인해보기 위해서 중복된 코드를 쓰지 않기 위해 $or 을 사용한다
  const exists = await User.exists({
    $or: [{ username }, { email }],
  });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken",
    });
  }
  try {
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
    //DB에 바로 password를 저장하는것은 위험하다. 따라서 해시(hash)화 해주어야한다.
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  //입력된 username과 password를 받는다
  const { username, password } = req.body;
  const pageTitle = "Login";
  //받은 username과 일치하는 User가 있는지 확인 mongoose사용을 위해 async await 사용
  const user = await User.findOne({ username, socialOnly: false });

  //계정이 존재하는지 체크
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists",
    });
  }

  //패스워드가 일치하는지 체크
  //1. 유저가 로그인하려는 계정이 무엇인지 알아내기 -> User.findeOne()사용
  //2. bcrypt의 compare사용
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong Password",
    });
  }

  //user가 login하면 해당 user에 대한 정보를 session에 담는다
  //session에 user정보추가하기
  //실제로 세션을 initialize하는 부분은 아래 두줄
  req.session.loggedIn = true;
  req.session.user = user; //DB에서 찾은 user를 담아줌
  console.log("LogIn Coming Soon");
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email", //가운데는 꼭 공백으로 두어야한다.
  };
  const params = new URLSearchParams(config).toString(); //URLSearchParams(config).toString()로 toString을 붙여주면 인코딩되어 결과물을 얻을 수 있다.
  const finalUrl = `${baseUrl}?${params}`; //query안에 params를 넣어준다
  return res.redirect(finalUrl); //해당url로 이동시키기
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };

  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  //뭔가 하고싶거나 뭔가 가져오고싶을때 -> fetch사용. Post로 URL에 뭔가 보내주고 있기 때문에
  // const data = await fetch(finalUrl, {
  //   method: "POST",
  //   headers: {
  //     Accept: "application/json",
  //   }, //JSON을 return받기 위해 넣어줘야함
  // }); //finalUrl에 POST요청을 보냄, fetch를 통해 데이터를 받아옴
  // const json = await data.json(); //그 데이터에서 JSON을 추출한다

  //위의 json이 await를 두번쓰는 꼴이나 다름없으므로 await을 밖에 한번 더 감싸고 json()해주면 fetch로 데이터를 받아온 것에서 JSON을 추출하도록 하나로 합칠 수 있다.
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      }, //JSON을 return받기 위해 넣어줘야함
    })
  ).json(); //finalUrl에 POST요청을 보냄, fetch를 통해 데이터를 받아옴
  //json(tokenRequest)에 access_token이 있는 경우 API에 접근하도록 한다
  if ("access_token" in tokenRequest) {
    //API에 접근
    const { access_token } = tokenRequest; //JSON에서 access_token을 꺼냄
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        }, //access_token을 fetch안의 headers로 보냄
      })
    ).json(); //fetch요청을 하고 있으므로 fetch가 돌아오면 해당 fetch의 JSON을 받게된다.
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        }, //access_token을 fetch안의 headers로 보냄
      })
    ).json(); //email data 가져오기
    //깃헙이 주는 list에서 primary이면서 verified된 email객체를 찾는다
    const emailObj = emailData.find((email) => {
      email.primary === true && email.verified === true;
    });
    console.log(emailObj);
    if (!emailObj) {
      return res.redirect("/login");
    }
    //같은 email을 가진 user가 이미 있다면 그 유저를 로그인 시켜준다
    let user = await User.find({ email: emailObj.email });
    //해당 email을 가진 user가 있다면 로그인시켜준다
    if (!user) {
      //해당 email이 없으므로 계정생성
      //User.create()는 새로 만든 user를 return 시켜준다
      user = await User.create({
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
      req.session.loggedIn = true;
      req.session.user = user; //DB에서 찾은 user를 담아줌
      return res.redirect("/"); //홈으로 redirect
    }
  } else {
    //res안에 access_token이 없다면 login으로 redirect
    //추후 notification 구현 후 수정!
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  res.send("logout user");
};

export const editUser = (req, res) => {
  res.send("Edit user");
};
export const deleteUser = (req, res) => {
  res.send("Delete user");
};

export const watch = (req, res) => {
  res.send("watch");
};
