import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

export const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET || '', 
    { expiresIn: '7d' }
  );
};

export const validateToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    return typeof decoded === 'object' ? decoded.id : null;
  } catch {
    return null;
  }
};
