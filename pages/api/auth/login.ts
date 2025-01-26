import type { NextApiRequest, NextApiResponse } from 'next';
import User from 'models/user-model';
import { generateToken, comparePasswords } from 'utils/auth-utils';
import connectDB from 'utils/database';

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await comparePasswords(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      user.lastLogin = new Date();
      await user.save();

      const token = generateToken(user._id);

      res.status(200).json({
        message: 'Login successful',
        token,
        userId: user._id
      });
    } catch (error) {
      res.status(500).json({
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}