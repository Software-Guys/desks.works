import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, username } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const client = await pool.connect();
      await client.query('INSERT INTO users (email, password, username) VALUES ($1, $2, $3)', [email, hashedPassword, username]);
      client.release();

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        res.status(409).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
