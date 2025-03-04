import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  // Clear the token cookie
  const tokenCookie = serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    expires: new Date(0), // Explicitly expire the cookie
    path: "/",
  });

  res.setHeader("Set-Cookie", tokenCookie);
  return res.status(200).json({ success: true, message: "Logged out successfully" });
}

