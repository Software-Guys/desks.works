import type { NextApiRequest, NextApiResponse } from 'next';
import User from 'models/user-model';
import { hashPassword, generateToken } from 'utils/auth-utils';
import connectDB from 'utils/database';
import { z } from 'zod';

// Define the schema for the request body
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'POST') {
    try {
      // Validate the request body against the schema
      const { email, password } = registerSchema.parse(req.body);

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Create a new user
      const user = new User({
        email,
        password: hashedPassword,
      });

      // Save the user to the database
      await user.save();

      // Generate a JWT token
      const token = generateToken(user._id);

      // Return success response
      res.status(201).json({
        message: 'User registered successfully',
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
        message: 'Registration failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}