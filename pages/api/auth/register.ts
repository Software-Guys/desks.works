import type { NextApiRequest, NextApiResponse } from 'next';
import User from 'models/user-model';
import { hashPassword, generateToken } from 'utils/auth-utils';
import connectDB from 'utils/database';

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await hashPassword(password);

      const user = new User({
        email,
        password: hashedPassword
      });

      await user.save();

      const token = generateToken(user._id);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        userId: user._id
      });
    } catch (error) {
      res.status(500).json({
        message: 'Registration failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}