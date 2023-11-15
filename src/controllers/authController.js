import User from "../models/User";
import bcrypt from "bcrypt";
import path from "path";
import { spawn } from "child_process";
import CryptoJS from "crypto-js";

const loginUserToSession = async (req, user) => {
  req.session.isLoggedIn = true;
  req.session.loggedInUser = user;
};

function decryptWithAES(ciphertext, key) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export const getSignup = (req, res) => {
  try {
    return res.render("signup", { pageTitle: "signup" });
  } catch (errorMessage) {
    return res
      .status(400)
      .render("signup", { pageTitle: "error", errorMessage });
  }
};

export const postSignup = async (req, res) => {
  try {
    const { AESId, AESPw, name, stuId, userType } = req.body;
    const key = "ktkl-blackboard";
    const id = decryptWithAES(AESId, key);
    const pw = decryptWithAES(AESPw, key);

    if (userType === "professor" && stuId) {
      stuId = "";
    }

    if (userType === "student" && !stuId) {
      return res.render("signup", {
        pageTitle: "signup",
        errorMessage:
          "Student account must enter their school number. Please try again.",
      });
    }

    const existsId = await User.exists({ id });
    if (existsId) {
      return res.status(400).render("signup", {
        pageTitle: "signup",
        errorMessage:
          "An account with the same ID already exists. Please try again.",
      });
    }
    const existsStuId =
      (await User.exists({ stuId })) && userType === "student";
    if (existsStuId) {
      return res.status(400).render("signup", {
        pageTitle: "signup",
        errorMessage:
          "An account with the same student number already exists. Please try again.",
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
      pageTitle: "error",
      errorMessage,
    });
  }
};

export const getLogin = (req, res) => {
  try {
    return res.render("login", { pageTitle: "login" });
  } catch (errorMessage) {
    return res
      .status(400)
      .render("login", { pageTitle: "error", errorMessage });
  }
};

export const postLogin = async (req, res) => {
  try {
    const { AESId, AESPw } = req.body; // get Id and Pw from url query

    if (!AESId || !AESPw) {
      return res.status(400).render("login", {
        pageTitle: "login",
        errorMessage:
          "You must provide both your ID and password. Please try again.",
      });
    }

    const key = "ktkl-blackboard";
    const encryptedId = decryptWithAES(AESId, key);
    const encryptedPw = decryptWithAES(AESPw, key);

    const decryption = new Promise((resolve, reject) => {
      // give C file the encoded id&pw
      const cfileDirectory = path.join("src", "controllers", "login"); // C file directory
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

    if (/\s/.test(decryptedPw)) console.log("The string contains whitespace.");

    const user = await User.findOne({ id: decryptedId });
    if (!user) {
      return res.status(400).render("login", {
        pageTitle: "login",
        errorMessage: "Account does not exist. Please try again.",
      });
    }

    const ok = await bcrypt.compare(decryptedPw, user.pw);
    console.log(ok);
    if (!ok) {
      return res.status(400).render("login", {
        pageTitle: "login",
        errorMessage: "The password is not valid. Please try again.",
      });
    }
    await loginUserToSession(req, user);

    return res.redirect("/");
  } catch (errorMessage) {
    return res.status(400).render("login", {
      pageTitle: "error",
      errorMessage,
    });
  }
};

export const getLogout = async (req, res) => {
  await req.session.destroy((err) => {
    if (err) {
      return res.status(400).render("home", {
        pageTitle: "error",
        errorMessage,
      });
    } else {
      return res.redirect("/");
    }
  });
};
