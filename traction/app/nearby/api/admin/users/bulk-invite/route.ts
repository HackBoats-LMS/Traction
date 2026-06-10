import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/nearby-auth';
import { getUsersCollection } from '@/lib/db-nearby';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const usersCol = await getUsersCollection();
    if (session.userId !== 'admin_user_id') {
      const adminUser = await usersCol.findOne({ _id: new ObjectId(session.userId) });
      if (!adminUser || adminUser.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const body = await request.json();
    const { users: newUsers } = body;

    if (!newUsers || !Array.isArray(newUsers) || newUsers.length === 0) {
      return NextResponse.json({ error: 'Valid users array is required' }, { status: 400 });
    }

    let addedCount = 0;
    let skippedCount = 0;

    for (const u of newUsers) {
      if (!u.email) {
        skippedCount++;
        continue;
      }
      
      const email = u.email.trim().toLowerCase();
      const existingUser = await usersCol.findOne({ email });
      
      if (existingUser) {
        skippedCount++;
        continue;
      }

      const newUser = {
        name: u.name || '',
        email,
        password: '',
        profession: u.profession || '',
        company: u.company || '',
        bio: '',
        avatar: '',
        city: '',
        availability: 'Available',
        latitude: null,
        longitude: null,
        address: '',
        currentLatitude: null,
        currentLongitude: null,
        currentCity: '',
        lastLocationUpdate: null,
        authProvider: 'google',
        role: 'user',
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await usersCol.insertOne(newUser);
      addedCount++;
    }

    return NextResponse.json({ success: true, addedCount, skippedCount });
  } catch (error) {
    console.error('Failed to bulk invite users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
