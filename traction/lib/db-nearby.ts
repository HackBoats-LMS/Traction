import { MongoClient, Db, ServerApiVersion } from 'mongodb';

if (!process.env.NEARBY_MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.NEARBY_MONGODB_URI;
const dbName = 'bni-connect';

const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().then(async (c) => {
      await setupIndexes(c.db(dbName));
      return c;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect().then(async (c) => {
    await setupIndexes(c.db(dbName));
    return c;
  });
}

async function setupIndexes(db: Db) {
  try {
    const users = db.collection('users');
    await users.createIndex({ email: 1 }, { unique: true });
    await users.createIndex({ location: "2dsphere" });
    await users.createIndex({ category: 1 });
    await users.createIndex({ name: "text", profession: "text", company: "text", city: "text" });
    await users.createIndex({ role: 1 });
    await users.createIndex({ isApproved: 1 });

    const notifications = db.collection('notifications');
    await notifications.createIndex({ userId: 1, createdAt: -1 });

    const messages = db.collection('messages');
    await messages.createIndex({ senderId: 1, receiverId: 1, createdAt: 1 });
  } catch (e) {
    console.error('Error setting up indexes', e);
  }
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

// Convenience helper to get the users collection
export async function getUsersCollection() {
  const db = await getDb();
  return db.collection('users');
}

// Convenience helper to get the notifications collection
export async function getNotificationsCollection() {
  const db = await getDb();
  return db.collection('notifications');
}


