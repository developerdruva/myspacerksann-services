const corsOptions = {
  options: true,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies
};

module.exports = corsOptions;
