const allowedOrigins = [
  "https://myspace-rajesh.netlify.app",
  "http://localhost:3000",
  "http://localhost:3001",
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("CORS origin:", origin); // Debug log
    // Allow if origin is in allowed list or if it's undefined (like in Postman or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["*"], // Allow all headers for debugging
  credentials: true,
};

module.exports = corsOptions;
