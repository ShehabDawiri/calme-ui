// server/api/transcript.js
import express from 'express';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const MONGODB_URI = process.env.MONGODB_URI;

router.post('/store-transcript', async (req, res) => {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const document = {
      session_id: uuidv4(),
      ...req.body,
      metadata: {
        ...req.body.metadata,
        created_at: new Date()
      }
    };

    const database = client.db('maindb');
    const collection = database.collection('session');
    const result = await collection.insertOne(document);
    
    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    console.error('MongoDB error:', error);
    res.status(500).json({ error: 'Database operation failed' });
  } finally {
    await client.close();
  }
});

export default router;