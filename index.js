const express = require("express");
const dotenv = require("dotenv");
const DB = require("./config/configs/db/mongo/mongoConnection");
dotenv.config();

// DB.connectToDB();
const PORT = process.env.PORT || 8080;

const cors = require("cors");

const MyspaceRoutes = require("./src/src/routes/myspace.routes");
const SampleDataRoutes = require("./src/src/routes/sample.data.routes");
const UserAccountRoutes = require("./src/src/routes/account.user.routes");
// const todoListRoutes = require('./src/src/routes/todolist.user.routes');
const corsOptions = require("./utils/corsOptions");
const particularsRoutes = require("./routes/particulars/paticulars.routes");
const paymentRoutes = require("./routes/particulars//payments.routes");
const dashboardRoutes = require("./routes/particulars//partdashboard.routes");
const documentParticularsRoutes = require("./routes/documentparticulars.routes");
const incomeRoutes = require("./routes/monthly-spends/income.routes");
const analyzerRoutes = require("./routes/monthly-spends/analyzer.routes");
const expensesRoutes = require("./routes/monthly-spends/expenses.routes");
const authRoutes = require("./routes/auth/auth.routes");

const app = express();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

app.use(helmet());

// Global rate limiter — 100 requests per 15 min per IP across all routes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many requests, please try again later",
  },
});
app.use(globalLimiter);

// Stricter limiter for auth routes — 20 requests per 15 min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many auth attempts, please try again later",
  },
});

app.use(express.json());
app.use(cors(corsOptions));
// app.options("*", cors(corsOptions)); // Enable pre-flight requests for all routes
morgan.token("origin", (req) => req.headers.origin || "-");
app.use(
  morgan(
    ':date[iso] :method :url :status :response-time ms origin=":origin" ip=:remote-addr',
  ),
);

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
// app.use(SampleDataRoutes);
// app.use(UserAccountRoutes);
app.use("/api/particulars", particularsRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/document-particulars", documentParticularsRoutes);
app.use("/api/monthly-spends/income", incomeRoutes);
app.use("/api/monthly-spends/analyzer", analyzerRoutes);
app.use("/api/monthly-spends/expenses", expensesRoutes);

app.use("/api/partdashboard", dashboardRoutes);
app.listen(PORT, () => {
  console.clear();
  console.log();
  console.log(
    "------------------------------ new run -------------------------------",
  );
  console.log(`server running on ${PORT}`);
});
