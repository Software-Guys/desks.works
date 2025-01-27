import type { NextApiRequest, NextApiResponse } from 'next';
import User from 'models/user-model';
import { comparePasswords, generateToken } from 'utils/auth-utils';
import connectDB from 'utils/database';
import { z } from 'zod';

// Define the schema for the request body
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'POST') {
    try {
      // Validate the request body against the schema
      const { email, password } = loginSchema.parse(req.body);

      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Compare the provided password with the stored hash
      const isMatch = await comparePasswords(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Update the user's last login time
      user.lastLogin = new Date();
      await user.save();

      // Generate a JWT token
      const token = generateToken(user._id);

      // Return success response
      res.status(200).json({
        message: 'Login successful',
        token,
        userId: user._id,
      });
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }

      // Handle other errors
      res.status(500).json({
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}