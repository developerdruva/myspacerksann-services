const corsOptions = {
  origin: [
    "*",
    "https://myspace-rajesh.netlify.app",
    "http://localhost:3000",
    "http://localhost:3001",
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies
};

module.exports = corsOptions;
