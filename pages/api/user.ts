import type { NextApiRequest, NextApiResponse } from "next";
import User from "models/user-model";
import { validateToken } from "utils/auth-utils"; // Uses token-extraction logic
import connectDB from "utils/database";
import { parseCookies } from "nookies";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    // Extract token from cookies
    const cookies = parseCookies({ req });
    const token = cookies.token; // Ensure this matches the cookie name in login.ts

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    // Validate token using `token-extraction.ts` logic
    const userId = validateToken(token);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    // Fetch user data (excluding password)
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
