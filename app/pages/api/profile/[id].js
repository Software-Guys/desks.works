import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const profilesCollection = db.collection('profiles');

  const { id } = req.query;

  if (req.method === 'GET') {
    // Fetch user profile by ID
    const profile = await profilesCollection.findOne({ userId: id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    return res.status(200).json(profile);
  }

  if (req.method === 'POST') {
    // Update or create user profile
    const { username, bio, avatar_url } = req.body;
    const result = await profilesCollection.updateOne(
      { userId: id },
      {
        $set: {
          username,
          bio,
          avatar_url,
          updated_at: new Date()
        }
      },
      { upsert: true }
    );
    return res.status(200).json({ message: 'Profile updated successfully', result });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
