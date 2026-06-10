import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = process.env.DATABASE_URL || 'mongodb+srv://akhilrajuvysyaraju19_db_user:Cct43Xvi7CiQRnGr@cluster0.8i6evxt.mongodb.net/bni-connect?retryWrites=true&w=majority';

const members = [
  { name: 'Arjun Mehta', email: 'arjun@techventures.in', password: 'password123', profession: 'Startup Founder', company: 'TechVentures India', bio: 'Building the future of fintech in India. 3x founder, angel investor.', city: 'Mumbai', availability: 'Open to Meet', latitude: 19.076, longitude: 72.8777 },
  { name: 'Priya Sharma', email: 'priya@designlabs.co', password: 'password123', profession: 'UX Director', company: 'DesignLabs', bio: 'Passionate about creating human-centered digital experiences.', city: 'Bangalore', availability: 'Available', latitude: 12.9716, longitude: 77.5946 },
  { name: 'Vikram Patel', email: 'vikram@cloudscale.io', password: 'password123', profession: 'CTO', company: 'CloudScale Solutions', bio: 'Infrastructure nerd. Scaling systems to millions.', city: 'Hyderabad', availability: 'Traveling', latitude: 17.385, longitude: 78.4867 },
  { name: 'Sneha Reddy', email: 'sneha@greeninvest.com', password: 'password123', profession: 'Angel Investor', company: 'GreenInvest Capital', bio: 'Investing in climate tech and sustainable startups.', city: 'Chennai', availability: 'Available', latitude: 13.0827, longitude: 80.2707 },
  { name: 'Rahul Gupta', email: 'rahul@legaledge.in', password: 'password123', profession: 'Legal Consultant', company: 'LegalEdge Partners', bio: 'Corporate law specialist focusing on startup compliance.', city: 'Delhi', availability: 'Busy', latitude: 28.6139, longitude: 77.209 },
  { name: 'Ananya Krishnan', email: 'ananya@marketpulse.co', password: 'password123', profession: 'Marketing Head', company: 'MarketPulse', bio: 'Growth marketing strategist. Helped 50+ startups.', city: 'Pune', availability: 'Open to Meet', latitude: 18.5204, longitude: 73.8567 },
  { name: 'Karthik Nair', email: 'karthik@aiworks.dev', password: 'password123', profession: 'AI Engineer', company: 'AI Works', bio: 'ML engineer specializing in NLP and computer vision.', city: 'Bangalore', availability: 'Available', latitude: 12.9352, longitude: 77.6245 },
  { name: 'Meera Joshi', email: 'meera@fundbridge.vc', password: 'password123', profession: 'Venture Capitalist', company: 'FundBridge VC', bio: 'Early-stage VC focusing on B2B SaaS and deep tech.', city: 'Mumbai', availability: 'Traveling', latitude: 19.0596, longitude: 72.8295 },
  { name: 'Aditya Singh', email: 'aditya@blockstack.io', password: 'password123', profession: 'Blockchain Developer', company: 'BlockStack Labs', bio: 'Web3 builder and DeFi enthusiast.', city: 'Gurgaon', availability: 'Open to Meet', latitude: 28.4595, longitude: 77.0266 },
  { name: 'Divya Menon', email: 'divya@hrconnect.in', password: 'password123', profession: 'HR Director', company: 'TalentBridge', bio: 'People-first leader building inclusive workplaces.', city: 'Kochi', availability: 'Available', latitude: 9.9312, longitude: 76.2673 },
  { name: 'Rohan Desai', email: 'rohan@supplychain.pro', password: 'password123', profession: 'Operations Head', company: 'LogiFlow', bio: 'Supply chain optimization specialist.', city: 'Ahmedabad', availability: 'Busy', latitude: 23.0225, longitude: 72.5714 },
  { name: 'Ishita Banerjee', email: 'ishita@contentcraft.co', password: 'password123', profession: 'Content Strategist', company: 'ContentCraft', bio: 'Storyteller at heart. Building brand narratives.', city: 'Kolkata', availability: 'Open to Meet', latitude: 22.5726, longitude: 88.3639 },
];

async function main() {
  console.log('🌱 Seeding database...');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('bni-connect');
  const users = db.collection('users');

  await users.deleteMany({});

  for (const m of members) {
    const hashedPassword = await bcrypt.hash(m.password, 10);
    await users.insertOne({
      ...m, password: hashedPassword, avatar: '',
      lastLocationUpdate: new Date(), createdAt: new Date(), updatedAt: new Date(),
    });
    console.log(`  ✓ ${m.name}`);
  }

  // Create email index
  await users.createIndex({ email: 1 }, { unique: true });

  console.log(`\n✅ Seeded ${members.length} members`);
  console.log('📧 Login with any email above + password: password123');

  await client.close();
}

main().catch(console.error);
