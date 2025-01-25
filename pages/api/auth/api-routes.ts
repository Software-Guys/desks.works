import type { NextApiRequest, NextApiResponse } from 'next';
import User from '../../models/User';
import { hashPassword, generateToken } from '../../utils/auth';
import connectDB from '../../utils/database';

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  await connectDB();

  switch (req.method) {
    case 'POST':
      return await handleRegistration(req, res);
    case 'GET':
      return await handleLogin(req, res);
    default:
      res.setHeader('Allow', ['POST', 'GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handleRegistration(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate token
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
}

async function handleLogin(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  try {
    const { email, password } = req.query;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await comparePasswords(
      password as string, 
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
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
}