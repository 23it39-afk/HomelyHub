import jwt from "jsonwebtoken";

const signinToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signinToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "Success",
    token,
    user,
  });
};

const defaultAvatarUrl = (name) =>
  "https://ui-avatars.com/api/?name=" +
  encodeURIComponent(name || "User") +
  "&background=0e8b53&color=fff&size=256&bold=true";

const filterObj = (obj, ...allowedFeilds) => {
  let newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFeilds.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

export {
  signinToken,
  createSendToken,
  defaultAvatarUrl,
  filterObj,
};