exports.dateTimeString = () => {
  let date = new Date();
  let dateTimeString = date
    .toLocaleString("hi-IN", {
      hour12: false,
      timeZone: "Asia/Kolkata",
      format: "dd-mm-yyyy",
    })
    .replaceAll(", ", "");
  return dateTimeString.replaceAll("/", "").replaceAll(":", "");
};

exports.getClientIp = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",").shift() ||
    req.socket?.remoteAddress ||
    null
  );
};

const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  7, // random part
);

const getCategoryPrefix = (category) => {
  if (!category) return "XXX";

  return category
    .replace(/\s+/g, "") // remove spaces
    .toUpperCase()
    .substring(0, 3) // first 3 chars
    .padEnd(3, "X"); // fill if short
};

exports.generateShortId = (category) => {
  const prefix = getCategoryPrefix(category);
  const random = nanoid();

  return `${prefix}${random}`;
};
