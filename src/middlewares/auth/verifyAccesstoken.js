const { CognitoJwtVerifier } = require("aws-jwt-verify");

const verifier = CognitoJwtVerifier.create({
  userPoolId: "ap-south-1_yOxYQDdhr",
  tokenUse: "access",
  clientId: "28fkbk0mju1tg6mft3or06h7kh",
});

const verifyAccesstoken = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: "No token provided" });

    const token = auth.split(" ")[1];
    const payload = await verifier.verify(token);

    req.user = payload; // attach decoded user to request
    next();
  } catch (err) {
    console.error("JWT validation error:", err);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyAccesstoken;
