import User from "../models/User";
import bcrypt from "bcrypt";
import path from "path";
import { spawn } from "child_process";

const loginUserToSession = async (req, user) => {
  req.session.isLoggedIn = true;
  req.session.loggedInUser = user;
};

export const getSignup = (req, res) => {
  try {
    return res.render("signup", { pageTitle: "회원가입" });
  } catch (errorMessage) {
    return res
      .status(400)
      .render("signup", { pageTitle: "에러", errorMessage });
  }
};

export const postSignup = async (req, res) => {
  try {
    const { id, pw, name, stuId, userType } = req.body;
    if (userType === "professor" && stuId) {
      stuId = "";
    }

    if (userType === "student" && !stuId) {
      return res.render("signup", {
        pageTitle: "회원가입",
        errorMessage:
          "학생 회원은 학번을 반드시 입력해야 합니다. 다시 시도해주세요.",
      });
    }

    const existsId = await User.exists({ id });
    if (existsId) {
      return res.status(400).render("signup", {
        pageTitle: "회원가입",
        errorMessage:
          "같은 아이디를 가진 계정이 이미 존재합니다. 다시 시도해주세요.",
      });
    }
    const existsStuId =
      (await User.exists({ stuId })) && userType === "student";
    if (existsStuId) {
      return res.status(400).render("signup", {
        pageTitle: "회원가입",
        errorMessage:
          "같은 학번을 가진 계정이 이미 존재합니다. 다시 시도해주세요.",
      });
    }

    const user = await User.create({
      id,
      pw,
      name,
      stuId,
      userType,
      lectureIds: [],
      quizId: [],
      grade: [],
    });
    loginUserToSession(req, user);
    return res.redirect("/");
  } catch (errorMessage) {
    return res.status(400).render("signup", {
      pageTitle: "에러",
      errorMessage,
    });
  }
};

export const getLogin = (req, res) => {
  try {
    return res.render("login", { pageTitle: "로그인" });
  } catch (errorMessage) {
    return res.status(400).render("login", { pageTitle: "에러", errorMessage });
  }
};

export const postLogin = async (req, res) => {
  try {
    const { id, pw, encryptedId, encryptedPw } = req.body; // get Id and Pw from url query
    console.log(id, pw, encryptedId, encryptedPw);
    if (!encryptedId || !encryptedPw) {
      return res.status(400).render("login", {
        pageTitle: "로그인",
        errorMessage:
          "ID와 비밀번호를 모두 제공해야 합니다. 다시 시도해주세요.",
      });
    }

    const decryption = new Promise((resolve, reject) => {
      // give C file the encoded id&pw
      const cfileDirectory = path.join("src", "controllers", "login.exe"); // C file directory
      const child = spawn(cfileDirectory, [encryptedId, encryptedPw]);

      let cFileOutput = "";

      child.stdout.on("data", (data) => {
        cFileOutput += data.toString();
      });

      child.on("close", (code) => {
        if (code === 0) {
          // C file succeed and handle cFileOutput here
          resolve(cFileOutput);
        } else {
          reject(new Error("C program went wrong"));
        }
      });
    });

    const cFileOutput = await decryption;
    const [decryptedId, decryptedPw] = cFileOutput.split(" ");

    console.log(decryptedPw);
    if (/\s/.test(decryptedPw)) console.log("The string contains whitespace.");

    const user = await User.findOne({ id: decryptedId });
    if (!user) {
      return res.status(400).render("login", {
        pageTitle: "로그인",
        errorMessage: "계정이 존재하지 않습니다. 다시 시도해주세요.",
      });
    }

    const ok = await bcrypt.compare(decryptedPw, user.pw);
    console.log(ok);
    if (!ok) {
      return res.status(400).render("login", {
        pageTitle: "로그인",
        errorMessage: "비밀번호가 올바르지 않습니다. 다시 시도해주세요.",
      });
    }
    await loginUserToSession(req, user);

    return res.redirect("/");
  } catch (errorMessage) {
    return res.status(400).render("login", {
      pageTitle: "에러",
      errorMessage,
    });
  }
};

export const getLogout = async (req, res) => {
  await req.session.destroy((err) => {
    if (err) {
      return res.status(400).render("home", {
        pageTitle: "에러",
        errorMessage,
      });
    } else {
      return res.redirect("/");
    }
  });
};
