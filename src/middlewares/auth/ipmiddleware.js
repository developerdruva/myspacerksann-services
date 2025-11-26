var requestIp = require("request-ip");

const getIPmiddleware = (req, res, next) => {
  console.log("hi in middleware ", requestIp?.getClientIp(req));
  if (req?.id) {
    next();
  } else {
    res?.send({
      status: "not access",
      message: "data not found",
    });
  }
};

module.exports = getIPmiddleware;
