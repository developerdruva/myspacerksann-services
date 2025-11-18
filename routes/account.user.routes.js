var express = require("express");
var router = express.Router();
var userAccountController = require("../controllers/user.accounts/registration.controller");
const {
  uploadS3bucketMiddleware,
} = require("./middlewares/personDetailsMiddlewares/persondetails.middleware");
const uploadToBucket = uploadS3bucketMiddleware();

router.post("/chatbotusercreate", userAccountController?.registerUser);
router.post("/chatbotuserlogin", userAccountController?.loginUser);
router.post("/loginSimple", userAccountController.loginSimple);
router.post(
  "/saveprofiledetails",
  uploadToBucket.fields([
    { name: "profile_pic", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  userAccountController.saveProfileDetails
);

module.exports = router;

// const ds = multer.diskStorage({
//     destination: 'uploads',
//     filename: (req, file, cb)=>{
//         cb(null, Date.now()+'-'+file.originalname);
//     }
// })

// const multerStorage = multer({storage: ds});
