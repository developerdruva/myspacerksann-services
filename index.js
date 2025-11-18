const express = require("express");
const dotenv = require("dotenv");
const DB = require("./db/mongo/mongoConnection");
dotenv.config();

// DB.connectToDB();
const PORT = process.env.PORT || 8080;

const cors = require("cors");

const MyspaceRoutes = require("./routes/myspace.routes");
const SampleDataRoutes = require("./routes/sample.data.routes");
const UserAccountRoutes = require("./routes/account.user.routes");
// const todoListRoutes = require('./routes/todolist.user.routes');
const corsOptions = require("./utils/corsOptions");

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
// app.options("*", cors(corsOptions)); // Enable pre-flight requests for all routes
app.use((req, res, next )=> {
  const timestamp = new Date();
  console.log(timestamp + " - "+ req.headers?.origin)
  next()
})

app.get("/", (webReq, webRes) => {
  //   console.log("welcome this is myspace rksann application running.");
  //   console.log(process.env.AWS_POSTGRES_DATABASE);
  webRes.send({
    status: "success",
    message: "Server running successfully. Welcome to Myspace RKSANN!",
  });
});
app.get("/sampleroute", (webReq, webRes) => {
  webRes.send({
    status: "success",
    message: "routes are working. this is sample route",
  });
});
app.use(MyspaceRoutes);
app.use(SampleDataRoutes);
app.use(UserAccountRoutes);

app.listen(PORT, () => {
  console.clear();
  console.log();
  console.log(
    "------------------------------ new run -------------------------------"
  );
  console.log(`server running on ${PORT}`);
});
