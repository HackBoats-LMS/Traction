require('dotenv').config({ path: '.env' });
const { MongoClient } = require('mongodb');

async function migrate() {
  const uri = process.env.NEARBY_MONGODB_URI;
  if (!uri) {
    console.error('Missing NEARBY_MONGODB_URI in .env');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('bni-connect');
  const users = db.collection('users');

  console.log('Finding users without GeoJSON location...');
  const cursor = users.find({ location: { $exists: false }, latitude: { $exists: true, $ne: null }, longitude: { $exists: true, $ne: null } });
  
  let count = 0;
  for await (const user of cursor) {
    if (user.longitude && user.latitude) {
      await users.updateOne(
        { _id: user._id },
        { 
          $set: { 
            location: {
              type: "Point",
              coordinates: [Number(user.longitude), Number(user.latitude)]
            }
          } 
        }
      );
      count++;
      if (count % 100 === 0) console.log(`Migrated ${count} users...`);
    }
  }

  console.log(`Migration complete. Migrated ${count} users.`);
  await client.close();
}

migrate().catch(console.error);
