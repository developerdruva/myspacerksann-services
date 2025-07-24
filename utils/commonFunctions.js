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

exports.awsClientS3 = () => {
  var { S3Client } = require("@aws-sdk/client-s3");
  let s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRETE_KEY,
    },
  });
  return s3;
};

exports.getClientIp = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",").shift() ||
    req.socket?.remoteAddress ||
    null
  );
};
