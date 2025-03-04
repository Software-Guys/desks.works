import type { NextApiRequest, NextApiResponse } from "next";
import User from "models/user-model";
import { hashPassword, generateToken } from "utils/auth-utils";
import connectDB from "utils/database";
import { serialize } from "cookie";
import { z } from "zod";

// Define the schema for the request body
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== "POST") {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    // Validate the request body against the schema
    const { email, password } = registerSchema.parse(req.body);

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create and save the new user
    const user = new User({ email, password: hashedPassword });
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Set HttpOnly cookie
    const tokenCookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // Secure in production
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Set cookie in response header
    res.setHeader("Set-Cookie", tokenCookie);

    // Return success response without exposing the token
    return res.status(201).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name || email.split("@")[0], // Default name from email
      },
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }

    console.error("Registration error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
