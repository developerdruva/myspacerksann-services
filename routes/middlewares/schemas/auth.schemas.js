const { z } = require("zod");

const registerSchema = z.object({
  user_id: z.string().optional(),
  username: z.string().min(3, "username must be at least 3 characters"),
  password: z.string().min(6, "password must be at least 6 characters"),
  email: z.string().email("invalid email format"),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("invalid email format"),
  password: z.string().min(1, "password is required"),
});

const ssoTokenSchema = z.object({
  email: z.string().email("invalid email format"),
});

module.exports = {
  registerSchema,
  loginSchema,
  ssoTokenSchema,
};
