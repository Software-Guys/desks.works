import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';
import User from 'models/user-model';
import connectDB from 'utils/database';

// 🔐 **Password Utilities**
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (
  inputPassword: string,
  storedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(inputPassword, storedPassword);
};

// 🔑 **Token Utilities**
export const generateToken = (userId: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables.');
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const validateToken = (token: string): string | null => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables.');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return typeof decoded === 'object' && 'id' in decoded ? decoded.id as string : null;
  } catch {
    return null;
  }
};

// 🛡 **Extract and Verify User from Request**
export const extractUserFromRequest = async (
  req: NextApiRequest
): Promise<{ success: boolean; user?: any; message?: string; status?: number }> => {
  try {
    // Extract token from cookies
    const cookies = parseCookies({ req });
    const token = cookies.token;

    if (!token) {
      return { 
        success: false, 
        message: "Unauthorized: No token provided",
        status: 401
      };
    }

    // Ensure JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set in environment variables.");
      return { 
        success: false, 
        message: "Server configuration error",
        status: 500
      };
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };

    // Fetch user from database
    await connectDB();
    const user = await User.findById(decoded.id).select("-password"); // Exclude password

    if (!user) {
      return { 
        success: false, 
        message: "User not found",
        status: 404
      };
    }

    return { success: true, user };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { 
        success: false, 
        message: "Token has expired, please log in again",
        status: 401
      };
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return { 
        success: false, 
        message: "Invalid token, authentication failed",
        status: 401
      };
    }

    console.error("Token verification error:", error);
    return { 
      success: false, 
      message: "Internal server error",
      status: 500
    };
  }
};

// 🔒 **Middleware to Protect API Routes**
export const withAuth = (
  handler: (req: NextApiRequest, res: NextApiResponse, user: any) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authResult = await extractUserFromRequest(req);
    
    if (!authResult.success) {
      return res.status(authResult.status || 401).json({ 
        success: false, 
        message: authResult.message 
      });
    }
    
    // Call the original handler with the authenticated user
    return handler(req, res, authResult.user);
  };
};
