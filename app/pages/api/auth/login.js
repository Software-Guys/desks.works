// import { Pool } from 'pg';
// import bcrypt from 'bcrypt';

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { email, password } = req.body;

//     try {
//       const client = await pool.connect();
//       const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
//       client.release();

//       if (result.rows.length > 0) {
//         const user = result.rows[0];
//         const match = await bcrypt.compare(password, user.password);

//         if (match) {
//           res.status(200).json({ message: 'Login successful' });
//         } else {
//           res.status(401).json({ error: 'Invalid credentials' });
//         }
//       } else {
//         res.status(401).json({ error: 'User not found' });
//       }
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   } else {
//     res.status(405).json({ error: 'Method not allowed' });
//   }
// }




import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      client.release();

      if (result.rows.length > 0) {
        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (match) {
          res.status(200).json({ message: 'Login successful' });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      } else {
        res.status(401).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
