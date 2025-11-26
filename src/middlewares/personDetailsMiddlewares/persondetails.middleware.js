const { dateTimeString } = require("../../../utils/commonFunctions");
const { awsClientS3 } = require("../../../configs/cloud/aws-configs");

exports.uploadS3bucketMiddleware = () => {
  console.log("hi in upload middleware ");
  var multer = require("multer");
  var multerS3 = require("multer-s3");
  // const { dateTimeString, awsClientS3 } = require('../utils/commonFunctions');

  const uploadToBucket = multer({
    storage: multerS3({
      bucket: process.env.AWS_S3_BUCKET,
      s3: awsClientS3(),
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: "public-read",
      metadata: (req, file, cb) => {
        console.log("inside upload bucket cb", file.originalname);
        console.log("inside upload bucket file", file);
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        console.log("inside upload bucket cb", file.originalname);
        cb(
          null,
          `${process.env.AWS_S3_PERSONDETAILS_PATH}${dateTimeString()}-` +
            file.originalname
        );
      },
    }),
  });
  return uploadToBucket;
};
