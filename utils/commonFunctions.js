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
