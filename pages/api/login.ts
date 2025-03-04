import type { NextApiRequest, NextApiResponse } from "next";
import User from "models/user-model";
import connectDB from "utils/database";
import { comparePasswords, generateToken } from "utils/auth-utils";
import { serialize } from "cookie";
import { z } from "zod";

// Define request schema validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  
  if (req.method !== "POST") {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    // Validate request body using Zod
    const { email, password } = loginSchema.parse(req.body);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the stored hash
    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update user's last login time
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Set HttpOnly cookie
    const tokenCookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Apply cookie to response header
    res.setHeader("Set-Cookie", tokenCookie);

    // Return success response with user details (excluding password)
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name || email.split("@")[0],
      },
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }

    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
