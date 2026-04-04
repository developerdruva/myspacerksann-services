const POOL = require("../../db/sql/connection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = process.env.JWT_EXPIRY || "24h";

// POST /api/auth/register
exports.register = async (req, res) => {
  const { user_id, username, password, email, first_name, last_name } =
    req.body;

  if (!username || !password || !email) {
    return res.status(400).json({
      status: "error",
      message: "username, password and email are required",
    });
  }

  try {
    const existing = await POOL.query(
      "SELECT user_id FROM public.user_accounts WHERE email = $1",
      [email],
    );
    if (existing.rows.length > 0) {
      return res
        .status(409)
        .json({ status: "error", message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const createdIp = req?.socket?.remoteAddress;

    await POOL.query(
      `INSERT INTO public.user_accounts
        (user_id, username, password, email, first_name, last_name, created_ip, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [
        user_id || null,
        username,
        hashedPassword,
        email,
        first_name || null,
        last_name || null,
        createdIp,
      ],
    );

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Error in register:", err);
    return res
      .status(500)
      .json({ status: "error", message: "Registration failed" });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "error", message: "email and password are required" });
  }

  try {
    const result = await POOL.query(
      "SELECT * FROM public.user_accounts WHERE email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ status: "failed", message: "Invalid email or password" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "failed", message: "Invalid email or password" });
    }

    const payload = {
      user_id: user.user_id,
      email: user.email,
      username: user.username,
      role: user.role || "user",
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: TOKEN_EXPIRY,
    });

    return res.json({
      status: "success",
      message: "Login successful",
      auth_token: token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (err) {
    console.error("Error in login:", err);
    return res.status(500).json({ status: "error", message: "Login failed" });
  }
};

// POST /api/auth/sso-token
// POST /api/auth/sso-token
exports.ssoToken = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ status: "error", message: "email is required" });
  }

  try {
    // 1. Check if user exists
    let result = await POOL.query(
      "SELECT * FROM authentication.user_accounts WHERE email = $1",
      [email],
    );

    let user = result.rows[0];

    // 2. Auto-create user if not found
    if (!user) {
      const inserted = await POOL.query(
        `INSERT INTO authentication.user_accounts (email, role, created_at)
           VALUES ($1, $2, NOW())
           RETURNING *`,
        [email, "user"],
      );
      user = inserted.rows[0];
    }

    // 3. Generate token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role || "user",
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: TOKEN_EXPIRY },
    );

    return res.json({
      status: "success",
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (err) {
    console.error("Error in ssoToken:", err);
    return res
      .status(500)
      .json({ status: "error", message: "SSO token generation failed" });
  }
};

// GET /api/auth/me  (requires Bearer token)
exports.me = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ status: "error", message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return res.json({
      status: "success",
      user: decoded,
    });
  } catch (err) {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid or expired token" });
  }
};
