const allowedOrigins = [
  "https://myspace-rajesh.netlify.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://192.168.29.249:3001",
  "http://192.168.29.248:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("CORS origin:", origin);
    // Allow requests with no origin (Postman/cURL) or from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

module.exports = corsOptions;
